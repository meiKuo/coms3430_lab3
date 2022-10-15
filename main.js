var audioCtx;
var audioCtx2;
var osc;
const playButton = document.querySelector('button');
var biquadFilter;
var analyser; 
var canvasCtx = document.getElementById("visualizer").getContext("2d");
var WIDTH = 800;
var HEIGHT = 300;


function playBrown() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)

    var bufferSize = 10 * audioCtx.sampleRate,
        noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
        output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.5;
    }

    var lastOut = 0;
    for (var i = 0; i < bufferSize; i++) { //filling array with noise
        var brown = Math.random() * 2 - 1;

        output[i] = (lastOut + (0.02 * brown)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
    }

    //creating 400 brown noise
    brownNoise = audioCtx.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;
    brownNoise.start(0);

    //creating the biquad filter freq 400
    biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = "lowpass";
    biquadFilter.frequency.setValueAtTime(400, audioCtx.currentTime);
    biquadFilter.gain.setValueAtTime(0, audioCtx.currentTime);
    brownNoise.connect(biquadFilter);

    //creating the biquad filter freq 14 
    biquadFilter14 = audioCtx.createBiquadFilter();
    biquadFilter14.type = "lowpass";
    biquadFilter14.frequency.setValueAtTime(14, audioCtx.currentTime);
    biquadFilter14.gain.setValueAtTime(0, audioCtx.currentTime);
    brownNoise.connect(biquadFilter14);

    //create biquad filter highpass filter 
    biquadFilterHigh = audioCtx.createBiquadFilter();
    biquadFilterHigh.type = "highpass";
    biquadFilterHigh.Q.value = 33.33;

    //create oscillator of sound - additive synthesis 
    modulatorFreq = audioCtx.createOscillator();
    modulatorFreq.frequency.value = 500;

    //gainNode after highpass filter 
    gainNode = audioCtx.createGain();
    gainNode.gain.value = 0.1;

    //gainNode for lowpass filter 14 
    gainNode14 = audioCtx.createGain();
    gainNode14.gain.value = 400; //400 

    biquadFilter.connect(biquadFilterHigh);
    biquadFilter14.connect(gainNode14).connect(biquadFilterHigh.frequency);
    modulatorFreq.connect(biquadFilterHigh.frequency);//connect to highpass filter frequency for range 100-900 
    modulatorFreq.start()
    biquadFilterHigh.connect(gainNode).connect(audioCtx.destination); //last bit to avoid cutoff


    analyser = audioCtx.createAnalyser();
    biquadFilter.connect(biquadFilter14).connect(analyser);

    analyser.connect(audioCtx.destination);
    analyser.fftSize = 2048;
    bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    draw(); 

}

function playCreative() {
    console.log("inside creative");
    audioCtx2 = new (window.AudioContext || window.webkitAudioContext);

    var bufferSize = 10 * audioCtx2.sampleRate,
        noiseBuffer = audioCtx2.createBuffer(1, bufferSize, audioCtx2.sampleRate),
        output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.5;
    }

    var lastOut = 0;
    for (var i = 0; i < bufferSize; i++) { //filling array with noise
        var brown = Math.random() * 2 - 1;

        output[i] = (lastOut + (0.02 * brown)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
    }


    //gainNode for the last bit to avoid clipping
    gainNodeLast = audioCtx2.createGain(); 
    gainNodeLast.gain.value = 0.1; 

    //create white noise for rain 
    brownNoise2 = audioCtx2.createBufferSource();
    brownNoise2.buffer = noiseBuffer;
    brownNoise2.loop = true;
    brownNoise2.start(0);

    //create 1st lowpass filter 
    biquadFilter = audioCtx2.createBiquadFilter();
    biquadFilter.type = "lowpass";
    biquadFilter.frequency.setValueAtTime(80, audioCtx2.currentTime);

    //create 2nd lowpass filter 
    biquadFilterLow2 = audioCtx2.createBiquadFilter();
    biquadFilterLow2.type = "lowpass";
    biquadFilterLow2.frequency.setValueAtTime(200, audioCtx2.currentTime);

    //gainNode for 1st lowpass filter  
    gainNode = audioCtx2.createGain();
    gainNode.gain.value = 0.5;
    brownNoise2.connect(gainNode).connect(biquadFilter).connect(gainNodeLast);

    //gainNode for 2nd lowpass filter 
    gainNodeLow2 = audioCtx2.createGain();
    gainNodeLow2.gain.value = 1;
    brownNoise2.connect(gainNodeLow2).connect(biquadFilterLow2).connect(gainNodeLast);

    //create 1st highpass filter 
    biquadFilterHigh = audioCtx2.createBiquadFilter();
    biquadFilterHigh.type = "highpass";
    biquadFilterHigh.frequency.setValueAtTime(5000, audioCtx2.currentTime);
    biquadFilterHigh.Q.value = 5; //selectivity of frequency 

    //create 2nd highpass filter 
    biquadFilterHigh2 = audioCtx2.createBiquadFilter();
    biquadFilterHigh2.type = "highpass";
    biquadFilterHigh2.frequency.setValueAtTime(1000, audioCtx2.currentTime);
    biquadFilterHigh2.Q.value = 5; //selectivity of frequency 


    //create oscillator of sound - additive synthesis 
    modulatorFreq = audioCtx2.createOscillator();
    modulatorFreq.frequency.value = 5000;
    modulatorFreq.connect(biquadFilterLow2.frequency);//connect to highpass filter frequency for range 100-900 
    modulatorFreq.start()

    //create gainNode for 1st highpass filter 
    gainNodeHigh = audioCtx2.createGain();
    gainNodeHigh.gain.value = 0.1;
    brownNoise2.connect(biquadFilterHigh).connect(gainNodeHigh).connect(gainNodeLast);//connect everything together


    //create gainNode for 2nd highpass filter 
    gainNodeHigh2 = audioCtx2.createGain();
    gainNodeHigh2.gain.value = 0.3;
    brownNoise2.connect(biquadFilterHigh2).connect(gainNodeHigh2).connect(gainNodeLast);//connect everything together

    gainNodeLast.connect(audioCtx2.destination)

    analyser = audioCtx2.createAnalyser();
    // biquadFilter.connect(analyser);
    biquadFilter.connect(biquadFilterLow2).connect(analyser);

    analyser.connect(audioCtx2.destination);
    analyser.fftSize = 2048;
    bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    dataArray = new Uint8Array(bufferLength);

    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);
    draw(); 
}

//audio signal 
function draw() {
    drawVisual = requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    canvasCtx.fillStyle = 'rgb(0, 0, 0)';
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    var barWidth = (WIDTH / bufferLength) * 2.5;
    var barHeight;
    var x = 0;

    for (var i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] * 2;

        canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
        canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

        x += barWidth + 1;
    }

}

const bubbles = document.getElementById('bubbles');
bubbles.addEventListener('click', function () {

    if (!audioCtx) {
        playBrown();
        return;
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }

    if (audioCtx.state === 'running') {
        audioCtx.suspend();
    }

}, false);

const creative = document.getElementById('creative');
creative.addEventListener('click', function () {

    if (!audioCtx2) {
        playCreative();
        return;
    }

    if (audioCtx2.state === 'suspended') {
        audioCtx2.resume();
    }

    if (audioCtx2.state === 'running') {
        audioCtx2.suspend();
    }

});

