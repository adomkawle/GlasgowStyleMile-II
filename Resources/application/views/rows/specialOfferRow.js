(function() {
    he.register('specialOfferRow', function(args) {
    	
    	var tr = he.create('TableViewRow', {
				// hasChild: args.hasChild === true ? true : false,
				height: platform == 'iOS' ? 75 : 75,
				minRowHeight: 80,
				// className: 'RowStyleOne',
				id: args.id,
				offer: args.offer
		});
		
		if(platform == 'Android'){
			var trv = he.create('View', {height: 75 , width: 'auto', top:0 });
		} else {
			var trv = he.create('View', {height: 'auto', width: 'auto'});	
		}
		
		if(args.header){
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
            var subTitle  = he.create('Label', 'directoryRowSubTitle',    {text: args.subTitle});
            trv.add(subTitle);
        }
    	
    	image = null;
    	

		var offer = he.create('Label', {color: '#ffffff', font:{fontSize:14}, textAlign:'center', right:0, top: 3, text: args.offer});
		var viewOffer = he.create('View', {backgroundColor: he.getPset('TableViewRow').backgroundSelectedColor, height:23, bottom:0 });
		viewOffer.add(offer);
		trv.add(viewOffer);
    	tr.add(trv);
  		
  		return tr;
    	
    });
})();
