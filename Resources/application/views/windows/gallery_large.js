(function() {
	he.register('GalleryLargeWindow', function(args) {
		
		var rightNavButton = he.create('Button', {
			title: ' ',
			backgroundImage: directoryPath+'application/assets/images/out_btn.png',
			width: 60,
			height: 30
		});

		var backBtn = he.create('backBtn');
		var w = he.create('Window', {
			title: 'Gallery',
			backgroundColor: '#000',
			rightNavButton: rightNavButton,
			leftNavButton: backBtn,
			layout: 'absolute'
		});
		backBtn.addEventListener('click', function() {
			w.close();
		});
		
		rightNavButton.addEventListener('click', function() {

			var img = images[scrollView.currentPage];
			if (platform == 'Android') {
				var intent = Ti.Android.createIntent({
					action : Ti.Android.ACTION_VIEW,
					data: 'geo:0,0?q=' + img.lat+','+img.lng + ' (' + img.title + ')'
				});

				Ti.Android.currentActivity.startActivity(intent);

			} else {
				navigationController.open(openWebBrowser("http://maps.google.com/maps?q="+img.lat+','+img.lng+'('+img.title+')'));
			}
		});

		var images = gsm.get_gallery();
		var imageViews = [];

		var currentPage = 0;
		for (var i = 0; i < images.length; i++) {
			imageViews[i] = he.create('galleryLargeItem', images[i]);
			if (images[i].id == args.id) currentPage = i;
		}

		var scrollView = Ti.UI.createScrollableView({
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			showPagingControl: true,
			views: imageViews,
			currentPage: currentPage,
			bottom: 0
		});

		w.add(scrollView);
		
		if(platform == "Android"){
			var view = Ti.UI.createView({
				height: 60,
				top:0,
				width: Ti.UI.FILL
			});
			
			rightNavButton.right = 10;
			
			view.add(rightNavButton);
			w.add(view);
		}		

		GoogleAnalytics.trackPageView('gallery/large');

		return w;

	});
})();
