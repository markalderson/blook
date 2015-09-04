function currentScroll() {
	var doc = document.documentElement;
	var y = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
	return y;
}

function offset(element) {
	var dy = element.getBoundingClientRect().top;
	return dy;
}

function directScroll(y) {
	window.scroll(0, y);
}

function instantScroll(element) {
	directScroll(currentScroll() + offset(element));
}

function LINEAR(p, v1, v2) {
	return v1 + p * (v2 - v1);
}

function EASE_IN_OUT_CUBIC(p, v1, v2) {
	var t1 = v1 * Math.pow(1 - p, 3);
	var t2 = 3 * v1 * p * Math.pow(1 - p, 2);
	var t3 = 3 * v2 * (1 - p) * Math.pow(p, 2);
	var t4 = v2 * Math.pow(p, 3);
	return t1 + t2 + t3 + t4;
}

function animatedScroll(element, animation) {
	var start = currentScroll();
	var stop = start + offset(element);
	console.log(start, stop);
	
	var T = animation ? (animation.duration || 500) : 500;
	var f =  animation ? (animation.frequency || 30) : 30;
	var dt = T / f;
	var t = dt;
	var e =  animation ? (animation.easing || LINEAR) : LINEAR;

	var ai = setInterval(function () {
		if (t <= T) {
			var p = (Math.abs(T - t) < dt) ? 1 : (t / T);
			var y = e(p, start, stop);
			directScroll(y);
			t += dt;
		} else clearInterval(ai);
	}, dt);
}

var element = document.getElementById('answer-442428');
animatedScroll(element, { duration: 1000, frequency: 60, easing: EASE_IN_OUT_CUBIC });