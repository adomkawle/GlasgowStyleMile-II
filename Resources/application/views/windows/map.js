(function() {
	he.register('mapWindow', function(args) {

		var backBtn = he.create('backBtn');
		var w = he.create('Window', {
			title: args.title || "What's On",
			backgroundColor: '#000',
			leftNavButton: backBtn
		});
		backBtn.addEventListener('click', function() {
			w.close();
		});

		function show_images() {
			app.newMapView();
			app.mapView.height = Ti.UI.FILL;
			var markers = [];
			
			var mapLength;
			if (args.events.length > 30){
				mapLength = 30;
			} else {
				mapLength = args.events.length;
			}
			
			var _points = [];
			for (var i = 0; i < mapLength; i++) {
				var ev = args.events[i];

				if (platform == 'Android') {
					
					rightView = he.create('ImageView', {
						image:  directoryPath+'application/assets/images/whitechervon.png',
						height: 17,
						width:  20,
						id: ev.id
					});
					rightView.addEventListener('click', function(e) {
						if (args.type == 'whats_on') {
							var whatsOnDetail = he.create('whatsOnDetail', {id: e.source.id});
							navigationController.open( whatsOnDetail );
						} else if (args.type == 'stores') {
							var detailsWindow = he.create('DetailWindow', {id: e.source.id});
							navigationController.open( detailsWindow );
						}
					});
					if( platform == 'Android' ) {
						markers[i] = MapModule.createAnnotation({
							id: ev.id,
							title: ev.title,
							latitude: ev.lat,
							longitude: ev.lng,
							rightView: rightView
						});
					} else {
						markers[i] = Ti.Map.createAnnotation({
							id: ev.id,
							title: ev.title,
							latitude: ev.lat,
							longitude: ev.lng,
							rightView: rightView
						});
					}
				} else {
					if( platform == 'Android' ) {
						markers[i] = MapModule.createAnnotation({
							id: ev.id,
							title: ev.title,
							latitude: ev.lat,
							longitude: ev.lng,
							rightButton: Ti.UI.iPhone.SystemButton.DISCLOSURE
						});
					} else {
						markers[i] = Ti.Map.createAnnotation({
							id: ev.id,
							title: ev.title,
							latitude: ev.lat,
							longitude: ev.lng,
							rightButton: Ti.UI.iPhone.SystemButton.DISCLOSURE
						});
					}
				}

				markers[i].addEventListener('click', function(e) {
					Ti.API.info('CLICK: '+e.source.id);

					if (e.clicksource == 'rightButton') {
						
						if (args.type == 'whats_on') {

							var whatsOnDetail = he.create('whatsOnDetail', {id: e.source.id});
							navigationController.open( whatsOnDetail );

						} else if (args.type == 'stores') {

							var detailsWindow = he.create('DetailWindow', {id: e.source.id});
							navigationController.open( detailsWindow );
				
						}

					}
				});
				_points.push({lat: ev.lat, lng: ev.lng});
			}

			// calcRegoin taken from LLQ, bit hacky, but whatcha gonna do? Reinvent the wheel?

			points = [];
			for (var i = 0; i < _points.length; i++) points.push(_points[i]);
			
			if (points.length > 1) {
				var tmpDeltatLat = 0, tmpDeltatLong = 0, maxDeltatLat = 0, maxDeltatLong = 0, centerLat = 0, centerLong = 0, nbPtToShow = points.length-1;

				var maxPoints = Math.floor(points.length / 2);
				for (var i = 0; i <= maxPoints; i++) {
					for (var j = nbPtToShow; j >= maxPoints; j--) {
						if (j != i) {
							
							tmpDeltatLat = Math.abs(Math.abs(points[i].lat) - Math.abs(points[j].lat));
							if (tmpDeltatLat > maxDeltatLat) {
								maxDeltatLat = tmpDeltatLat;
								centerLat = Math.min(points[i].lat, points[j].lat) + maxDeltatLat / 2;
							}
							
							tmpDeltatLong = Math.abs(Math.abs(points[i].lng) - Math.abs(points[j].lng));
							if (tmpDeltatLong > maxDeltatLong) {
								maxDeltatLong = tmpDeltatLong;
								centerLong = Math.min(points[i].lng, points[j].lng) + maxDeltatLong / 2;
							}
						}
					}
				}
				if (maxDeltatLat > maxDeltatLong) maxDeltatLong = maxDeltatLat;
				if (maxDeltatLong > maxDeltatLat) maxDeltatLat = maxDeltatLong;
				var region = {
					latitude : centerLat,
					longitude : centerLong,
					latitudeDelta : maxDeltatLat,
					longitudeDelta : maxDeltatLong
				};
				
			} else if (points.length == 1) {
				var region = {
					latitude : points[0].lat,
					longitude : points[0].lng,
					latitudeDelta : 0.1,
					longitudeDelta : 0.1
				};
			}
			
			Ti.API.info('Map region: '+region);
			app.mapView.setRegion(region);

			// /calcRegion


			app.mapView.addAnnotations(markers);
			
		};

		
		show_images();

		w.addEventListener('focus', function() {
			show_images();
		});

		w.add(app.mapView);

		GoogleAnalytics.trackPageView('whats_on/map');

		return w;

	});
})();
