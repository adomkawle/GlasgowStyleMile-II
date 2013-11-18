(function() {
    he.register('eventsRow', function(args) {
    	
    	var tr = he.create('TableViewRow', {
				hasChild: false,
				height: 60,//Ti.UI.SIZE,
				minRowHeight: 60,
				className: 'RowStyleTwo',
				id: args.id
		});
		
		var trv = he.create('View', {height: 'auto', width: 'auto'});
// 		
		var date = he.create('Label', {top: 0, left: 5, text: args.dates, color: '#333333', font: {fontSize: 11}});
		trv.add(date);
		// Atanas: Adjust the size of the title label and font for iOS 7.
		var title;
		if( ios7 == true ) {
			title = he.create('Label', {top: 18, left: 5, text: args.title, color: '#000000', width:'65%', height: 20, font: {fontSize: 15}});
		} else {
			title = he.create('Label', {top: 18, left: 5, text: args.title, color: '#000000', width:'70%', height: 20});
		}
		trv.add(title);

		var open = he.create('Label', 'directoryRowArrow',       {text: 'K'});
		trv.add(open);
		
		if (args.venue == undefined && args.venue == ''){
			args.venue = '';
		} 
		
		var venue = he.create('Label', {top: 40, width:'40%', height: 16, left: 5, text: args.venue, color: '#333', font: {fontSize: 11}});
		trv.add(venue);

		if (args.prices == undefined && args.prices == '') {
			args.prices = '';
		}
		var prices = he.create('Label', {top: 40, width:'55%', textAlign:'right', height:16, right: 2, text: args.prices, color: '#000000', font: {fontSize: 11, fontWeight: 'bold'}});
		trv.add(prices);

		var distance = he.create('Label', 'directoryRowDistance', 	{text: '  '+args.distance+'  '});
		trv.add(distance);
//     	
    	tr.add(trv);

  		trv.addEventListener('touchstart', function() {
            title.color = he.getPset('TableViewRow').selectedColor;
            date.color = he.getPset('TableViewRow').selectedColor;
            prices.color = he.getPset('TableViewRow').selectedColor;
            venue.color = he.getPset('TableViewRow').selectedColor;
            open.color = he.getPset('directoryRowArrow').selectedColor;
            trv.backgroundColor = he.getPset('TableViewRow').backgroundSelectedColor;
            // For some reason this looses it's background
            distance.backgroundColor = he.getPset('directoryRowDistance').backgroundColor;
        });
        var untouch = function() {
            title.color = he.getPset('TableViewRow').color;
            date.color = he.getPset('TableViewRow').color;
            prices.color = he.getPset('TableViewRow').color;
            venue.color = he.getPset('TableViewRow').color;
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
  		return tr;
    	
    });
})();
