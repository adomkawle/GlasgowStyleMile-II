(function() {
    he.register('categoryRow', function(args) {
    	
    	var tr = he.create('TableViewRow', {
				// hasChild: args.hasChild === true ? true : false,
				height: 40,
				minRowHeight: 75,
				className: 'RowStyleTwo',
				id: args.id,
				optionType: args.optionType,
                optionValue: args.optionValue
		});

        var trv = he.create('View', {height: 'auto', width: 'auto'});
    	
    	var title = he.create('Label', 'categoryRowTitle', {top: 12, bottom: 10, text: args.title});
        trv.add(title);

        var open = he.create('Label', 'directoryRowArrow', {text: 'K', top: 10});
        trv.add(open);

        var touch = function() {
            title.color = he.getPset('TableViewRow').selectedColor;
            open.color = he.getPset('directoryRowArrow').selectedColor;
            trv.backgroundColor = he.getPset('TableViewRow').backgroundSelectedColor;
        }
        trv.addEventListener('touchstart', touch);
        trv.addEventListener('longclick', touch);

        var untouch = function() {
            title.color = he.getPset('TableViewRow').color;
            open.color = he.getPset('directoryRowArrow').color;
            trv.backgroundColor = he.getPset('TableViewRow').backgroundColor;
        };
        trv.addEventListener('touchcancel', untouch);
        trv.addEventListener('touchend', function() {
            // Reset the colors or the text be invisible if user opened a window and went back
            setTimeout(untouch, 1000);
        });

        tr.add(trv);

  		return tr;
    	
    });
})();
