(function() {
	he.register('GalleryWindow', function(args) {
		


		var mapBtn = he.create('Button', {
			backgroundImage: directoryPath+'application/assets/images/map.png',
			width: 61,
			height: 29
		});
		mapBtn.addEventListener('click', function() {
			var mapWindow = he.create('GalleryMapWindow', {navBarHidden : false});
			navigationController.open( mapWindow );
		});

		var backBtn = he.create('backBtn');
		// Atanas: Window title on iOS 7
		var w;
		if( ios7 == true ) {
		    w = he.create('Window', {
				title: 'Gallery',
				backgroundColor: '#000',
				//rightNavButton: mapBtn,
				leftNavButton: backBtn,
				titleControl:  Ti.UI.createLabel({ text: 'Gallery', color: 'white' })
			});			
		} else {
		    w = he.create('Window', {
				title: 'Gallery',
				backgroundColor: '#000',
				//rightNavButton: mapBtn,
				leftNavButton: backBtn
			});
		}
		
		if(platform == 'Android'){
			var mapView = he.create('View', {
				height: 40,
				width: Ti.UI.FILL
			});
			w.add(mapView);
			mapBtn.top =  5;
			mapBtn.right = 10;
			mapView.add(mapBtn);
		}
		
		backBtn.addEventListener('click', function() {
			w.close();
		});


		var opacity = (platform == 'Android') ? 1 : 0;
		
		var scrollView = Ti.UI.createScrollView({
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			contentWidth: app.deviceWidth,
			contentHeight: 'auto',
			layout: 'horizontal',
			opacity: opacity,
			scrollType: 'vertical'
		});
		
		var imageViews = [];
		var loadNumber = 1;
		var currentLoad = 0;
		
		function show_images() {
			var images = gsm.get_gallery();
			loadNumber = images.length;
			
			loadNumber = Math.round(loadNumber / 1.5);

			if (images.length < 1) {
				Ti.API.info('No images, trying again.');
				setTimeout(function() {
					show_images();
				}, 500);
				return;
			}
			Ti.API.info('Found images: '+images.length);
			
			if(platform != 'Android'){
				loadNumber = 1;
				gsm.show_loading();
				// fallback incase it fails to hide. 				
			 
			}
			
			for (var i = 0; i < images.length; i++) {
				var view = Ti.UI.createView({
					// backgroundImage: images[i].url,
					width: 70,
					height: 70,
					left: 10,
					top: 5,
					opacity: 1,
					// preventDefaultImage: true,
					id: images[i].id
				});
					
				
				
				var mask = he.create('View', {
					width: 70,
					height: 200
				});
				
				var image = he.create('ImageView', {
					image: images[i].url,
					width: 70,
					// height: 'auto',
					id: images[i].id
				});
				
				if(platform != 'Android'){
					
					image.addEventListener('load', function(){
						currentLoad++;
						if(loadNumber == currentLoad){
							gsm.hide_loading();
							scrollView.opacity = 1;						
						}
					});
					
					image.addEventListener('error', function(){
						currentLoad++;
						if(loadNumber == currentLoad){
							gsm.hide_loading();
							scrollView.opacity = 1;
						}
	 				});
				}
				mask.add(image);
				view.add(mask);

				view.addEventListener('click', function(e) {
					var galleryLargeWindow = he.create('GalleryLargeWindow', {id: e.source.id});
					navigationController.open( galleryLargeWindow );
				});
				
				imageViews[i] =  view;
				scrollView.add(imageViews[i]);			
			}
			
			
		}
		
		

		w.add(scrollView);
		setTimeout(function(){
			show_images();
		},100)
		
		GoogleAnalytics.trackPageView('gallery');

		return w;

	});
	
	
 
	
})();
