const Animation=(options)=>{

	this.elm=options.elm;
	this.time=options.time;
	this.actions=options.actions;
	this.callback=options.callback;

	let {
		elm,
		time,
		actions,
		callback
	} = this;

	let timer,
		arr=[],
		styles= window.getComputedStyle ? window.getComputedStyle(elm) : window.currentStyle(elm);

	for(let key in actions){
		let currentStatus;

		if(key=='scrollTop'){
			currentStatus=elm[key];
		}else{
			let style=Number(styles[key]);
			currentStatus= isNaN(style) ? Number(styles[key].split('px')[0]) : style;
		};

		arr.push({
			to:actions[key],
			from:currentStatus,
			difference:actions[key]-currentStatus,
			type:key
		});
	};

	let startTime=new Date().getTime();

	let go=()=>{

		timer=setTimeout(()=>{

			let timeDifference=new Date().getTime()-startTime,
				timeRate=timeDifference/time;

			for(let i=0;i<arr.length;i++){

				let type=arr[i].type,
					unit= isNaN( Number( styles[type] ) ) ? 'px' : '',
					result=arr[i].from+arr[i].difference*timeRate;

				if( timeDifference >= time ){
					type=='scrollTop' ? elm[type]=arr[i].to : elm.style[type]=arr[i].to+unit;
					arr.splice(i,1);
					continue;
				};

				type=='scrollTop' ? elm[type]=result : elm.style[type]=result+unit;

			};

			if(arr.length<=0){
				clearTimeout(timer);
				callback && callback();
				return;
			};

			go();
			
		},0);

	};

	go();

};

export default Animation;