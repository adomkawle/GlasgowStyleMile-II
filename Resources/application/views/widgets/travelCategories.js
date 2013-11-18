(function() {
	he.register('travelCategories', function(args) {

		var v = he.create('View', {height: 387, top: args.top ? args.top : 0, width: Ti.Platform.displayCaps.platformWidth, zIndex: 99});

		function openResults( /* String */ e ){
			alert(e.searchType);
			alert(JSON.stringify(e));
		}

		v.add( he.create('View', 'travelBackground') );
		v.add( he.create('Label', 'travelText') );
		v.add( he.create('Label', 'travelPlanner') );
		// var visit = he.create('ImageView', 'visitIcon');
		// v.add(visit);
		// var visitLabel = he.create('Label', 'visitLabel');
		// v.add(visitLabel);
		var visit = he.create('contactButton', {type: 'find', "short": true, right: 90, top: 20});
		v.add(visit);

		visit.addEventListener('click', function(){
			if (platform == 'Android') {
				var intent = Ti.Android.createIntent({
					action : Ti.Android.ACTION_VIEW,
					data: 'geo:0,0?q=Glasgow Visitor Information Centre, 170 Buchanan St, Glasgow, Glasgow & The Clyde Valley G1 2LW'
				});

				Ti.Android.currentActivity.startActivity(intent);

			} else {
				navigationController.open(openWebBrowser("http://maps.google.com/maps?q=Glasgow Visitor Information Centre, 170 Buchanan St, Glasgow, Glasgow & The Clyde Valley G1 2LW"));
			}
		});

		// Visitor Info
		// Information Center
		// 170 Buchanan St, Glasgow

		// var call = he.create('ImageView', 'callIcon');
		// v.add(call);
		// var callLabel = he.create('Label', 'callLabel');
		// v.add(callLabel);
		var call = he.create('contactButton', {type: 'call', "short": true, right: 10, top: 20});
		v.add(call);

		call.addEventListener('click', function(){
			if (platform == 'Android') {
				var intent = Ti.Android.createIntent({
					action : Ti.Android.ACTION_CALL,
					data : "tel:01412044400"
				});
				Ti.Android.currentActivity.startActivity(intent);

			} else {
				Ti.Platform.openURL("tel:01412044400");
			}
		});

		v.add(he.create('View', 'devider', {top: 65, left: 10, right: 10}));

		// var website = he.create('ImageView', 'websiteIcon');
		// v.add(website);
		// var websiteLabel = he.create('Label', 'websiteLabel');
		// v.add(websiteLabel);
		var website = he.create('contactButton', {type: 'web', "short": true, right: 10, top: 80});
		v.add(website);

		website.addEventListener('click', function(){
			if (platform == 'Android') {
				// http://www.joinupmyjourney.com/
				var intent = Ti.Android.createIntent({
					action : Ti.Android.ACTION_VIEW,
					data : 'http://www.travelinescotland.com/staleData.do;jsessionid=C168CC02E5D2343156BEB3696C546617.sc2'
				});
				Ti.Android.currentActivity.startActivity(intent);

			} else {
				navigationController.open(openWebBrowser("http://www.travelinescotland.com/staleData.do;jsessionid=C168CC02E5D2343156BEB3696C546617.sc2"));
			}
		});


	   var travelContainer = he.create('View', 'travelContainer');

		//  1      2       3
		//  bus    subway  rail
		//  taxi   road    parking
		//  ferry  air     mobility
		/*
		var third		= app.deviceWidth / 3;
		var one_grid 	= he.create('View', 'threebythree',	{left: 0,			top: 0});
		var two_grid 	= he.create('View', 'threebythree',	{left: third+1,		top: 0});
		var three_grid 	= he.create('View', 'threebythree',	{left: third*2+2,	top: 0});

		var four_grid   = he.create('View', 'threebythree',	{left: 0,			top: 61});
		var five_grid   = he.create('View', 'threebythree',	{left: third+1,		top: 61});
		var six_grid    = he.create('View', 'threebythree',	{left: third*2+2,	top: 61});

		var seven_grid  = he.create('View', 'threebythree',	{left: 0,			top: 122});
		var eight_grid  = he.create('View', 'threebythree',	{left: third+1,		top: 122});
		var nine_grid   = he.create('View', 'threebythree',	{left: third*2+2,	top: 122});
		*/

		var third		   = app.deviceWidth * 0.3;
		var spacing 	   = app.deviceWidth * 0.03;
		spacing 		   = spacing * 1.3;

		var last_pos  	   = Math.round((third*2)+(spacing* 1.9));

		var one_grid 	= he.create('View', 'threebythree',	{left: 0,top: 0});
		var two_grid 	= he.create('View', 'threebythree',	{left: third+spacing, top: 0});
		var three_grid 	= he.create('View', 'threebythree',	{left: last_pos,top: 0});

		var four_grid   = he.create('View', 'threebythree',	{left: 0,			top: 61});
		var five_grid   = he.create('View', 'threebythree',	{left: third+spacing,		top: 61});
		var six_grid    = he.create('View', 'threebythree',	{left: last_pos,	top: 61});

		var seven_grid  = he.create('View', 'threebythree',	{left: 0,			top: 122});
		var eight_grid  = he.create('View', 'threebythree',	{left: third+spacing,		top: 122});
		var nine_grid   = he.create('View', 'threebythree',	{left: last_pos,	top: 122});


		// icons
		var bus			= he.create('ImageView', 'busIcon');
		var subway		= he.create('ImageView', 'subwayIcon');
		var rail		= he.create('ImageView', 'railIcon');
		var taxi		= he.create('ImageView', 'taxiIcon');
		var road		= he.create('ImageView', 'roadIcon');
		var parking		= he.create('ImageView', 'parkingIcon');
		var ferry		= he.create('ImageView', 'ferryIcon');
		var air			= he.create('ImageView', 'airIcon');
		var mobility	= he.create('ImageView', 'mobilityIcon');

		var busLabel 	 = he.create('Label', 'threebythreelabel', {text: 'bus'});
		var subwayLabel  = he.create('Label', 'threebythreelabel', {text: 'subway'});
		var railLabel    = he.create('Label', 'threebythreelabel', {text: 'rail'});
		var taxiLabel    = he.create('Label', 'threebythreelabel', {text: 'taxi'});
		var roadLabel    = he.create('Label', 'threebythreelabel', {text: 'road'});
		var parkingLabel = he.create('Label', 'threebythreelabel', {text: 'parking'});
		var ferryLabel   = he.create('Label', 'threebythreelabel', {text: 'ferry'});
		var airLabel     = he.create('Label', 'threebythreelabel', {text: 'air'});
		var moblityLabel = he.create('Label', 'threebythreelabel', {text: 'mobility'});

		// busLabel.text('Bus');

		one_grid.add(bus);
		one_grid.add(busLabel);

		two_grid.add(subway);
		two_grid.add(subwayLabel);

		three_grid.add(rail);
		three_grid.add(railLabel);

		four_grid.add(taxi);
		four_grid.add(taxiLabel);

		five_grid.add(road);
		five_grid.add(roadLabel);

		six_grid.add(parking);
		six_grid.add(parkingLabel);

		seven_grid.add(ferry);
		seven_grid.add(ferryLabel);

		eight_grid.add(air);
		eight_grid.add(airLabel);

		nine_grid.add(mobility);
		nine_grid.add(moblityLabel);



		var grid_collection = [one_grid, two_grid, three_grid, four_grid, five_grid, six_grid, seven_grid, eight_grid, nine_grid];
		// add mousedown and mouseup effects;
		for(var i = 0; i < grid_collection.length; i++)
		{
			grid_collection[i].addEventListener('touchstart', function(event)
			{
				this.opacity = 0.2;
			});

			grid_collection[i].addEventListener('touchend', function(event){
				this.opacity = 1;
			});

			travelContainer.add(grid_collection[i]);
		}

		/*
		travelContainer.add( one_grid,    two_grid,   three_grid,
							 four_grid ,  five_grid,  six_grid,
							 seven_grid , eight_grid, nine_grid );
		*/

		v.add(travelContainer);

		one_grid.addEventListener('singletap', function(){
			gsm.actInd.show();
			var travelResults = he.create('travelResults', {type: 'bus', navBarHidden:true});
			navigationController.open( travelResults );
		});

		 two_grid.addEventListener('singletap', function(){
			gsm.actInd.show();
			var travelResults = he.create('travelResults', {type: 'subway', navBarHidden:true});
			navigationController.open( travelResults );
		});

		three_grid.addEventListener('singletap', function(){
			gsm.actInd.show();
			var travelResults = he.create('travelResults', {type: 'rail', navBarHidden:true});
			navigationController.open( travelResults );
		});


		four_grid.addEventListener('singletap', function(){
			gsm.actInd.show();
			var travelResults = he.create('travelResults', {type: 'taxi', navBarHidden:true});
			navigationController.open( travelResults );
		});

		five_grid.addEventListener('singletap', function(){
			gsm.actInd.show();
			var travelResults = he.create('travelResults', {type: 'road', navBarHidden:true});
			navigationController.open( travelResults );
		});

		six_grid.addEventListener('singletap', function(){
			gsm.actInd.show();
			var travelResults = he.create('travelResults', {type: 'parking', navBarHidden:true});
			navigationController.open( travelResults );
		});


		seven_grid.addEventListener('singletap', function(){
			gsm.actInd.show();
			var travelResults = he.create('travelResults', {type: 'ferry', navBarHidden:true});
			navigationController.open( travelResults );
		});

		eight_grid.addEventListener('singletap', function(){
			gsm.actInd.show();
			var travelResults = he.create('travelResults', {type: 'air', navBarHidden:true});
			navigationController.open( travelResults );
		});

		nine_grid.addEventListener('singletap', function(){
			gsm.actInd.show();
			var travelResults = he.create('travelResults', {type: 'mobility', navBarHidden:true});
			navigationController.open( travelResults );
		});

		var bottom_space = 6;
		// Atanas:
		// Fix for People Make Glasgow for iPhone 4
		if( rebrand == 'pmg' ) {
			if( Ti.Platform.displayCaps.platformHeight <= 480 ) {
				bottom_space = 16;
			}
		}
		
		var logoView = he.create('View', {height: '65', bottom: bottom_space, width: Ti.Platform.displayCaps.platformWidth, zIndex: 99, backgroundColor: '#FFF'});
		v.add(logoView);
		var travelLogo = he.create('ImageView', 'travelLogo');
		logoView.add(travelLogo);




		//var theatre = he.create('ImageView');
		//var family = he.create('ImageView');

		return v;
	});
})();
