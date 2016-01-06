interact('#draggable')
	.draggable({
		// enable inertial throwing
		inertia: true,
		// call this function on every dragmove event
		onmove: dragMoveListener,
		// call this function on every dragend event
		onend: function(event) {}
	})
	.resizable({
		edges: {
			left: true,
			right: true,
			bottom: true,
			top: true
		}
	})
	.on('resizemove', function(event) {
		var target = event.target,
			x = (parseFloat(target.getAttribute('data-x')) || 0),
			y = (parseFloat(target.getAttribute('data-y')) || 0);

		// update the element's style
		target.style.width = event.rect.width + 'px';
		target.style.height = event.rect.height + 'px';

		// translate when resizing from top or left edges
		x += event.deltaRect.left;
		y += event.deltaRect.top;

		target.style.webkitTransform = target.style.transform =
			'translate(' + x + 'px,' + y + 'px)';

		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);
		target.textContent = Number.parseInt(event.rect.width) + 'x' + Number.parseInt(event.rect.height);
		calculate(document.getElementById('draggable'));

	});

function dragMoveListener(event) {
	var target = event.target,
		// keep the dragged position in the data-x/data-y attributes
		x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
		y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

	// translate the element
	target.style.webkitTransform =
		target.style.transform =
		'translate(' + x + 'px, ' + y + 'px)';

	// update the posiion attributes
	target.setAttribute('data-x', x);
	target.setAttribute('data-y', y);
	calculate(document.getElementById('draggable'));

}

function calculate(draggable) {
	var v = viewability.vertical(draggable);
	var h = viewability.horizontal(draggable);
	document.getElementById('info').innerHTML = '<h3>Vertical:</h3><p>' + v.value.toFixed(2) + '<br>' + v.state + '</p><h3>Horizontal:</h3><p>' + h.value.toFixed(2) + '<br>' + h.state + '</p><h3>Combined viewability index (vertical x horizontal)</h3><p>' + (h.value * v.value).toFixed(2) + '</p>'
}

calculate(document.getElementById('draggable'));

document.addEventListener('scroll', function() {
	calculate(document.getElementById('draggable'));
})
