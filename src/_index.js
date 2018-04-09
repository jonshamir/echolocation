// Import CSS
require('normalize.css');
require('app/main.scss');

// Import JS
require('./compass.js');
RA = require('resonance-audio');

var audioCtx, scene, source, audioElement, audioElementSrc, oscillator;
var distance = 20;

init();

document.getElementById('play').addEventListener('click', function(e) {
  console.log('play');
  // oscillator.start();
  audioElement.play();
  Compass.watch(function(heading) {
    document.getElementById('heading').innerHTML = Math.floor(heading);
    rotateSource(-heading);
  });
});

document.getElementById('angle').addEventListener('input', function(e) {
  rotateSource(e.target.value);
});

function rotateSource(deg) {
  let angle = toRadians(deg);
  let x = distance * Math.sin(angle);
  let y = distance * Math.cos(angle);
  source.setPosition(x, y, 0);
}

function init() {
  Compass.init(function(method) {
    console.log('Compass heading by ' + method);
  });

  audioCtx = new AudioContext();
  scene = new RA.ResonanceAudio(audioCtx);

  // Connect the scene’s binaural output to stereo out
  scene.output.connect(audioCtx.destination);

  // Define room
  let roomDimensions = {
    width: 50,
    height: 10,
    depth: 50
  };

  const material = 'transparent';
  let roomMaterials = {
    left: material,
    right: material,
    front: material,
    back: material,
    down: material,
    up: material
  };

  // Add the room definition to the scene.
  scene.setRoomProperties(roomDimensions, roomMaterials);

  /*
  // Generate a MediaElementSource from the AudioElement.
  oscillator = audioCtx.createOscillator();
  oscillator.type = 0; // sine wave
  oscillator.frequency.setValueAtTime(160, audioCtx.currentTime); // value in hertz

  // Add the MediaElementSource to the scene as an audio input source.
  source = scene.createSource();
  oscillator.connect(source.input);
  */

  // Create an AudioElement.
  audioElement = document.createElement('audio');
  audioElement.controls = true;
  audioElement.preload = 'auto';
  // audioElement.src = 'https://hpr.dogphilosophy.net/test/wav.wav';
  let srcElement = document.createElement('source');
  srcElement.src = 'https://hpr.dogphilosophy.net/test/wav.wav';
  audioElement.appendChild(srcElement);

  // Generate a MediaElementSource from the AudioElement.
  audioElementSrc = audioCtx.createMediaElementSource(audioElement);

  // Add the MediaElementSource to the scene as an audio input source.
  source = scene.createSource();
  audioElementSrc.connect(source.input);

  // Set the source position relative to the room center (source default position).
  source.setPosition(0, distance, 0);
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}
