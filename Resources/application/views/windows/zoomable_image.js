(function() {
	he.register('zoomableImage', function(args) {
		var mapCloseBtn = Ti.UI.createButton({
			//title: 'Close',
			backgroundImage: '/application/assets/images/back.png',
			width: 42,
			height: 29
		});
		var mapWindow = Ti.UI.createWindow({
			title: args.title,
//			modal: true,
			navBarHidden: false,
			leftNavButton: mapCloseBtn,
		//	leftNavButton: null,
			backgroundColor: '#000',
			barImage: '/application/assets/images/nav_bar.png',
		});
		mapCloseBtn.addEventListener('click', function() {
			mapWindow.close();
		});

		var scrollView = Titanium.UI.createScrollView({
			maxZoomScale: 2.0,
			minZoomScale: args.minZoom,
			zoomScale: args.minZoom
		});
		
		scrollView.add(Ti.UI.createImageView({
			image: args.image,
			enableZoomControls: true,
			canScale: true
		}));

		mapWindow.add(scrollView);
		
		return mapWindow;
	});
})();
