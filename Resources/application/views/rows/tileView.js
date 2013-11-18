(function() {
	he.register('tileView', function(args) {
		
		var v = he.create('View', 'tile', {
			optionType: args.optionType,
			optionValue: args.optionValue
		});

		var background = he.create('View', 'tileBackground', {
			optionType: args.optionType,
			optionValue: args.optionValue,
			touchEnabled: false
		});
		v.add(background);

		var icon = he.create('Label', 'tileIcon', {
			text: args.icon,
			optionType: args.optionType,
			optionValue: args.optionValue,
			touchEnabled: false
		});
		v.add(icon);

		var label = he.create('Label', 'tileLabel', {
			text: args.title,
			optionType: args.optionType,
			optionValue: args.optionValue,
			touchEnabled: false
		});
		v.add(label);
		v.tileLabel = label;

		v.addEventListener('touchstart', function() {
			background.backgroundColor = he.getPset('tileBackground').focusBackgroundColor;
			icon.color = he.getPset('tileIcon').focusIconColor;
			label.color = he.getPset('tileLabel').focusFontColor;
		});

		var untouch = function() {
			background.backgroundColor = he.getPset('tileBackground').backgroundColor;
			background.opacity = he.getPset('tileBackground').opacity;
			icon.color = he.getPset('tileIcon').color;
			label.color = he.getPset('tileLabel').color;
		};
		v.addEventListener('touchcancel', untouch);
		v.addEventListener('touchend', function() {
			setTimeout(untouch, 500);
		});
		v.addEventListener('singletap', function() {
			setTimeout(untouch, 500);
		});

		return v;
		
	});
})();
