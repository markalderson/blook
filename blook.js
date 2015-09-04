var blook = angular.module('msl.blook', []);

blook.directive('mslBlook', function () {
	function viewportSize() {
		var width = Math.min(document.documentElement.clientWidth, window.innerWidth || 0);
		var height = Math.min(document.documentElement.clientHeight, window.innerHeight || 0);
		return [width, height];
	};

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

	function animatedScroll(element, animation, callback) {
		var start = currentScroll();
		var stop = start + offset(element);
		
		var T = animation ? (animation.duration || 750) : 750;
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
			} else {
				clearInterval(ai);
				if (callback) callback();
			}
		}, dt);
	}

	return {
		restrict: 'A',
		link: function (scope, element, attributes) {
			angular.element(document.body).css('margin', '0');
			var chapters = [];
			var children = element.children();
			var num_children = children.length;
			for (var i = 0; i < num_children; i++) {
				var child = children.eq(i);
				if (child.attr('msl-blook-chapter') !== undefined) {
					var viewport_size = viewportSize();
					child.css('width', viewport_size[0] + 'px');
					child.css('height', viewport_size[1] + 'px');
					child.css('overflow-y', 'hidden');
					chapters.push(child);
				}
			}
			scope.chapters = chapters;
			var scroll_handler = function (event) {
				if (currentScroll() > scope.last_scroll) {
					var n = Math.min(scope.current_chapter + 1, scope.chapters.length - 1);
					var next_chapter = scope.chapters[n][0];
					window.onscroll = null;
					animatedScroll(next_chapter, { animation: EASE_IN_OUT_CUBIC }, function () {
						scope.current_chapter = n;
						scope.last_scroll = currentScroll();
						window.onscroll = scroll_handler;
					});
				} else if (currentScroll() < scope.last_scroll) {
					var n = Math.max(scope.current_chapter - 1, 0);
					var next_chapter = scope.chapters[n][0];
					window.onscroll = null;
					animatedScroll(next_chapter, { animation: EASE_IN_OUT_CUBIC }, function () {
						scope.current_chapter = n;
						scope.last_scroll = currentScroll();
						window.onscroll = scroll_handler;
					});
				}
			};
			animatedScroll(chapters[0][0], { animation: EASE_IN_OUT_CUBIC }, function () {
				scope.last_scroll = currentScroll();
				scope.current_chapter = 0;
				window.onscroll = scroll_handler;
			});
		}
	};
});