(function() {
	he.register('DetailWindow', function(args) {

		// Get some defaults
		var activity 	= platform == 'Android' ? Ti.Android.currentActivity : null;
		var win = Ti.UI.currentWindow;
		
		var hasOpened = false;
		
		var backBtn = he.create('backBtn');
		
		if( args.hideCycle == true){
			cycleButtons = null;
		} else {
			var cycleButtons = he.create('cycleButton');
		}
		
		var w = he.create('Window', {
			orientationModes: [Titanium.UI.PORTRAIT],
			title: '', backgroundColor: '#FFFFFF',
			navBarHidden: false,
			leftNavButton: backBtn,
			rightNavButton: cycleButtons
		});
		
		// Up down buttons...

		var startingIndex = gsm.current_id;
		if( !args.hideCycle ){
			
			cycleButtons.downarrow.addEventListener('singletap', function(){
				for(var i = 0; i < gsm.shops_array.length; i++){
					if(gsm.current_id ==  gsm.shops_array[i]){
						
						Ti.API.info( 'current index '+ i);
						Ti.API.info(' last index ' +gsm.shops_array.length);
						Ti.API.info('updated');
						var comparsion = i + 1;
						if(gsm.shops_array.length ==  comparsion  ){
							
						}else{
							// var whatsOnDetail = he.create('whatsOnDetail', {id: gsm.whatson_array[i + 1]});
							var detailsWindow = he.create('DetailWindow', {id: gsm.shops_array[i + 1]});
							
							gsm.current_id = gsm.shops_array[i + 1];
							gsm.openedWindows.push(detailsWindow);
							navigationController.open(detailsWindow, true);
						}
						//end the loop
						break;
					};
				}
			});
			cycleButtons.uparrow.addEventListener('singletap', function(){
				for(var i = 0; i < gsm.shops_array.length; i++){
					if(gsm.current_id ==  gsm.shops_array[i]){
						
						Ti.API.info( 'current index '+ i);
						Ti.API.info(' last index ' +gsm.shops_array.length);
						if(0 >= i ){
							
						}else{
							var detailsWindow = he.create('DetailWindow', {id: gsm.shops_array[i - 1]});
							
							// var whatsOnDetail = he.create('whatsOnDetail', {id: gsm.whatson_array[i - 1]});
							gsm.current_id = gsm.shops_array[i - 1];
							gsm.openedWindows.push(detailsWindow);
							navigationController.open(detailsWindow, true);
						}
						//end the loop
						break;
					};
				}
			});
			
		}
		
		// / up down buttons
		if(platform == 'Android' && args.hideCycle == false){
		
			var cycleView = he.create('View', {
				height: 40,
				width: Ti.UI.FILL
			});
	
			cycleView.add( cycleButtons );
			cycleButtons.right = 10;
			
			w.add( cycleView );
		}
		
		
		backBtn.addEventListener('click', function() {
			//mass closing of previous whatson_array;
			if(gsm.openedWindows.length > 0){
				
				for(var i = 0; i < gsm.openedWindows.length; i++){
					// openedWindows[i].close();
					try{
						gsm.openedWindows[i].close();
					} catch (e){
						
					}
				}
				//new blank array
				gsm.openedWindows = new Array();
				gsm.current_id = startingIndex;
			} else {
				w.close();
			}
		});
		
		
		var sv = he.create('ScrollView', {top:0, bottom: 0, layout: 'vertical', scrollType: 'vertical', contentHeight: 'auto', contentWidth: 'auto'});
		
		w.add(sv);
		
		var overview = he.create('View', {layout: 'vertical', height: Ti.UI.SIZE, zIndex: 1000});
		var images = he.create('View', {layout: 'horizontal', height: Ti.UI.SIZE});
		
		renderDetailView();
		
		function renderDetailView() {
			// gsm.actInd.show();
			
			var store = gsm.return_store(args.id);
			var store_images = gsm.return_store_images(args.id);
			var categories = gsm.return_store_categories(args.id);
			
			var category_name = false;
			if (gsm.preferedCategory && categories.length > 1) {
				for (var c = 0; c < categories.length; c++) {
					if (categories[c].id == gsm.preferedCategory) category_name = categories[c].name;
				}
			}
			if (!category_name) category_name = categories.length > 0 ? categories[0].name : store.name;

			GoogleAnalytics.trackPageView('store/'+store.name);
			
			w.title = category_name;
			// Atanas: Window title on iOS 7
			if( ios7 == true ) {
				w.titleControl = Ti.UI.createLabel({ text: category_name, color: 'white' });
			}

			var titleView = he.create('View', {height: Ti.UI.SIZE});
			titleView.add(he.create('Label', 'detailTitle', {text: store.name}));

			var share = he.create('ImageView', {image: directoryPath+'/application/assets/images/facebook_share.png', width: 61, height: 21, right: 15, top: 15});
			titleView.add(share);

			sv.add(titleView);
	
			if (platform == 'Android') {
				share.addEventListener('click', function() {
					var intent = Ti.Android.createIntent({
						action : Ti.Android.ACTION_SEND,
						type : "text/plain"
					});
					
					intent.putExtra(Ti.Android.EXTRA_TEXT, store.name + ' ' + store.website);
					intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
					Ti.Android.currentActivity.startActivity(intent);
				});
			} else {
				share.addEventListener('click', function() {
					facebook(function() {
						Ti.API.info('Sending to facebook... '+store.name+', '+store.website);
						var data = {
							link : w.ticket_url,
							name : w.title
						};
						Titanium.Facebook.dialog("feed", data, function(e) {
							if (e.success && e.result) {
								// alert("Success! New Post ID: " + e.result);
							} else {
								if (e.error) {
									alert('Sorry, there was an error posting to facebook.');
									// alert(e.error);
								} else {
									// alert("User canceled dialog.");
								}
							}
						});
					});
				});
			}

			Ti.API.info(store.logo);

			var leftImage 	= he.create('ImageView', 'detailImage', {image: store.logo});
			if(store_images.length > 0){
				var rightImage 	= he.create('ImageView', 'detailImage', {image: store_images[0].location});
			}
			images.add(leftImage);
			if(store_images.length > 0){
				images.add(rightImage);
			}
			overview.add(images);
	
			var description = he.create('Label', 'detailDescription', {text: store.description + '\n', top: 10});
			overview.add(description);
			
			overview.add(he.create('View', 'detailSeperator'));

			sv.add(overview);
			

			if(args.special){
				var specialoffer = he.create('View', 'contactView', {zIndex: 1001});
				specialoffer.add(he.create('Label', 'detailSubTitle', {text: 'Special Offer'}));
				specialoffer.add(he.create('Label', 'detailDescription', {text: args.offer + '\n'}));
				specialoffer.add(he.create('View', 'detailSeperator'));
				sv.add(specialoffer);
			}

			var contact = he.create('View', 'contactView', {zIndex: 1001});
			contact.add(he.create('Label', 'detailSubTitle', {text: 'Contact'}));

			if (store.phone) {
				var call_title = 'Call: '+store.phone;
				var telButton = he.create('contactButton', {type: 'call', title: call_title});
				telButton.addEventListener('click', function() {
					if (platform == 'Android') {
						var intent = Ti.Android.createIntent({
							action : Ti.Android.ACTION_CALL,
							data : "tel:" + store.phone
						});
		
						Ti.Android.currentActivity.startActivity(intent);
					} else {
						Ti.Platform.openURL('tel:'+store.phone.replace(/[^0-9]/g, ''));
					}
				});
				contact.add(telButton);
			}
			
			if(store.website != null || store.website != ''){
			var webBtn = he.create('contactButton', {type: 'web'});
				webBtn.addEventListener('click', function() {
					if (platform == 'Android') {
						var intent = Ti.Android.createIntent({
							action : Ti.Android.ACTION_VIEW,
							data : store.website
						});
		
						Ti.Android.currentActivity.startActivity(intent);
					} else {
						navigationController.open(openWebBrowser( store.website ));
					}
				});
				contact.add(webBtn);
			}

			var findBtn = he.create('contactButton', {type: 'find'});
			findBtn.addEventListener('click', function() {
				if (platform == 'Android') {
					var intent = Ti.Android.createIntent({
						action : Ti.Android.ACTION_VIEW,
						data: 'geo:0,0?q=' + store.location + ' (' + store.name + ')'
					});
	
					Ti.Android.currentActivity.startActivity(intent);
				} else {
					navigationController.open(openWebBrowser("http://maps.google.com/maps?q="+store.location + ' (' + store.name + ')'));
				}
			});
			contact.add(findBtn);
			
			w.latitude 	= store.latitude;
			w.longitude = store.longitude;
			w.storeName = store.name;
			w.storeid 	= store.id;
			
			app.mapView.region = {
				latitude : store.latitude,
				longitude : store.longitude,
				latitudeDelta : 0.003,
				longitudeDelta : 0.003
			};
			
			app.mapView.width = app.deviceWidth;
			app.mapView.height = 150;
			app.mapView.top = 0;
			app.mapView.removeAllAnnotations();
			app.mapView.regionFit = true;
			app.mapView.touchEnabled = false;
	
			// Atanas:
			if( platform == 'Android' ) {
				app.mapView.addAnnotation(MapModule.createAnnotation({
					latitude:store.latitude,
					longitude:store.longitude,
					title:store.name,
					pincolor:Titanium.Map.ANNOTATION_RED,
					// pinImage: directoryPath+'application/assets/images/map-pin.png',
					animate:true,
					id:store.id // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
				}));
			} else {
				app.mapView.addAnnotation(Titanium.Map.createAnnotation({
					latitude:store.latitude,
					longitude:store.longitude,
					title:store.name,
					pincolor:Titanium.Map.ANNOTATION_RED,
					// pinImage: directoryPath+'application/assets/images/map-pin.png',
					animate:true,
					id:store.id // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
				}));
			}
			
			var mView = he.create('View', {height: 150, width: app.deviceWidth, top: 10, bottom: 20});
			
			w.mView = mView;
 					
			mView.add(app.mapView);
			// contact.add(mView);
			contact.add(mView);
			
			mView.addEventListener('click', function(){
				if (platform == 'Android') {
					var intent = Ti.Android.createIntent({
						action : Ti.Android.ACTION_VIEW,
						data: 'geo:0,0?q=' + store.location + ' (' + store.name + ')'
					});

					Ti.Android.currentActivity.startActivity(intent);

				} else {
					navigationController.open(openWebBrowser("http://maps.google.com/maps?q="+store.location));
				}
			});

			sv.add(contact);

			///////////////////////////////////////////////////////////////

			var nearByView = he.create('View', {width: Ti.UI.FILL, height: Ti.UI.SIZE, layout: 'vertical', bottom: 0});
			
			
			nearByView.add(he.create('Label', 'detailSubTitle', {text: 'Near Me'}));
			
			if(platform == 'Android'){
				var nearbyStores = he.create('ScrollView', {
					contentWidth: 'auto',
					scrollType: 'horizontal',
					height: 115,
					top: args.top ? args.top : 0,
					width: '100%',
					zIndex: 1011,
					backgroundColor: he.getPset('detailSeperator').backgroundColor
				});
			} else {
				var nearbyStores = he.create('ScrollView', {
					layout: 'horizontal',
					contentHeight: 'auto',
					contentWidth: 'auto',
					scrollType: 'horizontal',
					height: 115,
					top: args.top ? args.top : 0,
					width: app.deviceWidth,
					zIndex: 1013,
					backgroundColor: he.getPset('detailSeperator').backgroundColor
				});
			}
			
			var results = gsm.return_nearby_stores(w.storeid, w.latitude, w.longitude);
			
			var data = [];
			
			var boxWidth = app.deviceWidth / 2 - 20;
			var counter = 0;
			var hideCycle = (args.hideCycle) ? true : false;
			
			while(results.isValidRow()) {
				
 				nearbyStores.add(he.create('nearbyStore', {
					id: results.fieldByName('id'),
					name: results.fieldByName('name'),
					hideCycle: hideCycle,
					counter: counter,
					categories: gsm.return_store_categories( results.fieldByName('id') )
					// logo: results.fieldByName('logo'),
				}));
				
				counter++;
				results.next();
			}
	
			results.close();
			
			nearByView.add(nearbyStores);

			contact.add(nearByView);
		}

		w.addEventListener('blur', function(e) {
			try {
				w.mView.remove(app.mapView);
			} catch (error){ }
		});
		
		w.addEventListener('focus', function(e) {
							
			app.mapView.region = {
				latitude: w.latitude,
				longitude: w.longitude,
				latitudeDelta: 0.003,
				longitudeDelta: 0.003
			};

			app.mapView.width 	= app.deviceWidth;
			app.mapView.height  = 150;
			app.mapView.top 	= 0;
			app.mapView.removeAllAnnotations();
			app.mapView.regionFit = true;
			app.mapView.touchEnabled = false;
	
			// Atanas:
			if( platform == 'Android' ) {
				app.mapView.addAnnotation(MapModule.createAnnotation({
					latitude: w.latitude,
					longitude: w.longitude,
					title: w.storeName,
					pincolor: Titanium.Map.ANNOTATION_RED,
					// pinImage: directoryPath+'application/assets/images/map-pin.png',
					animate: true,
					id: w.storeid // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
				}));
			} else {
				app.mapView.addAnnotation(Titanium.Map.createAnnotation({
					latitude: w.latitude,
					longitude: w.longitude,
					title: w.storeName,
					pincolor: Titanium.Map.ANNOTATION_RED,
					// pinImage: directoryPath+'application/assets/images/map-pin.png',
					animate: true,
					id: w.storeid // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
				}));
			}
			
			
			setTimeout(function(){
				w.mView.add( app.mapView );
			}, 500);
			
		});
		
		app.currentWindow = w;
				
		return w;
		
		
	});
})();
