var ad = document.getElementById('ad')
var threshold = 0.5
var elapsedTime = 0
var startOfElapsedTime = -1 // -1 means not started

function calculate(el) {
	var v = viewability.vertical(el)
	var h = viewability.horizontal(el)
	var combined = h.value * v.value
	if (combined > threshold) {
		if (elapsedTime === 0 && startOfElapsedTime === -1) {
			startOfElapsedTime = Date.now()
		}
		elapsedTime = Date.now() - startOfElapsedTime
	} else {
		elapsedTime = 0
		startOfElapsedTime = -1 // resets to non-started position
	}
	document.getElementById('info').innerHTML = '<h3>Vertical:</h3><p>' + v.value.toFixed(2) + '<br>' + v.state + '</p><h3>Horizontal:</h3><p>' + h.value.toFixed(2) + '<br>' + h.state + '</p><h3>Combined viewability index (vertical x horizontal)</h3><p>' + combined.toFixed(2) + '</p><h3>Elapsed time (ms)</h3><p>' + elapsedTime + '</p>'
}
window.setInterval(function () {
	calculate(document.getElementById('ad'))
}, 89)
