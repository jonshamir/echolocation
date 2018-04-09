// Import CSS
require('normalize.css');
require('app/main.scss');

// Import JS
require('./compass.js');
RA = require('resonance-audio');
Geo = require('geolib');

let audioContext;
let scene;
let audioElement;
let soundSource;
let audioElementSource;
let heading = 0;
let lat = 31.77247675;
let long = 35.21536082;

let sources = [
  {
    lat: 31.775963,
    long: 35.2169,
    src: './assets/song.wav'
  }
];

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
let compassReady = false;
let isPlaying = false;
let distance = 5;
let SOUND_URL = './assets/song.wav';

function rotateListener(deg) {
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

function setDistance(meters) {
  if (!audioReady) return;
  soundSource.setPosition(meters, meters, 1);
}

function updateLocation(pos) {
  document.getElementById('lat').innerHTML =
    Geo.decimal2sexagesimal(pos.coords.latitude) + ' N';
  document.getElementById('long').innerHTML =
    Geo.decimal2sexagesimal(pos.coords.longitude) + ' E';
}

function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  audioElement = document.createElement('audio');
  audioElement.src = SOUND_URL;
  audioElement.load();
  audioElement.loop = true;
  audioElement.crossOrigin = 'anonymous';

  audioElementSource = audioContext.createMediaElementSource(audioElement);

  // Initialize scene and create Source(s).
  scene = new RA.ResonanceAudio(audioContext, { ambisonicOrder: 1 });
  scene.setRoomProperties(roomDimensions, roomMaterials.outside);
  soundSource = scene.createSource();
  audioElementSource.connect(soundSource.input);
  scene.output.connect(audioContext.destination);

  soundSource.setPosition(distance, distance, 1);

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
      audioElement.pause();
      isPlaying = false;
      e.target.innerHTML = 'Play';
    } else {
      audioElement.play();
      isPlaying = true;
      e.target.innerHTML = 'Pause';
    }
  });

  document.getElementById('dist').addEventListener('input', function(e) {
    setDistance(e.target.value);
  });
};

window.addEventListener('load', onLoad);
