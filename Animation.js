/**
* 动画
* @author pjw
* ------------
* @options
*	- elm 动画元素
*	- time 动画完成消耗时间
*	- actions 动画集合
*	- callback 动画完成回调
*/

var Animation;

(function(root, factory) {

	/* CommonJS */
  	if (typeof exports == 'object') module.exports = factory()

	/* AMD module */
	else if (typeof define == 'function' && define.amd) define(factory)

	/* Global */
	else root.Animation = factory()

}(this, function() {

	Animation = function(options) {

		var elm = this.elm = options.elm,
			time = this.time = options.time,
			actions = this.actions = options.actions,
			callback = this.callback = options.callback;

		var timer, 
			queue = [],
			styles = window.getComputedStyle 
					? window.getComputedStyle(elm) : window.currentStyle 
					? window.currentStyle(elm) : elm.currentStyle;

		for(var key in actions) {
			var currentStatus;

			if(key == 'scrollTop' || key == 'scrollLeft') {
				currentStatus = elm[key];
			} else {
				var style = Number(styles[key]);
				currentStatus = isNaN(style) ? Number(styles[key].replace('px', '')) : style;
			};

			queue.push({
				to: actions[key],
				from: currentStatus,
				difference: actions[key] - currentStatus,
				type: key
			});
		};

		var startTime = new Date().getTime();

		function go() {

			timer = setTimeout(function() {

				var timeDifference = new Date().getTime() - startTime,
					timeRate = timeDifference / time;

				for(var i = 0; i < queue.length; i ++) {

					var type = queue[i].type,
						unit = isNaN( Number( styles[type] ) ) ? 'px' : '',
						result = queue[i].difference * timeRate + queue[i].from,
						isScroll = type == 'scrollTop' || type == 'scrollLeft';

					if(timeDifference >= time) {
						isScroll ? elm[type] = queue[i].to : elm.style[type] = queue[i].to + unit;
						queue.splice(i, 1);
						continue;
					};

					isScroll ? elm[type] = result : elm.style[type] = result + unit;

				};

				if(queue.length <= 0) {
					clearTimeout(timer);
					callback && callback();
					return;
				};
				
				go();	

			}, 0);
		};

		go();

	};

	return Animation;

}));
