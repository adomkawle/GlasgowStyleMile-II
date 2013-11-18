(function() {
	he.register('whatsOn', function(args) {

		// Get some defaults
		var activity 	= platform == 'Android' ? Ti.Android.currentActivity : null;
		var win 		= Ti.UI.currentWindow;
		var openedWindow = false;
		var hasOpened = false;

		var mapBtn = he.create('Button', {
			backgroundImage: 'application/assets/images/map.png',
			width: 61,
			height: 29
		});

		mapBtn.addEventListener('click', function() {
			if (platform == 'Android') {
				var intent = Ti.Android.createIntent({
					action: Ti.Android.ACTION_VIEW,
					type: 'image/png',
					data: Ti.Filesystem.getFile(Ti.Filesystem.externalStorageDirectory, 'local_map.png').nativePath
				});
				Ti.Android.currentActivity.startActivity(intent);
			} else {
				var mapWindow = he.create('zoomableImage', {
					title: 'Style Mile',
					image: 'maps/local_map.jpg',
					minZoom: 0.2
				});
				//mapWindow.open();
				//Ti.UI.currentTab.open(mapWindow);
				tabGroup.activeTab.open(mapWindow);
			}
		});

		// Atanas: Window title on iOS 7
		var w;
		if( ios7 == true ) {
			w = he.create('Window', {title: 'What\'s On', navBarHidden: false, backgroundColor: '#fff', rightNavButton: mapBtn, titleControl:  Ti.UI.createLabel({ text: 'What\'s On', color: 'white' })});
		} else {
			w = he.create('Window', {title: 'What\'s On', navBarHidden: false, backgroundColor: '#fff', rightNavButton: mapBtn});
		}
		w.orientationModes = [Titanium.UI.PORTRAIT];

		// Add a search bar
        var searchBar = he.create('SearchBar', {top: 0, height: 40, barColor: '#000', hintText: 'Search What\'s On', returnKeyType:Titanium.UI.RETURNKEY_SEARCH});
        w.add(searchBar);

        searchBar.addEventListener('return', function(e) {

        	searchBar.blur();
        	if (platform == 'android') Ti.UI.Android.hideSoftKeyboard();
        	if (openedWindow === false) {
        		var whatsOnResults = he.create('whatsOnResults', {keyword: searchBar.value, navBarHidden: true, type:'by_keyword'});
        		navigationController.open( whatsOnResults );
        	}


        });

		var carouselHolder = he.create('View', {height: 113});
		w.add(carouselHolder);
		var carousel = he.create('carousel', {top: 0});
		carouselHolder.add(carousel);

		var firstLoad = true;
		w.addEventListener('focus', function() {
			// Don't do this on first focus
			if (firstLoad) {
				firstLoad = false;
				return;
			}

			Ti.API.info('Making new carousel');
			if (carousel) carouselHolder.remove(carousel);
			carousel = null;

			carousel = he.create('carousel', {top: 0});
			carouselHolder.add(carousel);

			// needs an event to make sure it not on a different view.
			carousel.addEventListener('scrollEnd', function() {
				var index = carousel.currentPage;
				nextView = index;
			});
		});

		var nextView = 0;

		function startTimer() {
			hasOpened = true;
			w.timer = setTimeout(function() {
				nextView++;
				if (nextView >= (carousel.totalViews)) {
					nextView = 0;
					carousel.scrollToView(nextView);
				} else {
					carousel.scrollToView(nextView);
				}
				startTimer();
			}, 3000);
		}

		var theListCategories = he.create('theListCategories', {top: 0});
		// var catHolder = he.create('View', {width: app.deviceWidth, height: theListCategories.height, backgroundColor: '#000'});
		// catHolder.add(theListCategories);
		w.add(theListCategories);

		// Show add on iPhone 5 screen height and above
		if (app.deviceHeight >= 510) w.add(he.create('adMob', {top: 20, bottom: 0}));

		w.addEventListener('open', function() {
			if (hasOpened == false) startTimer();

			GoogleAnalytics.trackPageView('whats_on');
		});

		w.addEventListener('close', function() {
			clearTimeout(w.timer);
			//startTimer = null;
		});


		return w;
	});
})();
