(function() {
	he.register('contactButton', function(args) {

		var shortBtn = args['short'] ? true : false;

		var viewParams = {
			right: args.right ? args.right : undefined,
			top: args.top ? args.top : undefined,
			layout: 'composite'
		};
		if (args.overrideHeight) viewParams.height = args.overrideHeight;
		var v = he.create('View', (shortBtn ? 'contactButton_small' : 'contactButton'), viewParams);
		var titleParams = {};
		
		if (args.type == 'call') {
			icon_letter = 'M';
			text = shortBtn ? 'Call' : 'Call us';
			
			if(shortBtn){
				titleParams.top = 4;
			} else {
				titleParams.top = 10;
			}
			
			
			if(!shortBtn){
				titleParams.font = {fontSize: 15};
			} else {
				titleParams.font = {fontSize: 18};
			}
			
			if (platform == 'Android' && !shortBtn){
				titleParams.top  = 8;
			} else if (platform == 'Android'){
				titleParams.top  = 4;
			}		
						
		} else if (args.type == 'web') {
			icon_letter = 'N';
			text = shortBtn ? 'Web' : 'Visit our website';
			
			if(shortBtn){
				titleParams.top = 4;
			} else {
				titleParams.top = 10;
			}
			
			if (platform == 'Android' && !shortBtn){
				titleParams.top  = 8;
			} else if (platform == 'Android'){
				titleParams.top  = 4;
			}			
			
			titleParams.font = {fontSize: 18};
						
		} else if (args.type == 'find') {
			icon_letter = 'O';
			text = shortBtn ? 'Visit' : 'Find us';
			
			
			if(shortBtn){
				titleParams.top = 4;
			} else {
				titleParams.top = 10;
			}
			
			if (platform == 'Android' && !shortBtn){
				titleParams.top  = 8;
			} else if (platform == 'Android'){
				titleParams.top  = 4;
			}
			
			titleParams.font = {fontSize: 18};
			
		} else if (args.type == 'everything') {
			
			icon_letter = false;
			text = 'Show me everything';
			
		} else if (args.type == 'noicon'){
			
			icon_letter = false;
			text = args.text;
			titleParams.textAlign = 'center';
			titleParams.top = 10;
			
			if (platform == 'Android'){
				titleParams.top  = 6;
			}
		}

		titleParams.text =  args.title || text;
		if (args.type == 'everything') {
			titleParams.text = text;
			titleParams.top  = 11;
		}
		
		if (args.textleft) titleParams.left = args.textleft;
	    if (args.fontsize) titleParams.font = {fontSize: args.fontSize};
	    
	    
		var title = he.create('Label', (shortBtn ? 'contactTitle_small' : 'contactTitle'), titleParams);
		
		if (icon_letter != false) {
			var icon = he.create('Label', (shortBtn ? 'contactIcon_small' : 'contactIcon'), {text: icon_letter, right: 10});
		}
		
		if (!shortBtn && !args.noarrow) {
			var arrow = he.create('Label', 'contactIcon', {text: 'K', width: 30, left: '85%'});
			v.add(arrow);
		}
		
		if(args.type =='everything'){
			arrow.left =  '80%';
		}

		v.add(title);
		if (icon_letter != false) {
			v.add(icon);
		}

		if (args.extra) {
			v.add(args.extra);
		}

		v.addEventListener('touchstart', function() {
			v.backgroundColor = he.getPset('contactButton').selectedBackgroundColor;
			title.color = he.getPset('contactButton').selectedColor;
			if (icon_letter) icon.color = he.getPset('contactButton').selectedColor;
			if (!shortBtn && !args.noarrow) arrow.color = he.getPset('contactButton').selectedColor;
		});
		
		var untouch = function() {
			v.backgroundColor = he.getPset('contactButton').backgroundColor;
			title.color = he.getPset('contactButton').color;
			if (icon_letter) icon.color = he.getPset('contactButton').color;
			if (!shortBtn && !args.noarrow) arrow.color = he.getPset('contactButton').color;
		};
		v.addEventListener('touchend', untouch);
		v.addEventListener('touchcancel', untouch);

		return v;

	});
})();
