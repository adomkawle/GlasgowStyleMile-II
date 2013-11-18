(function() {
    he.register('directoryRow', function(args) {
    	
    	var tr = he.create('TableViewRow', {
				// hasChild: args.hasChild === true ? true : false,
				height: platform == 'iOS' ? 50 : 'auto',
				minRowHeight: 65,
				// className: 'RowStyleOne',
				id: args.id
		});
		
		var trv = he.create('View', {height: 'auto', width: 'auto'});
		
		if (args.header) {
			tr.header = args.header;
		}
    	
    	var title 			= he.create('Label', 'directoryRowTitle', 		{text: args.title});
    	var distance 		= he.create('Label', 'directoryRowDistance', 	{text: '  '+args.distance+'  '});
        var open            = he.create('Label', 'directoryRowArrow',       {text: 'K'});
    	
    	trv.add(title);
    	trv.add(distance);
        trv.add(open);

        trv.addEventListener('touchstart', function() {
            title.color = he.getPset('TableViewRow').selectedColor;
            open.color = he.getPset('directoryRowArrow').selectedColor;
            trv.backgroundColor = he.getPset('TableViewRow').backgroundSelectedColor;
            // For some reason this looses it's background
            distance.backgroundColor = he.getPset('directoryRowDistance').backgroundColor;
        });
        var untouch = function() {
            title.color = he.getPset('TableViewRow').color;
            open.color = he.getPset('directoryRowArrow').color;
            trv.backgroundColor = he.getPset('TableViewRow').backgroundColor;
            // For some reason this looses it's background
            distance.backgroundColor = he.getPset('directoryRowDistance').backgroundColor;
        };
        trv.addEventListener('touchcancel', untouch);
        trv.addEventListener('touchend', function() {
            // Reset the colors or the text be invisible if user opened a window and went back
            setTimeout(untouch, 1000);
        });

        if (args.subTitle) {
            var subTitle         = he.create('Label', 'directoryRowSubTitle',    {text: args.subTitle});
            trv.add(subTitle);
        }
    	
    	image = null;
    	
    	if (args.specialOffer) {
    		var specialOffer 	= he.create('Label', 'directoryRowSpecialOffer', {image: directoryPath+args.specialOffer});
    		trv.add(specialOffer);
    	}
    	
    	tr.add(trv);
  		
  		return tr;
    	
    });
})();
