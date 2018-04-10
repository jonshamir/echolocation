// Import CSS
require('normalize.css');
require('app/main.scss');

// Import JS
require('./compass.js');
Geo = require('geolib');

let audioContext;
let scene;
let audioElements = [];
let soundSources = [];
let audioElementSource;
let heading = 0;
let lat = 31.77247675;
let long = 35.21536082;

// Hansen:
// lat: 31.767656,
// long: 35.216977,

let sources = [
  {
    lat: 31.767436,
    long: 35.215317,
    src: './assets/song.wav'
  }
  // {
  //   lat: 31.775425,
  //   long: 35.219952,
  //   src: './assets/bird1.wav'
  // },
  // {
  //   lat: 31.775643,
  //   long: 35.210468,
  //   src: './assets/speech.wav'
  // }
];

let roomDimensions = {
  width: 10,
  height: 5,
  depth: 10
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
let compassReady = false;
let isPlaying = false;
let distScale = 0.02;

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
  for (let i = 0; i < sources.length; i++) {
    let angle = Geo.getBearing(
      { latitude: lat, longitude: long },
      { latitude: sources[i].lat, longitude: sources[i].long }
    );
    let distance =
      Geo.getDistance(
        { latitude: lat, longitude: long },
        { latitude: sources[i].lat, longitude: sources[i].long }
      ) * distScale;

    let x = Math.cos(angle) * distance;
    let y = Math.sin(angle) * distance;
    soundSources[i].setPosition(x, y, 0);
    console.log(x, y);
  }
}

function updateLocation(pos) {
  lat = pos.coords.latitude;
  long = pos.coords.longitude;
  document.getElementById('lat').innerHTML =
    Geo.decimal2sexagesimal(lat) + ' N';
  document.getElementById('long').innerHTML =
    Geo.decimal2sexagesimal(long) + ' E';
}

function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  scene = new ResonanceAudio(audioContext, { ambisonicOrder: 1 });
  // scene.setRoomProperties(roomDimensions, roomMaterials.marble);

  let audioElementSources = [];
  for (let i = 0; i < sources.length; i++) {
    // create audio elements
    audioElements[i] = document.createElement('audio');
    audioElements[i].src = sources[i].src;
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
  let watchId = navigator.geolocation.watchPosition(
    updateLocation,
    function(error) {
      alert('Cannot get location');
      console.log(error);
    },
    { enableHighAccuracy: true }
  );

  document.getElementById('play').addEventListener('touchstart', function(e) {
    e.target.classList.add('active');
  });

  document.getElementById('play').addEventListener('touchend', function(e) {
    e.target.classList.remove('active');
  });

  document.getElementById('play').addEventListener('click', function(e) {
    audioContext.resume();
    if (!audioReady) return;
    if (!compassReady) {
      Compass.watch(function(heading) {
        document.getElementById('heading').innerHTML =
          Math.floor(heading) + '°';
        rotateListener(heading);
      });
    }
    if (isPlaying) {
      audioElements.forEach(element => {
        element.pause();
      });
      isPlaying = false;
      e.target.innerHTML = 'Play';
    } else {
      updatePositions();

      audioElements.forEach(element => {
        element.play();
      });
      isPlaying = true;
      e.target.innerHTML = 'Pause';
    }
  });

  document.getElementById('dist').addEventListener('input', function(e) {
    setDistance(e.target.value);
  });
};

window.addEventListener('load', onLoad);
