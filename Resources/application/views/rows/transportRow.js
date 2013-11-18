(function() {
    he.register('transportRow', function(args) {
    	
    	var tr = he.create('TableViewRow', {
				hasChild: args.hasChild === true ? true : false,
				height: Ti.UI.SIZE,
				minRowHeight: 50,
				// className: 'RowStyleTwo',
				id: args.id,
				mapTitle : args.title,
				website: args.website,
				telephone: args.telephone,
				location: args.location
		});
		
		var trv = he.create('View', {height: Ti.UI.SIZE, width: Ti.UI.FILL});
		
		//var badgeIcon = he.create('ImageView', {left: 0, height: 'auto', width: 'auto', image: '/application/assets/images/GCMB/badge.png'});
		
		if (args.count) {
			var badgeIcon = he.create('badge', {
				count: args.count,
				left: 10,
				top: 10
			});
			trv.add(badgeIcon);
		}
		
		var right = 15;
		
		if(args.telephone){
			var phoneIcon = he.create('ImageView', {
				right: 15,
				height: 20,
				width: 20,
				image: directoryPath+'application/assets/images/GCMB/call_icon.png'
			});
			trv.add(phoneIcon);
		}
		if(args.website){
			if(args.telephone) right = 35;
			var webIcon = he.create('ImageView', {
				right: right,
				height: 20,
				width: 20,
				image: directoryPath+'application/assets/images/GCMB/web_icon.png'
			});
			trv.add(webIcon);
		}
		
		
    	var title = he.create('Label', 'directoryRowTitle', {
    		text: args.title,
    		right: 50,
    		left: 45,
    		top: 10,
    		bottom: 10
    	});
    	
    	trv.add(title);
    	
    	
    	tr.add(trv);
  		
  		return tr;
    	
    });
})();
