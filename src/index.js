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
    src: './assets/bells.wav'
  },
  {
    name: 'The Knesset',
    id: 'knesset',
    lat: 31.77663,
    long: 35.205471,
    src: './assets/drums.wav'
  },
  {
    name: 'Mahane Yehuda Market',
    id: 'market',
    lat: 31.784851,
    long: 35.212643,
    src: './assets/market.wav'
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
    src: './assets/crowd.wav'
  },
  {
    name: 'Ammunition Hill',
    id: 'hill',
    lat: 31.798014,
    long: 35.227671,
    src: './assets/trumpet.wav'
  },
  {
    name: 'The Israel Museum',
    id: 'museum',
    lat: 31.771947,
    long: 35.204153,
    src: './assets/piano.wav'
  },
  ,
  {
    name: 'Mount Scopus',
    id: 'scopus',
    lat: 31.795354,
    long: 35.242609,
    src: './assets/guitar.wav'
  }
];

let q = 0;
let solutions = ['museum', 'scopus', 'herzl'];
let hints = [
  ['knesset', 'herzl', 'market'],
  ['oldcity', 'teddy', 'hill'],
  ['scopus', 'museum', 'teddy']
];
let options = [
  ['oldcity', 'teddy', 'museum'],
  ['knesset', 'herzl', 'scopus'],
  ['herzl', 'teddy', 'oldcity']
];
let hintSources, optSources;

let isPlaying = false;
let isStarted = false;
let distScale = 0.02;
let dist = 1;

function rotateListener(deg) {
  // Update only on change of more than 2 degrees from last measurement
  if (Math.floor(deg) >= heading - 2 && Math.floor(deg) <= heading + 2) return;

  heading = deg;
  let angle = toRadians(deg);
  let x = -Math.sin(angle);
  let y = Math.cos(angle);
  scene.setListenerOrientation(x, y, 0, 0, 0, 1);
}

function updatePositions() {
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

    let x = Math.sin(toRadians(deg)) * dist;
    let y = -Math.cos(toRadians(deg)) * dist;
    soundSources[i].setPosition(x, y, 0);
    soundSources[i].setGain(200 / (distance * distance));
    console.log(hintSources[i].name);
    console.log(deg + ':' + degToCompass(deg));
    console.log(x, y);
  }
}

function initAudio() {
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  scene = new ResonanceAudio(audioContext, { ambisonicOrder: 1 });
  scene.setRoomProperties(roomDimensions, roomMaterials.outside);

  scene.output.connect(audioContext.destination);
}

function setQuestion() {
  hintSources = sources.filter(source => hints[q].indexOf(source.id) != -1);
  optSources = sources.filter(source => options[q].indexOf(source.id) != -1);

  // create option & hint buttons
  document.getElementById('hints').innerHTML =
    '<span>Tap a location to hear it</span>';
  for (let i = 0; i < hintSources.length; i++) {
    let hintButton = document.createElement('button');
    hintButton.innerHTML = hintSources[i].name;
    hintButton.classList.add('hint');
    hintButton.onclick = e => {
      if (audioElements[i].paused) {
        e.target.classList.add('active');
        audioElements[i].play();
      } else {
        e.target.classList.remove('active');
        audioElements[i].pause();
      }
    };
    document.getElementById('hints').append(hintButton);
  }

  document.getElementById('options').innerHTML =
    '<span>Guess where you are:</span>';
  for (let i = 0; i < optSources.length; i++) {
    let optButton = document.createElement('button');
    optButton.innerHTML = optSources[i].name;
    optButton.classList.add('option');
    optButton.onclick = e => {
      if (optSources[i].id == solutions[q]) {
        alert('Correct!');
        if (q < solutions.length - 1) {
          q++;
          setQuestion();
        } else {
          document.getElementById('body').innerHTML =
            '<img src="./assets/logo.png" id="logo"><h1>You Won!</h1>';
        }
      } else {
        alert('Wrong!');
      }
    };
    document.getElementById('options').append(optButton);
  }

  // Audio elements & sources
  let audioElementSources = [];
  for (let i = 0; i < hintSources.length; i++) {
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

  updatePositions();
}

// Event listeners
let onLoad = function() {
  initAudio();
  setQuestion();

  Compass.watch(function(heading) {
    document.getElementById('heading').innerHTML = degToCompass(heading);
    rotateListener(heading);
  });

  document.getElementById('play').addEventListener('click', function(e) {
    audioContext.resume();
    if (!isStarted) {
      e.target.innerHTML = 'Play All';
      document.getElementById('hints').classList.remove('hidden');
      document.getElementById('options').classList.remove('hidden');
      isStarted = true;
    } else if (isPlaying) {
      audioElements.forEach(element => {
        element.pause();
      });
      isPlaying = false;
      e.target.innerHTML = 'Play All';
    } else {
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
};

window.addEventListener('load', onLoad);

// Helper funcitons
function toRadians(angle) {
  return angle * (Math.PI / 180);
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

let roomDimensions = {
  width: 2,
  height: 2,
  depth: 2
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
