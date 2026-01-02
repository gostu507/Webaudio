let audioCtx;
let source;
let audioBuffer;

let gainNode, lowEQ, midEQ, highEQ;

const fileInput = document.getElementById("audioFile");

fileInput.addEventListener("change", async (e) => {
  audioCtx = new AudioContext();

  const file = e.target.files[0];
  const arrayBuffer = await file.arrayBuffer();
  audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  setupNodes();
});

function setupNodes() {
  gainNode = audioCtx.createGain();

  lowEQ = audioCtx.createBiquadFilter();
  lowEQ.type = "lowshelf";
  lowEQ.frequency.value = 200;

  midEQ = audioCtx.createBiquadFilter();
  midEQ.type = "peaking";
  midEQ.frequency.value = 1000;
  midEQ.Q.value = 1;

  highEQ = audioCtx.createBiquadFilter();
  highEQ.type = "highshelf";
  highEQ.frequency.value = 3000;

  // Connect chain
  lowEQ.connect(midEQ);
  midEQ.connect(highEQ);
  highEQ.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  // Controls
  document.getElementById("gain").oninput = e => {
    gainNode.gain.value = e.target.value;
  };

  document.getElementById("low").oninput = e => {
    lowEQ.gain.value = e.target.value;
  };

  document.getElementById("mid").oninput = e => {
    midEQ.gain.value = e.target.value;
  };

  document.getElementById("high").oninput = e => {
    highEQ.gain.value = e.target.value;
  };
}

document.getElementById("play").onclick = () => {
  if (!audioBuffer) return;

  source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(lowEQ);
  source.start();
};

document.getElementById("stop").onclick = () => {
  if (source) source.stop();
};
