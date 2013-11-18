(function() {
	he.register('nearbyStore', function(args) {
		
		
		
		if(platform == 'Android')
		{
			if(args.counter == 0){
				androidLeft = 10;
			} else {
				androidLeft = 190;
			}
		}
		
		var v = he.create('View', {
			width: 180,
			height: 100,
			boxHeight: 100,
			backgroundColor: '#FFF',
			id: args.id,
			left:  (platform == 'Android') ? (androidLeft * args.counter) : 10
		});
		
		v.add(he.create('Label', {
			text: args.name,
			top: 25,
			width: '90%',
			left: '5%',
			bottom: 30,
			font: {
				fontSize: 18,
				fontFamily: 'Semplicita Pro'
			},
			color: he.getPset('detailSubTitle').color,
			zIndex: 100,
			verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER,
			textAlign: 'center'
		}));

		if (args.categories && args.categories.length > 0) {
			var cat_name = args.categories[0].name;
			if (args.categories.length > 1) {
				cat_name += ' / '+args.categories[1].name;
			}

			v.add(he.create('Label', {
				text: cat_name,
				bottom: 0,
				height: 30,
				color: '#999',
				textAlign: 'center',
				font: {
					fontSize: 12,
					fontFamily: 'Semplicita Pro'
				}
			}));
		}
		
		v.addEventListener('click', function() {
			
			if(args.type == "whats_on"){
				
				var detailsWindow = he.create('DetailWindow', {id: args.id, hideCycle:true});
				navigationController.open( detailsWindow );
			
			} else {
			
				var detailsWindow = he.create('DetailWindow', {id: args.id, hideCycle:args.hideCycle});
				navigationController.open( detailsWindow );
			
			}
							
		});
		
		
		return v;
	});
})();
