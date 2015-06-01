var $draggable = $('#draggable');
$draggable.draggable({
	stop: function() {
		calculate(draggable);
	}
});

function calculate(draggable) {
	var viewability = module.exports(draggable);
	document.getElementById('viewability-value').innerHTML = viewability.value.toFixed(2);
	document.getElementById('viewability-reason').innerHTML = viewability.state;
}

calculate(document.getElementById('draggable'));
