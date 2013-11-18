(function() {
	he.register('GalleryMapWindow', function(args) {

		// var tilesBtn = he.create('Button', {
			// title: 'Gallery'
		// });
// 		
		var tilesBtn = he.create('Button', {
					title: 'Gallery',
					borderRadius: 5,
					backgroundColor: 'black',
					height: 30,
					top: 10,
					width: 100,
					right: 20
				});
		
		
		tilesBtn.addEventListener('click', function() {
			var galleryWindow = he.create('GalleryWindow', {navBarHidden : false});
			navigationController.open( galleryWindow );
		});

		// Atanas: Window title on iOS 7
		var w;
		if( ios7 == true ) {
			w = he.create('Window', {
				title: 'Map',
				backgroundColor: '#000',
				rightNavButton: tilesBtn,
				height: Ti.UI.FILL,
				titleControl:  Ti.UI.createLabel({ text: 'Map', color: 'white' })
			});
		} else {
			w = he.create('Window', {
				title: 'Map',
				backgroundColor: '#000',
				rightNavButton: tilesBtn,
				height: Ti.UI.FILL
			});
		}


		function show_images() {
			// app.newMapView( Ti.UI.FILL );
			app.mapView.height = Ti.UI.FILL;
			app.mapView.touchEnabled = true;
			app.mapView.removeAllAnnotations();

			var images = gsm.get_gallery(true);
			var markers = [];
			
			var _points  = [];
			var rightBtn;
			var leftBtn;
			
			for (var i = 0; i < images.length; i++) {

				// Skip ones with no lat/lng
				// if (!images[i].lat && !images[i].lng) continue;

				if ( platform != 'Android' ){
					markers[i] = Ti.Map.createAnnotation({
						// image: Ti.UI.createImageView({
						image: Ti.Filesystem.applicationCacheDirectory+Ti.Filesystem.separator+'marker_images'+Ti.Filesystem.separator+images[i].id+'.png',
						//  width: 67,
						//  height: 67,
						//  borderColor: '#FFF',
						//  borderWidth: 3,
						//  borderRadius: 3,
						//  preventDefaultImage: true,
						// }),
						title: images[i].title,
						latitude: parseFloat(images[i].lat),
						longitude: parseFloat(images[i].lng),
						rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE, //directoryPath+'application/assets/images/GCMB/chevron.png',
						leftButton: directoryPath+'application/assets/images/dark_out.png',
						id: images[i].id
					});
				}
				else
				{	
					leftBtn  = he.create('ImageView', {
						image:  directoryPath+'application/assets/images/dark_out.png',
						height: 26,
						width:  33,
						id: images[i].id,
						latitude: parseFloat(images[i].lat),
						longitude: parseFloat(images[i].lng),
						title: images[i].title
					});
					 
					rightBtn = he.create('ImageView', {
						image:  directoryPath+'application/assets/images/whitechervon.png',
						height: 25,
						width:  30,
						id: images[i].id,
						latitude: images[i].lat,
						longitude: images[i].lng
					});

					var file = Ti.Filesystem.getFile( Ti.Filesystem.applicationCacheDirectory+Ti.Filesystem.separator+'marker_images'+Ti.Filesystem.separator+'android_'+images[i].id+'.png' );
					// Atanas: Replace the Ti 2.X Map with MapModule
					markers[i] = MapModule.createAnnotation({
						pincolor: Ti.Map.ANNOTATION_RED,
						// pinImage: file.resolve(),
						image: file.resolve(),
						title: images[i].title,
						latitude: images[i].lat,
						longitude: images[i].lng,
						leftView: leftBtn,
						rightView: rightBtn,
						id: images[i].id,
					});
				}
				
				
				// bind android events.
				
				if ( platform == 'Android' ){
					rightBtn.addEventListener('click', function(e){
						
						var galleryLargeWindow = he.create('GalleryLargeWindow', {id: e.source.id});
						navigationController.open( galleryLargeWindow );
					});
					
					leftBtn.addEventListener('click', function(e){

						var intent = Ti.Android.createIntent({
							action : Ti.Android.ACTION_VIEW,
							data: 'geo:0,0?q=' + e.source.latitude+','+e.source.longitude + ' (' + e.source.title + ')'
						});

						Ti.Android.currentActivity.startActivity(intent);
						navigationController.open(openWebBrowser("http://maps.google.com/maps?q="+e.source.latitude+','+e.source.longitude));

					});
				}
				 
				markers[i].addEventListener('click', function(e) {
					
					if (e.clicksource == 'rightButton') {
						var galleryLargeWindow = he.create('GalleryLargeWindow', {id: e.source.id});
						navigationController.open( galleryLargeWindow );

					} else if (e.clicksource == 'leftButton') {
						if (platform == 'Android') {
							var intent = Ti.Android.createIntent({
								action : Ti.Android.ACTION_VIEW,
								data: 'geo:0,0?q=' + e.source.latitude+','+e.source.longitude + ' (' + e.source.title + ')'
							});

							Ti.Android.currentActivity.startActivity(intent);

						} else {
							navigationController.open(openWebBrowser("http://maps.google.com/maps?q="+e.source.latitude+','+e.source.longitude));
						}
					}
				});
				_points.push({lat: images[i].lat, lng: images[i].lng});
			}

			// calcRegoin taken from LLQ, bit hacky, but whatcha gonna do? Reinvent the wheel?

			points = [];
			for (var i = 0; i < _points.length; i++) points.push(_points[i]);
			
			if (points.length > 1) {
				var tmpDeltatLat = 0, tmpDeltatLong = 0, maxDeltatLat = 0, maxDeltatLong = 0, centerLat = 0, centerLong = 0, nbPtToShow = points.length-1;

				var maxPoints = Math.floor(points.length / 2);
				for (var i = 0; i <= maxPoints; i++) {
					for (var j = nbPtToShow; j >= maxPoints; j--) {
						if (!points[i].lat && !points[i].lng) continue;
						
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
			w.add(app.mapView);
 			
		}
		
 
		w.addEventListener('focus', function() {
 			show_images();
		});

		GoogleAnalytics.trackPageView('gallery/map');
				
		w.addEventListener('blur', function(e) {
			w.remove(app.mapView);
 	});
		
 
		

		return w;

	});
})();
