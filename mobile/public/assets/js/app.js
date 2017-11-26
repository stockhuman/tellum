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

const server = 'https://localhost/tellum/api.php/sounds/'
let serverUp = false
let geoLocUp = false
let usrMedia = false
let appReady = false

let location = ''


const record = document.getElementById('record')
const stop = document.querySelector('.stop');
const soundClips = document.querySelector('.sound-clips');
const canvas = document.querySelector('.visualizer');
const mainSection = document.querySelector('.main-controls');

// disable stop button while not recording
stop.disabled = true;

$(document).ready(function () {
	preflight()
})

// Determine server status
function status () {
	axios.get(server)
	.then(response => { serverUp = true })
	.catch(error => { console.log(error) })
}

function geolocate () {
	if (navigator.geolocation) {
		const btn = document.getElementById('consent')
		const meta = document.getElementById('meta')
		let pos;

		let success = position => {
			pos = position
			location = position
			meta.innerHTML = pos.coords.latitude + ' | ' + pos.coords.longitude
			geoLocUp = true
		}

		let error = error => { console.log(error) }

		btn.addEventListener('click', function () {
			navigator.geolocation.getCurrentPosition(success, error)
		})
	} else {
		console.log('Geolocation is not supported for this Browser/OS.')
	}
}

function userMedia () {
	if (navigator.mediaDevices.getUserMedia) {
		usrMedia = true
	}
}

function preflight () {
	status()
	geolocate()
	userMedia()
}

}());
