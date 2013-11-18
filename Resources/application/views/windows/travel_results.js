(function() {
	he.register('travelResults', function(args) {
				
		// Get some defaults
		var activity 	= platform == 'Android' ? Ti.Android.currentActivity : null;
		var win 		= Ti.UI.currentWindow;
		var currentType = '';
		
		var backBtn = he.create('backBtn');
		var w = he.create('Window', {title: 'Travel - ' + ucwords(args.type), navBarHidden: false, leftNavButton: backBtn});
		w.orientationModes = [Titanium.UI.PORTRAIT];
		backBtn.addEventListener('click', function() {
			w.close();
		});
		
		w.addEventListener('open', function(){        	
			getTravelResults(args.type);

			GoogleAnalytics.trackPageView('travel_results/'+args.type);
		});
		
		var v = he.create('View', {layout: 'vertical'});

		if (args.type === 'rail' || args.type === 'parking') {

			var titleBar = he.create('titleBar', {useSwitch: true, zIndex: 1});
			v.add(titleBar);
			
			// View to hold the buttons
			var switchView = he.create('View', 'switchWideView');
			// Create and style the buttons
			var locationsBtn = he.create('Label', 'switchWideBtn', {
				text: 'Locations',
				right: 0,
				backgroundImage: directoryPath+'application/assets/images/switchWideRightActive.png',
				color: '#'+styles.get('switchActiveText')
			});
			
			var operatorsBtn = he.create('Label', 'switchWideBtn', {text: 'Operators', left: 0});
			
			
			// Add the buttons to the view
			switchView.add(locationsBtn);
			switchView.add(operatorsBtn);
			titleBar.add(switchView);
						
			
			// Add button event listeners
			locationsBtn.addEventListener('click', function() {
				locationsBtn.backgroundImage = directoryPath+'application/assets/images/switchWideRightActive.png';
				locationsBtn.color = he.getPset('switchBtn').activeColor;
				operatorsBtn.backgroundImage = false;
				operatorsBtn.backgroundColor = he.getPset('switchView').backgroundColor;
				operatorsBtn.color = he.getPset('switchBtn').color;
			});
			operatorsBtn.addEventListener('click', function() {
				locationsBtn.backgroundImage = false;
				locationsBtn.backgroundColor = he.getPset('switchView').backgroundColor;
				locationsBtn.color = he.getPset('switchBtn').color;
				operatorsBtn.backgroundImage = directoryPath+'application/assets/images/switchWideLeftActive.png';
				operatorsBtn.color = he.getPset('switchBtn').activeColor;
			});
			


		}

		if (args.type === 'rail' || args.type === 'mobility' || args.type === 'subway') {
			
			
			if (platform == 'Android') {
				// Add the title bar if this view doesnt have one
				if (!titleBar) {
					var titleBar = he.create('titleBar', {useSwitch: true, zIndex: 1});
					v.add(titleBar);
				}
				mapButton = he.create('Button', {
					title: 'Map',
					borderRadius: 5,
					backgroundColor: he.getPset('switchView').backgroundColor,
					height: 30,
					top: 10,
					width: 60,
					right: 20
				});
				titleBar.add(mapButton);
				if (switchView) switchView.left -= 40;
			} else {
				var mapButton = he.create('Button', {
					backgroundImage: directoryPath+'application/assets/images/map.png',
					width: 61,
					height: 29
				});
				w.rightNavButton = mapButton;
			}

			mapButton.addEventListener('click', function(){
				if (platform == 'Android') {
					switch(args.type){
						case 'rail':
							//navigationController.open( he.create('zoomImageView', {image: '/application/assets/images/GCMB/rail_map.png'}) );
							var intent = Ti.Android.createIntent({
								action: Ti.Android.ACTION_VIEW,
								type: 'image/png',
								data: Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'rail_map.png').nativePath
							});
							Ti.Android.currentActivity.startActivity(intent);

							break;
						case 'mobility':
							var intent = Ti.Android.createIntent({
								action: Ti.Android.ACTION_VIEW,
								type: 'image/png',
								data: Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'mobility_map.png').nativePath
							});
							Ti.Android.currentActivity.startActivity(intent);
							break;
						case 'subway':
							var intent = Ti.Android.createIntent({
								action: Ti.Android.ACTION_VIEW,
								type: 'image/png',
								data: Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'subway_map.png').nativePath
							});
							Ti.Android.currentActivity.startActivity(intent);
							break;
					}
				} else {
					var mapWindowArgs = {
						rail: {
							title: 'Rail map',
							image: 'maps/rail_map.png',
							minZoom: 0.2
						},
						mobility: {
							title: 'Mobility map',
							image: 'maps/mobility_map.png',
							minZoom: 0.45
						},
						subway: {
							title: 'Subway map',
							image: 'maps/subway_map.png',
							minZoom: 0.3
						}
					};

					var mapWindow = he.create('zoomableImage', mapWindowArgs[args.type]);
					mapWindow.open();
				}
			});
		}

		if (platform == 'Android') {
			if(args.type === 'rail'){
				locationsBtn.addEventListener('click', function(){
					if(args.type == 'rail'){
						return;
					}
					args.type = 'rail';

					getTravelResults('rail');
					v.add(app.mapView);
					tv.height = app.deviceHeight / 2 - 50;
				});

				operatorsBtn.addEventListener('click', function(){
					if(args.type == 'rail-operator'){
						return;
					}
					args.type = 'rail-operator';
					
					//getTravelResults('rail-operator');
					//app.mapView.hide();
					getOnlyTravelResults('rail-operator');
					v.remove(app.mapView);
					tv.height = app.deviceHeight - 50;

				});
			}

			if(args.type === 'parking'){
				locationsBtn.addEventListener('click', function(){
					if(args.type == 'parking'){
						return;
					}
					args.type = 'parking';
					
					getOnlyTravelResults('parking');
					v.add(app.mapView);
					tv.height = app.deviceHeight / 2 - 50;
				});

				operatorsBtn.addEventListener('click', function(){
					if(args.type == 'parking-operator'){
						return;
					}
					args.type = 'parking-operator';
					
					getOnlyTravelResults('parking-operator');
					v.remove(app.mapView);
					tv.height = app.deviceHeight - 50;
				});
			}
		} else {
			if(args.type === 'rail') {
				currentOrder = 'locations';

				locationsBtn.addEventListener('click', function() {
					currentOrder = 'locations';
					getTravelResults('rail');
					v.add(app.mapView);
					tv.height = app.deviceHeight / 2 - 50;
				});
				operatorsBtn.addEventListener('click', function() {
					currentOrder = 'rail-operator';
					getOnlyTravelResults('rail-operator');
					v.remove(app.mapView);
					tv.height = app.deviceHeight - 50;
				});

			}
			if(args.type === 'parking'){
				currentOrder = 'parking';
				
				locationsBtn.addEventListener('click', function() {
					// Nearby
					currentOrder = 'parking';
					getOnlyTravelResults('parking');
					v.add(app.mapView);
					tv.height = app.deviceHeight / 2 - 50;
				});
				operatorsBtn.addEventListener('click', function() {
					currentOrder = 'parking-operator';
					getOnlyTravelResults('parking-operator');
					v.remove(app.mapView);
					tv.height = app.deviceHeight - 50;
				});
			}
		}
		
		var tableHeight = 'auto';
		
		if(args.type !== 'taxi' && args.type !== 'road' && args.type !== 'ferry' && args.type !== 'mobility'){
			app.mapView.height = app.deviceHeight / 2 - 50;
			app.mapView.width = app.deviceWidth;
			app.mapView.removeAllAnnotations();
			app.mapView.touchEnabled = true;
			app.mapView.top = 0;
			app.mapView.zIndex = 2;
			v.add(app.mapView);

			// tableHeight = app.deviceHeight / 2 - 50;
		}
		
		w.add(v);
	   


		var tv = he.create('TableView', {top: 0, bottom: 0, width: app.deviceWidth, zIndex: 3});
		v.add(tv);

		function getOnlyTravelResults(/* String */ type) {
			// gsm.actInd.show();

			tv.setData([]);
			var data = [];

			var transportResults = gsm.return_transportation( type );
			count = 1;

			var j = transportResults.length;
			for (var i=0; i < j; i++) {
				var transport = transportResults[i];   
				data.push(he.create('transportRow', {
					title: transport.name,
					location: transport.latitude + ',' + transport.longitude,
					telephone: transport.telephone,
					website: transport.website,
					count: count,
					hasChild:true
				})); 
				count++;
			}

			tv.setData(data);
			// gsm.actInd.hide();

			data = null;
			try {
				transportResults.close();
			} catch(e) {}
			transportResults = null;

		}

		function getTravelResults(/* String */ type){
			currentType = type;

			// gsm.actInd.show();

			var data = [];
			var annotations = [];

			var transportResults = gsm.return_transportation( type );

			Ti.API.info('Total results was: ' + transportResults.length);

			var count = 1;

			var latMin = 999;
			var latMax = -999;

			var lngMin = 999;
			var lngMax = -999;

			try {
				app.mapView.removeAllAnnotations();

				for(var i=0,j=transportResults.length;i<j;i++){
					var transport = transportResults[i];   


					if(transport.latitude !== 0 || transport.longitude !==0 ){

						if(transport.latitude > latMax) {
							latMax = parseFloat(transport.latitude);
						}
						if(transport.longitude > lngMax) {
							lngMax = parseFloat(transport.longitude);
						}
						if(transport.latitude < latMin) {
							latMin = parseFloat(transport.latitude);
						}
						if(transport.longitude < lngMin) {
							lngMin = parseFloat(transport.longitude);
						}


						//var pinImage = he.create('badge', {count: args.count}).toImage().text;

						//alert(JSON.stringify(pinImage));
						if(type !== 'taxi' && type !== 'road' && type !== 'rail-operator' && type !== 'parking-operator' && type !== 'ferry' && type !== 'mobility'){
							//app.mapView.removeAllAnnotations();


							//app.mapView.show();
							//tv.height = app.deviceHeight / 2 - 50;

							// Atanas:
							if( platform == 'Android' ) {
								app.mapView.addAnnotation(MapModule.createAnnotation({
									latitude: transport.latitude,
									longitude: transport.longitude,
									title: transport.name,
									pincolor: Titanium.Map.ANNOTATION_RED,
									//pinImage: '/application/assets/images/GCMB/badge.png',
									pinImage: '/application/assets/images/badges/' + count + '.png',
									animate: true,
									transportId: transport.id // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
								}));
							} else {
								app.mapView.addAnnotation(Titanium.Map.createAnnotation({
									latitude: transport.latitude,
									longitude: transport.longitude,
									title: transport.name,
									pincolor: Titanium.Map.ANNOTATION_RED,
									//pinImage: '/application/assets/images/GCMB/badge.png',
									pinImage: '/application/assets/images/badges/' + count + '.png',
									animate: true,
									transportId: transport.id // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
								}));
							}

						}else{
							//app.mapView.hide();
							//tv.height = app.deviceHeight - 50;
						}
					}else{
						//app.mapView.hide();
						//tv.height = app.deviceHeight - 50;
					}

					data.push(he.create('transportRow', {
						title: transport.name,
						location: transport.latitude + ',' + transport.longitude,
						telephone: transport.telephone,
						website: transport.website,
						count: count,
						hasChild: true
					}));


					count++;
				}
			} catch(e){

			}

			var regionLat = parseFloat((latMax - latMin) / 2) + parseFloat(latMin);
			var regionLng = parseFloat((lngMax - lngMin) / 2) + parseFloat(lngMin);

			Ti.API.info('Region fit was: ' + regionLat + ', ' + regionLng);

			app.mapView.setLocation({
				latitude: regionLat,
				longitude: regionLng,
				latitudeDelta: (latMax - latMin) + 0.02,
				longitudeDelta: (lngMax - lngMin) + 0.02
			});	

			try {
				tv.setData(data);
			} catch(e) {
				Ti.API.error(e);
			}

			try {
				transportResults.close();
			} catch(e) {}

			transportResults = null;
			data = null;

			gsm.actInd.hide();
		}



		tv.addEventListener('click', function(e){
			if (!e.rowData.website && !e.rowData.telephone) {
				if (e.rowData.location !== '0,0') {

					if (platform == 'Android') {
						var intent = Ti.Android.createIntent({
							action : Ti.Android.ACTION_VIEW,
							data: 'geo:0,0?q=' + e.rowData.location + ' (' + e.rowData.mapTitle + ')'
						});

						Ti.Android.currentActivity.startActivity(intent);

					} else {
						navigationController.open(openWebBrowser("http://maps.google.com/maps?q="+e.rowData.location));
					}
				}

				return;
			}
			var options = [];
			if (e.rowData.website) {
				options.push('View Website');
			}
			if (e.rowData.telephone) {
				options.push('Telephone');
			}
			if (e.rowData.location !== '0,0') {
				options.push('Map');
			}
			options.push('Cancel');
			
			var dialog = Titanium.UI.createOptionDialog({
				title: 'What would you like to do?',
				options: options,
				cancel: options.length-1
			});
			dialog.show();

			dialog.addEventListener('click', function(s){
				if(s.source.options[s.index] == 'View Website'){
					if (platform == 'Android') {
						var intent = Ti.Android.createIntent({
							action : Ti.Android.ACTION_VIEW,
							data : e.rowData.website
						});

						Ti.Android.currentActivity.startActivity(intent);

					} else {
						navigationController.open(openWebBrowser(e.rowData.website));
					}
				}else if(s.source.options[s.index] == 'Telephone'){
					if (platform == 'Android') {
						var intent = Ti.Android.createIntent({
							action : Ti.Android.ACTION_CALL,
							data : "tel:" + e.rowData.telephone
						});

						Ti.Android.currentActivity.startActivity(intent);

					} else {
						Ti.Platform.openURL("tel:"+(e.rowData.telephone.replace(/[^0-9]/g, '')));
					}
				}else if(s.source.options[s.index] == 'Map'){
					if(e.rowData.location !== '0,0'){
						if (platform == 'Android') {
							var intent = Ti.Android.createIntent({
								action : Ti.Android.ACTION_VIEW,
								data: 'geo:0,0?q=' + e.rowData.location + ' (' + e.rowData.mapTitle + ')'
							});

							Ti.Android.currentActivity.startActivity(intent);

						} else {
							navigationController.open(openWebBrowser("http://maps.google.com/maps?q="+e.rowData.location));
						}
					}
				}

				Ti.API.info('You selected: ' + s.source.options[s.index]);
			});
		});

		
		//var travelCategories = he.create('travelCategories', {top: 0});
		//w.add(travelCategories);
		
		//w.add(he.create('adMob', {top: 5, bottom: 0}));
		
		return w;
	});
})();
