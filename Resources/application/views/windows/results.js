(function() {
	he.register('ResultsWindow', function(args) {
				
		// Get some defaults
		var activity 	= platform == 'Android' ? Ti.Android.currentActivity : null;
		var win 		= Ti.UI.currentWindow;
		var currentResults = [];
		var currentOrder = 'distance';
		var eventsForMap = [];

		gsm.preferedCategory = args.id;
		
		if (args.type == 'by_category') {
			var category 	= gsm.return_category(args.id);
			var window_title = category.name;
		} else if (args.type == 'search') {
			var window_title = 'Search';
		} else if(args.type == 'whats_hot') {
			var window_title = 'What\'s Hot';
		} else if(args.type == 'special_offers') {
			var window_title = 'Special Offers';
		} else if(args.type == 'events') {
			var window_title = 'Events';
			var category 	= gsm.return_category(58);
		} else {
			var window_title = 'Near Me';
		}
		
		var mapBtn = he.create('Button', {
			backgroundImage: directoryPath+'application/assets/images/map.png',
			width: 61,
			height: 29
		});
		// Atanas: Window title on iOS 7
		var w;
		if( ios7 == true ) {
			w = he.create('Window', {
				title: window_title,
				navBarHidden: false,
				layout: '',
				rightNavButton: mapBtn,
				backgroundColor: '#FFF',
				titleControl:  Ti.UI.createLabel({ text: window_title, color: 'white' })
			});
		} else {
			w = he.create('Window', {
				title: window_title,
				navBarHidden: false,
				layout: '',
				rightNavButton: mapBtn,
				backgroundColor: '#FFF'
			});	
		}
		
		if (args.type != 'search') {
			var backBtn = he.create('backBtn');
			backBtn.addEventListener('click', function() {
				w.close();
			});
			w.leftNavButton = backBtn;
		}
		w.orientationModes = [Titanium.UI.PORTRAIT];
		
		
		var titleBar = he.create('titleBar', {useSwitch: true, top: 0});
		w.add(titleBar); 

		
		// View to hold the buttons
		var switchView = he.create('View', 'switchView');
		
		
		if(platform == 'Android'){
			mapBtn = he.create('Button', {
				title: 'Map',
				borderRadius: 5,
				backgroundColor: he.getPset('switchView').backgroundColor,
				color: '#333333' ,
				height: 30,
				top: 10,
				width: 60,
				right: 20
			});
			titleBar.add(mapBtn);

			if (switchView) switchView.left -= 40;
		}

		mapBtn.addEventListener('click', function() {
			var mapWindow =  he.create('mapWindow', {events: eventsForMap, title: window_title, type: 'stores'});			
			navigationController.open( mapWindow );
		});
		
		mapBtn.addEventListener('touchstart', function() {
			mapBtn.backgroundColor = '#'+styles.get('tileFocusFontColor');
			mapBtn.color = '#'+styles.get('tileBackgroundColor');
		});
		
		mapBtn.addEventListener('touchend', function() {
			mapBtn.backgroundColor = he.getPset('switchView').backgroundColor;
			mapBtn.color = '#333333';
		});				

		// Create and style the buttons
		var azBtn = he.create('Label', 'switchBtn', {text: 'A-Z', right: 0});
		var nearBtn = he.create('Label', 'switchBtn', {
			backgroundImage: directoryPath+'application/assets/images/switchLeftActive.png',
			color: '#'+styles.get('switchActiveText'),
			text: 'Near me',
			left: 0
		});
		// Add button event listeners
		azBtn.addEventListener('click', function() {
			if (currentOrder != 'az') {
				azBtn.backgroundImage = directoryPath+'application/assets/images/switchRightActive.png';
				azBtn.color = he.getPset('switchBtn').activeColor;
				nearBtn.backgroundImage = false;
				nearBtn.backgroundColor = he.getPset('switchView').backgroundColor;
				nearBtn.color = he.getPset('switchBtn').color;
				currentOrder = 'az';
				reOrderResults('az');
			}
		});
		nearBtn.addEventListener('click', function() {
			if (currentOrder != 'nearby') {
				azBtn.backgroundImage = false;
				azBtn.backgroundColor = he.getPset('switchView').backgroundColor;
				azBtn.color = he.getPset('switchBtn').color;
				nearBtn.backgroundImage = directoryPath+'application/assets/images/switchLeftActive.png';
				nearBtn.color = he.getPset('switchBtn').activeColor;
				currentOrder = 'nearby';
				reOrderResults('nearby');
			}
		});
		// Special offers start ordered by store name
		if (args.type == 'special_offers') {
			azBtn.backgroundImage = directoryPath+'application/assets/images/switchRightActive.png';
			azBtn.color = he.getPset('switchBtn').activeColor;
			nearBtn.backgroundImage = false;
			nearBtn.backgroundColor = he.getPset('switchView').backgroundColor;
			nearBtn.color = he.getPset('switchBtn').color;
			currentOrder = 'az';
		}
		// Add the buttons to the view
		switchView.add(azBtn);
		switchView.add(nearBtn);

		titleBar.add(switchView);
		
		if (args.type == 'search') {
			// Add a search bar
			var searchBar = he.create('SearchBar', {top: 50, height: 40, barColor: '#000', hintText: 'Search listings', returnKeyType:Titanium.UI.RETURNKEY_SEARCH});
			w.add(searchBar);
			
			searchBar.addEventListener('return', function(e){
				
				if (platform == 'Android') Ti.UI.Android.hideSoftKeyboard();

				setResults(searchBar.value);
				searchBar.blur();
			});
			tableTop = 90;
			
		} else {
			
			tableTop = 50;
			
		}

		w.add(he.create('adMob', {bottom: 0}));
		
		// Results Table
		var resultsTable = he.create('TableView', 'ResultsTable', {top: tableTop, bottom: 50});
		
		
		resultsTable.addEventListener('click', function(tr){
			// gsm.actInd.show();

			if(args.type == 'special_offers'){
 				var detailsWindow = he.create('DetailWindow', {id: tr.rowData.id, special:true, offer:tr.rowData.offer});				
			} else {
				var detailsWindow = he.create('DetailWindow', {id: tr.rowData.id});
			}
			gsm.current_id = tr.rowData.id;
			navigationController.open( detailsWindow );
		});

		if (args.type == 'search') {
			resultsTable.addEventListener('scroll', function() {
				searchBar.blur();
			});
		}
		

		resultsTable.addEventListener('scroll', function(e) {
			//alert(e);
			
			/*
			 * e.totalItemCount
			 * e.source
			 * e.type
			 * e.firstVisibleItem
			 * e.visibleItemCount
			 * e.size.height
			 * e.size.width
			 * 
			 */
		});
		
		function setResults( keyword ){
			// gsm.actInd.show();
			
			var data = [];
			var assoArray = [];

			if (keyword) {
				var stores = gsm.return_stores_by_keyword(keyword);
				GoogleAnalytics.trackPageView('stores/'+args.type+'/'+args.keyword);
			}
			else if(args.type == 'by_category'){
				var stores = gsm.return_stores(args.id);
				GoogleAnalytics.trackPageView('stores/'+args.type+'/'+args.id);
			}else if(args.type == 'near_me'){
				var stores = gsm.return_stores_near_me();
				GoogleAnalytics.trackPageView('stores/'+args.type);
			}else if(args.type == 'by_keyword'){
				var stores = gsm.return_stores_by_keyword(args.keyword);
				GoogleAnalytics.trackPageView('stores/'+args.type+'/'+args.keyword);
			}else if(args.type == 'whats_hot'){
				var stores = gsm.return_stores_hot();
				GoogleAnalytics.trackPageView('stores/'+args.type);
			} else if(args.type == 'special_offers'){
				var stores = gsm.return_special_offers();
				GoogleAnalytics.trackPageView('stores/'+args.type);
			} else if(args.type == 'events'){
				var stores = gsm.return_stores(58);
				GoogleAnalytics.trackPageView('stores/'+args.type);
			}

			currentResults = [];
			
			try{
				
				var rowAmount = stores.getRowCount();
				if (args.type == 'search' && rowAmount == 0){
					alert("Sorry we were unable to find any results relating to your search. Please try again");
				}
				
			} catch(e){
				
			}

			
			if (stores) {
				
				eventsForMap = [];
				
				while(stores.isValidRow()) {
					
					var distance = (geolib.getDistance({latitude: app.latitude, longitude: app.longitude}, {latitude: stores.fieldByName('latitude'), longitude: stores.fieldByName('longitude')}) * 0.001).toFixed(1);
					
					var row_data = {
						id: stores.fieldByName('store_id'),
						image: stores.fieldByName('logo'),
						title: stores.fieldByName('name'),
						distance: distance,
						lat: stores.fieldByName('latitude'),
						lng: stores.fieldByName('longitude'),
					};

					if (args.type == 'special_offers') {
						data.push( he.create('specialOfferRow', 
						{
							id: stores.fieldByName('store_id'),
							title: stores.fieldByName('name'),
							offer: stores.fieldByName('offer_description'),
							subTitle: '', 
							distance: distance + ' km'
						}));
						row_data.offer = stores.fieldByName('offer_description');
					} else {
						data.push( he.create('directoryRow', 
						{
							id: stores.fieldByName('store_id'),
							title: stores.fieldByName('name'), 
							subTitle: '', 
							distance: distance + ' km'
						}));
					}

					currentResults.push(row_data);
					eventsForMap.push(row_data);
					assoArray.push(stores.fieldByName('store_id'));
					stores.next();
				}

				stores.close();
				stores = null;
				
				gsm.shops_array  = assoArray;

				resultsTable.setData(data);
				
				data = null;
			}

			// gsm.actInd.hide();
		}
		
		w.addEventListener('open', function(){
			setResults();
		});
		
		
		function reOrderResults(/* String */ order) {
			
			// gsm.actInd.show();
			var data = [];

			if (order === 'az') {
				currentResults.sort(app.sortByName);
			} else {
				currentResults.sort(app.sortByDistance);
			}
			
			// Now re-populate the table
			for (var i=0,j=currentResults.length;i<j;i++) {
				var store = currentResults[i];
				
				if (args.type == 'special_offers') {
					data.push( he.create('specialOfferRow', 
					{
						id: store.id,
						title: store.title,
						offer: store.offer_description,
						subTitle: '', 
						distance: store.distance + ' km',
						offer: store.offer
					}));
				} else {
					data.push( he.create('directoryRow', 
					{
						id: store.id,
						title: store.title, 
						subTitle: '', 
						distance: store.distance + ' km'
					}));
				}
			}
			
			resultsTable.setData(data);
			
			data = null;
			tmp_currentResults = null;
			
			// gsm.actInd.hide();
		};
		
		w.add(resultsTable);
		return w;

	});
	
})();
