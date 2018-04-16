// Import CSS
require('normalize.css');
require('app/main.scss');

// Import JS
require('./compass.js');

let audioContext;
let scene;
let audioElements = [];
let soundSources = [];
let audioElementSource;
let heading = 0;
let lat = 31.771947;
let long = 35.204153;

let sources = [
  {
    name: 'Jaffa Gate / Old City',
    id: 'oldcity',
    lat: 31.776598,
    long: 35.227609,
    src: './assets/song.wav'
  },
  {
    name: 'Beit Hansen',
    id: 'hansen',
    lat: 31.767683,
    long: 35.217123,
    src: './assets/piano.wav'
  },
  {
    name: 'The Knesset',
    id: 'knesset',
    lat: 31.77663,
    long: 35.205471,
    src: './assets/trumpet.wav'
  },
  {
    name: 'Mahane Yehuda Market',
    id: 'market',
    lat: 31.784851,
    long: 35.212643,
    src: './assets/drums.wav'
  },
  {
    name: 'Yad Vashem / Mt. Herzl',
    id: 'herzl',
    lat: 31.774192,
    long: 35.176195,
    src: './assets/violin.wav'
  },
  {
    name: 'Teddy Stadium',
    id: 'teddy',
    lat: 31.750973,
    long: 35.190621,
    src: './assets/bird1.wav'
  },
  {
    name: 'Ammunition Hill',
    id: 'hill',
    lat: 31.798014,
    long: 35.227671,
    src: './assets/bird2.wav'
  },
  {
    name: 'The Israel Museum',
    id: 'museum',
    lat: 31.771947,
    long: 35.204153,
    src: './assets/song.wav'
  }
];

let hints = ['knesset', 'hansen', 'herzl', 'market'];
let hintSources = sources.filter(source => hints.indexOf(source.id) != -1);

let roomDimensions = {
  width: 20,
  height: 5,
  depth: 20
};
let roomMaterials = {
  brick: {
    left: 'brick-bare',
    right: 'brick-bare',
    up: 'brick-bare',
    down: 'wood-panel',
    front: 'brick-bare',
    back: 'brick-bare'
  },
  curtains: {
    left: 'curtain-heavy',
    right: 'curtain-heavy',
    up: 'wood-panel',
    down: 'wood-panel',
    front: 'curtain-heavy',
    back: 'curtain-heavy'
  },
  marble: {
    left: 'marble',
    right: 'marble',
    up: 'marble',
    down: 'marble',
    front: 'marble',
    back: 'marble'
  },
  outside: {
    left: 'transparent',
    right: 'transparent',
    up: 'transparent',
    down: 'grass',
    front: 'transparent',
    back: 'transparent'
  }
};
let audioReady = false;
let isPlaying = false;
let distScale = 0.01;

function rotateListener(deg) {
  // Update only on change of more than 2 degrees from last measurement
  if (
    !audioReady ||
    (Math.floor(deg) >= heading - 2 && Math.floor(deg) <= heading + 2)
  )
    return;

  heading = deg;
  let angle = toRadians(deg);
  let x = Math.cos(angle);
  let y = Math.sin(angle);
  scene.setListenerOrientation(x, y, 0, 0, 0, 1);
}

function setDistance(d) {
  if (!audioReady) return;
  updatePositions();
  distScale = 1 / d;
}

function updatePositions() {
  if (!audioReady) return;
  for (let i = 0; i < hintSources.length; i++) {
    let deg = geolib.getBearing(
      { latitude: lat, longitude: long },
      { latitude: hintSources[i].lat, longitude: hintSources[i].long }
    );
    let distance =
      geolib.getDistance(
        { latitude: lat, longitude: long },
        { latitude: hintSources[i].lat, longitude: hintSources[i].long }
      ) * distScale;

    let x = Math.cos(toRadians(deg)) * 15;
    let y = Math.sin(toRadians(deg)) * 15;
    soundSources[i].setPosition(x, y, 0);
    console.log(hintSources[i].name);
    console.log(deg + ':' + degToCompass(deg));
    console.log(x, y);
  }
}

function updateLocation(pos) {
  // lat = pos.coords.latitude;
  // long = pos.coords.longitude;
  document.getElementById('lat').innerHTML =
    geolib.decimal2sexagesimal(lat) + ' N';
  document.getElementById('long').innerHTML =
    geolib.decimal2sexagesimal(long) + ' E';
}

function degToCompass(deg) {
  if (deg >= 337.5 || deg < 22.5) return 'N';
  if (deg >= 22.5 && deg < 67.5) return 'NE';
  if (deg >= 67.5 && deg < 112.5) return 'E';
  if (deg >= 112.5 && deg < 157.5) return 'SE';
  if (deg >= 157.5 && deg < 202.5) return 'S';
  if (deg >= 202.5 && deg < 247.5) return 'SW';
  if (deg >= 247.5 && deg < 292.5) return 'W';
  if (deg >= 292.5 && deg < 337.5) return 'NW';
  return 'error';
}

function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  scene = new ResonanceAudio(audioContext, { ambisonicOrder: 1 });
  scene.setRoomProperties(roomDimensions, roomMaterials.outside);

  let audioElementSources = [];
  for (let i = 0; i < hintSources.length; i++) {
    // create audio elements
    audioElements[i] = document.createElement('audio');
    audioElements[i].src = hintSources[i].src;
    audioElements[i].load();
    audioElements[i].loop = true;
    audioElements[i].crossOrigin = 'anonymous';
    audioElementSources[i] = audioContext.createMediaElementSource(
      audioElements[i]
    );

    // create audio sources and add to scene
    soundSources[i] = scene.createSource();
    audioElementSources[i].connect(soundSources[i].input);
  }

  scene.output.connect(audioContext.destination);

  audioReady = true;
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

// Listeners
let onLoad = function() {
  initAudio();

  // Get location
  // let watchId = navigator.geolocation.watchPosition(
  //   updateLocation,
  //   function(error) {
  //     alert('Cannot get location');
  //     console.log(error);
  //   },
  //   { enableHighAccuracy: true }
  // );

  Compass.watch(function(heading) {
    document.getElementById('heading').innerHTML = degToCompass(heading);
    rotateListener(heading);
  });

  for (let i = 0; i < hintSources.length; i++) {
    let hintButton = document.createElement('button');
    hintButton.innerHTML = hintSources[i].name;
    hintButton.classList.add('hint');
    hintButton.onclick = () => {
      audioElements[i].paused
        ? audioElements[i].play()
        : audioElements[i].pause();
    };
    document.getElementById('hints').append(hintButton);
  }

  document.getElementById('play').addEventListener('click', function(e) {
    audioContext.resume();
    if (!audioReady) return;
    if (isPlaying) {
      audioElements.forEach(element => {
        element.pause();
      });
      isPlaying = false;
      e.target.innerHTML = 'Play All';
    } else {
      updatePositions();

      audioElements.forEach(element => {
        element.play();
      });
      isPlaying = true;
      e.target.innerHTML = 'Pause All';
    }

    document.getElementById('play').addEventListener('touchstart', function(e) {
      e.target.classList.add('active');
    });

    document.getElementById('play').addEventListener('touchend', function(e) {
      e.target.classList.remove('active');
    });
  });

  // document.getElementById('dist').addEventListener('input', function(e) {
  //   setDistance(e.target.value);
  // });
};

window.addEventListener('load', onLoad);
