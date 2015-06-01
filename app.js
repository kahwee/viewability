var $draggable1 = $('#draggable1');
var $draggable2 = $('#draggable2');
$draggable1.draggable({
	stop: function(ev) {
		calculate(ev.target, 'vertical');
	}
});
$draggable2.draggable({
	stop: function(ev) {
		calculate(ev.target, 'horizontal');
	}
});

function calculate(draggable, direction) {
	var v = viewability[direction](draggable);
	draggable.querySelector('.value').innerHTML = v.value.toFixed(2);
	draggable.querySelector('.reason').innerHTML = v.state;
}

calculate(document.getElementById('draggable1'), 'vertical');
calculate(document.getElementById('draggable2'), 'horizontal');
