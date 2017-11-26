/**
 * @author Michael Hemingway
 * 
 */

$(document).ready(function () {
	mapboxgl.accessToken = 'pk.eyJ1Ijoic3RvY2todW1hbiIsImEiOiJjamE4dWxyZTUwMG9zMnFzNDFucHF0ZzdyIn0.DpVSsrPakJynuKVNifh7uA';
	
	const map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/stockhuman/cja8w6mus0yvc2sqazwtisw9p',
		// center: [, ],
		center: [-73.5878100, 45.5088400],
		zoom: 10
	})
})
