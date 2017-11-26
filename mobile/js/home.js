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
