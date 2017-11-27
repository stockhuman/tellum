/**
 * @author Michael Hemingway
 * Canvas Effect
 */

(function () {
	'use strict'

	// Global Animation Setting
	window.requestAnimFrame = 
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback) {
			window.setTimeout(callback, 1000/60);
	};

	// Global Canvas Setting
	var canvas = document.getElementById('particles');
	var ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;


	// Particles Around the Parent
	function Particle(x, y, distance) {
		this.angle = Math.random() * 2 * Math.PI;
		this.radius = Math.random() ; 
		this.opacity =  (Math.random()*5 + 2)/10;
		this.distance = (1/this.opacity)*distance;
		this.speed = this.distance*0.00003;
		
		this.position = {
			x: x + this.distance * Math.cos(this.angle),
			y: y + this.distance * Math.sin(this.angle)
		};
		
		this.draw = function() {
			ctx.fillStyle = "rgba(255,255,255," + this.opacity + ")";
			ctx.beginPath();
			ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false);
			ctx.fill();
			ctx.closePath();
		}
		this.update = function() {
			this.angle += this.speed; 
			this.position = {
				x: x + this.distance * Math.cos(this.angle),
				y: y + this.distance * Math.sin(this.angle)
			};
			this.draw();
		}
	}

	function Emitter(x, y) {
		this.position = { x: x, y: y};
		this.radius = 60;
		this.count = 100; // was 3000
		this.particles = [];
		
		for(var i=0; i< this.count; i ++ ){
			this.particles.push(new Particle(this.position.x, this.position.y, this.radius));
		}
	}


	Emitter.prototype = {
		update: function() {  
		 for(var i=0; i< this.count; i++) {
			 this.particles[i].update();
		 }
		}
	}


	var emitter = new Emitter(canvas.width/2, canvas.height/2);

	function loop() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		emitter.update();
		requestAnimFrame(loop);
	}

	loop();
}());

/**
 * @author Michael Hemingway
 * Mobile Thin Client
 */

(function () {
'use strict'

// Environment
const server = 'https://localhost/tellum/api.php/sounds/'
let isRecord = false
let location = ''
let sndsSent = 0

// UI Variables
const record = document.getElementById('record')
const soundClips = document.querySelector('.sound-clips');
const canvas = document.getElementById('visualizer');
const mainSection = document.querySelector('.main');

// visualiser setup - create web audio api context and canvas
const audioCtx = new (window.AudioContext || webkitAudioContext)()
const canvasCtx = canvas.getContext("2d")



$(document).ready(function () {
	geolocate()
})

function geolocate () {
	if (navigator.geolocation) {
		// const btn = document.getElementById('consent')
		const meta = document.getElementById('meta')
		let pos;

		let success = position => {
			pos = position
			location = position
			meta.innerHTML = pos.coords.latitude + ' | ' + pos.coords.longitude
			app()
		}

		let error = error => { 
			console.log(error)
		}
		navigator.geolocation.getCurrentPosition(success, error)
	} else {
		console.log('Geolocation is not supported for this Browser/OS.')
	}
}

function userMedia () {
	if (navigator.mediaDevices.getUserMedia) {
		userMedia()
	} else {
		console.warn('getUserMedia not supported on your browser!')
	}
}

// Main block for doing the audio recording
function app () {
	var constraints = { audio: true }
	var chunks = []

	const onSuccess = function(stream) {
		var mediaRecorder = new MediaRecorder(stream)
		visualize(stream)

		record.onclick = function () {
			if (!isRecord) {
				mediaRecorder.start();
				record.innerHTML = 'Recording'
			} else {
				mediaRecorder.stop();
				record.innerHTML = 'Record Audio'
			}
			console.log(mediaRecorder.state);
			record.classList.toggle('rec')
			isRecord = !isRecord
		}

		mediaRecorder.onstop = function(e) {
			console.log("data available after MediaRecorder.stop() called.");

			var clipName = prompt('Enter a name for your sound clip?','My unnamed clip');
			console.log(clipName);
			var clipContainer = document.createElement('article');
			var clipLabel = document.createElement('p');
			var audio = document.createElement('audio');
			var deleteButton = document.createElement('button');
		 
			clipContainer.classList.add('clip');
			audio.setAttribute('controls', '');
			deleteButton.textContent = 'Delete';
			deleteButton.className = 'delete';

			if(clipName === null) {
				clipLabel.textContent = 'My unnamed clip';
			} else {
				clipLabel.textContent = clipName;
			}

			clipContainer.appendChild(audio);
			clipContainer.appendChild(clipLabel);
			clipContainer.appendChild(deleteButton);
			soundClips.appendChild(clipContainer);

			audio.controls = true;
			var blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
			chunks = [];
			var audioURL = window.URL.createObjectURL(blob);
			audio.src = audioURL;
			console.log("recorder stopped");


			console.info(blob.size + ' bytes, or ' + (blob.size / 1000000) + 'mb')

			// NOTE: hacked in

			let dataOut = new FormData();

			dataOut.append('meta', 'test')
			dataOut.append('datetime', new Date().toISOString().slice(0, 19).replace('T', ' '))
			dataOut.append('sound', blob, 'test.wav')
			axios.post(server, dataOut, {
				headers: {'content-type': 'multipart/form-data'}
			}).then(response => {console.log(response)})
			.catch(error => {console.warn(error)})


			deleteButton.onclick = function(e) {
				evtTgt = e.target;
				evtTgt.parentNode.parentNode.removeChild(evtTgt.parentNode);
			}

			clipLabel.onclick = function() {
				var existingName = clipLabel.textContent;
				var newClipName = prompt('Enter a new name for your sound clip?');
				if(newClipName === null) {
					clipLabel.textContent = existingName;
				} else {
					clipLabel.textContent = newClipName;
				}
			}
		}

		mediaRecorder.ondataavailable = function(e) {
			chunks.push(e.data);
		}
	}

	const onError = function(err) {
		console.log('The following error occured: ' + err);
	}

	navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
}

function visualize (stream) {
	var source = audioCtx.createMediaStreamSource(stream);

	var analyser = audioCtx.createAnalyser();
	analyser.fftSize = 2048;
	var bufferLength = analyser.frequencyBinCount;
	var dataArray = new Uint8Array(bufferLength);

	source.connect(analyser);
	//analyser.connect(audioCtx.destination);

	draw()

	function draw() {
		const WIDTH = canvas.width
		const HEIGHT = canvas.height;

		requestAnimationFrame(draw);

		analyser.getByteTimeDomainData(dataArray);

		canvasCtx.fillStyle = '#011936';
		canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

		canvasCtx.lineWidth = 2;
		canvasCtx.strokeStyle = '#F4FFFD';

		canvasCtx.beginPath();

		var sliceWidth = WIDTH * 1.0 / bufferLength;
		var x = 0;


		for(var i = 0; i < bufferLength; i++) {
 
			var v = dataArray[i] / 128.0;
			var y = v * HEIGHT/2;

			if(i === 0) {
				canvasCtx.moveTo(x, y);
			} else {
				canvasCtx.lineTo(x, y);
			}

			x += sliceWidth;
		}

		canvasCtx.lineTo(canvas.width, canvas.height/2);
		canvasCtx.stroke();

	}
}

window.onresize = function () {
	canvas.width = mainSection.offsetWidth;
}

window.onresize();

}());
