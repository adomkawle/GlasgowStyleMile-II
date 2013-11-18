(function() {
	he.register('whatsOnDetail', function(args) {
				

		// Get some defaults
		var activity 	= platform == 'Android' ? Ti.Android.currentActivity : null;
		var win = Ti.UI.currentWindow;
		
		var backBtn = he.create('backBtn');
		var cycleButtons = he.create('cycleButton');
		var hasOpened = false;
		var startingIndex = gsm.current_id;
		
		
		cycleButtons.downarrow.addEventListener('singletap', function(){
			for(var i = 0; i < gsm.whatson_array.length; i++){
				if(gsm.current_id ==  gsm.whatson_array[i]){
					
					Ti.API.info( 'current index '+ i);
					Ti.API.info(' last index ' +gsm.whatson_array.length);
					Ti.API.info('updated');
					var comparsion = i + 1;
					if( gsm.whatson_array.length ==  comparsion  ){
						
					} else {
						var whatsOnDetail = he.create('whatsOnDetail', {id: gsm.whatson_array[i + 1]});
						gsm.current_id = gsm.whatson_array[i + 1];
						gsm.openedWindows.push(whatsOnDetail);
						navigationController.open(whatsOnDetail, true);
					}
					//end the loop
					break;
				};
			}
		});
		
		cycleButtons.uparrow.addEventListener('singletap', function(){
			for(var i = 0; i < gsm.whatson_array.length; i++){
				if(gsm.current_id ==  gsm.whatson_array[i]){
					
					Ti.API.info( 'current index '+ i);
					Ti.API.info(' last index ' +gsm.whatson_array.length);
					if(0 >=  i  ){
						
					}else{
						var whatsOnDetail = he.create('whatsOnDetail', {id: gsm.whatson_array[i - 1] , left:0});
						gsm.current_id = gsm.whatson_array[i - 1];
						gsm.openedWindows.push(whatsOnDetail);
						navigationController.open(whatsOnDetail, true);
					}
					//end the loop
					break;
				};
			}
		});


		if (platform == 'Android'){
			var w = he.create('Window', { backgroundColor:'#ffffff', orientationModes:[Titanium.UI.PORTRAIT], title: '', layout:'vertical', navBarHidden: false });
		} else {
			var w = he.create('Window', { backgroundColor:'#ffffff', orientationModes:[Titanium.UI.PORTRAIT], title: '', layout:'vertical', navBarHidden: false, leftNavButton: backBtn, rightNavButton: cycleButtons});
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
		
		
		if(platform == 'Android'){
		
		var cycleView = he.create('View', {
				height: 40,
				width: Ti.UI.FILL
			});
		
			cycleView.add( cycleButtons );
			cycleButtons.right = 10;
			
			w.add( cycleView );
		}

		
		var sv = he.create('ScrollView', {
			top : 0,
		    left : 0,
		    contentWidth : 'auto',
		    contentHeight : 'auto',
		    showVerticalScrollIndicator : true,
		    layout : 'vertical'});
		    
		w.add(sv);
		w.sv = sv;
		 
		var overview = he.create('View', {layout: 'vertical', height: Ti.UI.SIZE});
			
		var images = he.create('View', {layout: 'horizontal', height: Ti.UI.SIZE});
		
		if( platform != 'Android'){
			var calendar = require('com.gs.calendar');
		}
		
		renderDetailView();
		function addToCalendar (/* Date */ theDate){
			
			
			if ( platform != 'Android' ){
				
				
				var startDate = new Date(theDate);					// event should start now
				var endDate = new Date(theDate);
				// endDate.setHours(startDate.getHours() + 12);	// and end two hours from now
				
			    // create and show the event dialog
			    var eventDialog = calendar.createEventDialog({
			        eventTitle: w.title,	// optional
			        eventStartDate:startDate,	// optional
			        eventEndDate:endDate,		// optional
			        eventLocation:"",	// optional
			        eventNotes:"",	// optional
			        
			        eventAllDay:true,			// optional - can set to true for all day events
			        
			        animated:true,				// optional - default is true
					barColor:"#000"				// optional - sets the navbar color
			    });
				
				eventDialog.open();
				
			} else {
				
				var optionsData = [], options = [];
				
				// TODO: Need an iOS alternative to this!
	
				var calendars = Ti.Android.Calendar.selectableCalendars;
				
				for (var i = 0; i < calendars.length; i++) {
					Ti.API.info(calendars[i].id + " " + JSON.stringify(calendars[i]));
					optionsData.push({title: calendars[i].name, id: calendars[i].id});
					options.push(calendars[i].name);
				}
				
				var dialog = Titanium.UI.createOptionDialog({
					title: 'Which calendar?',
					options: options,
					cancel:1
				});
				
				dialog.show();
				dialog.addEventListener('click', function(s){
					
					// var eventBegins = new Date(2011, 10, 22, 12, 0, 0);
					// var eventEnds = new Date(2011, 10, 22, 14, 0, 0);
					var calendar = Ti.Android.Calendar.getCalendarById(optionsData[s.index].id);
					
					
					var details = {
						title : w.title,
						begin : theDate,
						end : theDate,
						description: '',
						allDay: true,
						hasAlarm : false
					};
					
					try{
						var evt = calendar.createEvent(details);
						alert('This has been added to your calendar');
					} catch(e){
						
					}
					
				});
			}
		}
		
		
		function renderDetailView(){
 			//var store = gsm.return_store(args.id);
			//var store_images = gsm.return_store_images(args.id);

			var result = gsm.return_event(args.id);
						
			while(result.isValidRow()) {
				
				var locations = result.fieldByName('location').split(',');
			
				w.title 		= result.fieldByName('name');
				w.storeName 	= w.title;
			    w.storeid    	= result.fieldByName('id');
				w.start_date 	= result.fieldByName('start_date');
				w.location 		= result.fieldByName('location');
				w.latitude		= result.fieldByName('latitude');
				w.longitude 	= result.fieldByName('longitude');
				w.ticket_url 	= result.fieldByName('ticket_url');
				w.telephone 	= result.fieldByName('telephone');
				
				// Atanas: The title label should be in white on iOS 7
				if( ios7 == true ) {
					w.titleControl  = Ti.UI.createLabel({ text: w.title, color: 'white' });
				}

				var titleView = he.create('View', {height: Ti.UI.SIZE});
				titleView.add(he.create('Label', 'detailTitle', {text: result.fieldByName('name')}));

				var share = he.create('ImageView', {image: '/application/assets/images/facebook_share.png', width: 61, height: 21, right: 15, top: 15});
				titleView.add(share);

				sv.add(titleView);

				GoogleAnalytics.trackPageView('whats_on/detail/'+w.title);
				
				
				var dates = he.create('Label', 'detailDescription', {text: date('D M jS Y', strtotime(result.fieldByName('start_date'))) + ' - ' + date('D M jS Y', strtotime(result.fieldByName('end_date'))), top: 10});
				try {
					if (result.fieldByName('ticket_prices')) {
						var prices = he.create('Label', 'detailDescription', {text: result.fieldByName('ticket_prices') + '\n', top: 10});
					} else {
						var prices = false;
					}
				} catch(e){}
				
				try {
					var description = he.create('Label', 'detailDescription', {text: result.fieldByName('description') + '\n', top: 10});
				} catch(e){}
				

				if (platform == 'Android') {
					share.addEventListener('click', function() {
						
						var intent = Ti.Android.createIntent({
							action : Ti.Android.ACTION_SEND,
							type : "text/plain"
						});
						
						intent.putExtra(Ti.Android.EXTRA_TEXT, w.title + ' ' + w.ticket_url);
						intent.addCategory(Ti.Android.CATEGORY_DEFAULT);
						Ti.Android.currentActivity.startActivity(intent);
						
					});
				} else {
					share.addEventListener('click', function() {
						facebook(function() {
							Ti.API.info('Sending to facebook... '+w.title+', '+w.ticket_url);
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
				
				
				
				overview.add(dates);
				if (prices) overview.add(prices);
				overview.add(description);
				// overview.add(additional_details);
						
				sv.add(overview);
				
				
				sv.add(he.create('View', 'detailSeperator'));

				sv.add(he.create('Label', 'detailSubTitle', {text: 'Contact'}));

				if (w.telephone) {
					var telButton = he.create('contactButton', {type: 'call'});
					telButton.addEventListener('click', function() {
						if (platform == 'Android') {
							var intent = Ti.Android.createIntent({
								action : Ti.Android.ACTION_CALL,
								data : "tel:" + w.telephone
							});
			
							Ti.Android.currentActivity.startActivity(intent);
						} else {
							Ti.Platform.openURL('tel:'+w.telephone.replace(/[^0-9]/g, ''));
						}
					});
					sv.add(telButton);
				}

				if (w.ticket_url) {
					var webBtn = he.create('contactButton', {type: 'web'});
					webBtn.addEventListener('click', function() {
						if (platform == 'Android') {
							var intent = Ti.Android.createIntent({
								action : Ti.Android.ACTION_VIEW,
								data : w.ticket_url
							});
			
							Ti.Android.currentActivity.startActivity(intent);
						} else {
							navigationController.open(openWebBrowser( w.ticket_url ));
						}
					});
					sv.add(webBtn);
				}

				var distance = (geolib.getDistance({latitude: app.latitude, longitude: app.longitude}, {latitude: result.fieldByName('latitude'), longitude: result.fieldByName('longitude')}) * 0.001).toFixed(1);
				var address = 'You are ' + distance + "km away.\n" + result.fieldByName('address') + ',\n' + result.fieldByName('town') + ', ' + result.fieldByName('postcode');
				var findBtn = he.create('contactButton', {type: 'find', overrideHeight: Ti.UI.SIZE, extra: he.create('Label', 'contactExtra', {text: address})});

				findBtn.addEventListener('click', function() {
					if (platform == 'Android') {
						var intent = Ti.Android.createIntent({
							action : Ti.Android.ACTION_VIEW,
							data: 'geo:0,0?q=' + w.location + ' (' + w.title + ')'
						});
		
						Ti.Android.currentActivity.startActivity(intent);
					} else {
						navigationController.open(openWebBrowser("http://maps.google.com/maps?q="+w.location + ' (' + w.title + ')' ));
					}
				});
				sv.add(findBtn);

				/*
				var contact = he.create('View', 'ContactView', {zIndex: 1001, height: Ti.UI.SIZE, width: Ti.UI.SIZE});
				
				var titleView = he.create('View', {top: 0, backgroundColor: '#FFF', height: Ti.UI.SIZE, width: Ti.UI.SIZE});
				titleView.add(he.create('ImageView', {image: '/application/assets/images/black_tab.png', width: Ti.Platform.displayCaps.platformWidth , height: Ti.UI.SIZE, left: 0, top: 0, bottom: 0}));
				titleView.add(he.create('Label', 'tabViewLabel', {text: 'contact'}));
				contact.add(titleView);
				// Add table view with contact options
				
				var contactTable = he.create('TableView', {height: 185, top: 20, left: 15, right: 15, borderRadius: 5,borderWidth: 1, borderColor: '#999', backgroundColor: '#FFF'});
				
				var data = [];
				
				// TODO: Calculate distance correctly
				try {
					if(result.fieldByName('telephone') !== ''){
						data.push(he.create('contactRow', {type: 'phone', leftTitle: 'call', rightTitle: result.fieldByName('telephone'), hasChild: true}));
					}
					if(result.fieldByName('ticket_url') !== ''){
						data.push(he.create('contactRow', {type: 'website', leftTitle: 'tickets', rightTitle: result.fieldByName('ticket_url'), hasChild: true}));
					}
				} catch(e) {}
				
				
				
				var distance = (geolib.getDistance({latitude: app.latitude, longitude: app.longitude}, {latitude: result.fieldByName('latitude'), longitude: result.fieldByName('longitude')}) * 0.001).toFixed(1);

				data.push(he.create('contactRow', {type: 'map', leftTitle: 'visit', rightTitle: 'you are ' + distance + 'km away', rightTitleMore: result.fieldByName('address') + '\n' + result.fieldByName('town') + '\n' + result.fieldByName('postcode'), hasChild: true}));
				
				contactTable.setData(data);
				
				
				contactTable.addEventListener('click', function(tr) {
					if(tr.rowData.type == 'phone') {
						if(w.telephone.length > 5){
							var intent = Ti.Android.createIntent({
								action : Ti.Android.ACTION_CALL,
								data : "tel:" + w.telephone
							});
			
							Ti.Android.currentActivity.startActivity(intent);
						}
					} else if(tr.rowData.type == 'website') {
						if(w.ticket_url.length > 5){
							var intent = Ti.Android.createIntent({
								action : Ti.Android.ACTION_VIEW,
								data : w.ticket_url
							});
		
							Ti.Android.currentActivity.startActivity(intent);
						}
					} else if(tr.rowData.type == 'map') {
						var intent = Ti.Android.createIntent({
							action : Ti.Android.ACTION_VIEW,
							data: 'geo:0,0?q=' + w.location + ' (' + w.title + ')'
						});
		
						Ti.Android.currentActivity.startActivity(intent);
					}
				});
		
				contact.add(contactTable);
				*/
				
				
				// app.mapView.startLayout();
				app.mapView.region = {
					latitude : locations[0].replace(" ",""),
					longitude : locations[1].replace(" ",""),
					latitudeDelta : 0.005,
					longitudeDelta : 0.005
				};
				app.mapView.width = app.deviceWidth;
				app.mapView.height = 150;
				app.mapView.top = 10;
				app.mapView.removeAllAnnotations();
				app.mapView.regionFit = true;
				app.mapView.touchEnabled = false;
	
				// Atanas:
				if( platform == 'Android' ) {
						app.mapView.addAnnotation(MapModule.createAnnotation({
						latitude:locations[0].replace(" ",""),
						longitude:locations[1].replace(" ",""),
						title:result.fieldByName('name'),
						pincolor:Titanium.Map.ANNOTATION_RED,
						pinImage: '/application/assets/images/map-pin.png',
						animate: false,
						id:result.fieldByName('id') // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
					}));				
				} else {
					app.mapView.addAnnotation(Titanium.Map.createAnnotation({
						latitude:locations[0].replace(" ",""),
						longitude:locations[1].replace(" ",""),
						title:result.fieldByName('name'),
						pincolor:Titanium.Map.ANNOTATION_RED,
						pinImage: '/application/assets/images/map-pin.png',
						animate: false,
						id:result.fieldByName('id') // CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS
					}));
				}

				var mView = he.create('View', {height: 150, width: app.deviceWidth, top: 10, bottom: 20});
				mView.add(app.mapView);
				// contact.add(mView);
				sv.add(mView);
				w.mView = mView;
				// app.mapView.finishLayout();
				
				mView.addEventListener('click', function(){
					if (platform == 'Android') {
						var intent = Ti.Android.createIntent({
							action : Ti.Android.ACTION_VIEW,
							data: 'geo:0,0?q=' + w.location + ' (' + w.title + ')'
						});
		
						Ti.Android.currentActivity.startActivity(intent);
					} else {
						navigationController.open(openWebBrowser("http://maps.google.com/maps?q="+w.location + ' (' + w.title + ')' ));
					}
				});
				
				
				
				var resultss = gsm.return_performances(args.id);
				
				var performancesTableHeight = 0 + (resultss.getRowCount() * 50);

				if (result.getRowCount() > 0) {
					
					// sv.add(he.create('Label', 'tabViewLabelInstructions', {text: 'click to add to calendar'}));
					// sv.add(titleViewPerformances);
					
					// var performancesTable = he.create('TableView', {touchEnabled: true, scrollable: true, top: 10, height: performancesTableHeight, width: Ti.UI.FILL, backgroundColor: '#FFF', color: '#F30'});
					var data = [];
					 								
					// var performancesTable = he.create('TableView', {touchEnabled: true, scrollable: true, top: 10, height: Ti.UI.SIZE, width: Ti.UI.FILL, backgroundColor: '#FFF', color: '#F30'});
					// var data = [];
//
					while (resultss.isValidRow()) {
						
						var jsdate = new Date(date('F j, Y H:i:s', strtotime(resultss.fieldByName('date_time'))));
						data.push( Ti.UI.createPickerRow( {title: date('D M jS Y H:i', strtotime(resultss.fieldByName('date_time'))), jsDate: jsdate, id: resultss.fieldByName('id')}  ));
						// data.push({title: date('D M jS Y H:i', strtotime(resultss.fieldByName('date_time'))), jsDate: jsdate, id: resultss.fieldByName('id'), color: '#F30'});

						resultss.next();
					}
					
					// performancesTable.setData(data);
					resultss.close();
					
					// performancesTable.addEventListener('click', function(e){
						// addToCalendar(e.rowData.jsDate);
					// });

					
					if (data.length > 0) {
						sv.add(he.create('View', 'detailSeperator'));
						sv.add(he.create('Label', 'detailSubTitle', {text: 'Performances'}));

						var addToCalander = he.create('contactButton', {text: 'Add to Calendar', type: 'noicon', top: 10, noarrow: true});
						
						var peformancePicker = Titanium.UI.createPicker({selectionIndicator: true});
						peformancePicker.add(data);
						
						addToCalander.addEventListener('singletap', function(e){
							
							var selectedRow = peformancePicker.getSelectedRow(0);
	  						addToCalendar(selectedRow.jsDate);
	  						
						});
					
						sv.add(peformancePicker);
						sv.add(addToCalander);
					}
				}
				
				try {
					resultss.close();
					resultss = null;
				} catch(e) {}
				
				if (result.fieldByName('ticket_prices')) {
					sv.add(he.create('Label', 'detailDescription', {text: 'Ticket price: ' + result.fieldByName('ticket_prices') + '\n', color: '#000',  top: 10}));
				}
				
				// var titleViewNearby = he.create('View', {top: 5, zIndex: 1010, backgroundColor: '#000', height: Ti.UI.SIZE});
				// titleViewNearby.add(he.create('ImageView', {image: '/application/assets/images/black_tab.png', width: Ti.UI.FILL , height: Ti.UI.SIZE, left: 0, top: 0, bottom: 0}));
				// titleViewNearby.add(he.create('Label', 'tabViewLabel', {text: 'bars', height: Ti.UI.SIZE}));
				// sv.add(titleViewNearby);


				sv.add(he.create('Label', 'detailHeader', {text: 'Nearby meeting points'}) );
				sv.add(he.create('View' , 'devider' , {bottom:10}) );

				var barsView = he.create('View', {layout: 'vertical', height: Ti.UI.SIZE});
				barsView.add(he.create('Label', 'detailSubTitle', {text: 'Bars'}));
				
				if(platform == 'Android'){
					var nearbyStores = he.create('ScrollView', {
						contentWidth: 'auto',
						scrollType: 'horizontal',
						height: 115,
						width: '100%',
						zIndex: 1011,
						backgroundColor: he.getPset('detailSeperator').backgroundColor,
						top: 0
					});
				} else {
					var nearbyStores = he.create('ScrollView', {
						layout: 'horizontal',
						contentHeight: 'auto',
						contentWidth: 'auto',
						scrollType: 'horizontal',
						height: 115,
						width: app.deviceWidth,
						zIndex: 1013,
						backgroundColor: he.getPset('detailSeperator').backgroundColor,
						top: 0
					});
				}
				
				var results = gsm.return_nearby_stores_by_category(78, w.latitude, w.longitude);
				var boxWidth = app.deviceWidth / 2 - 20;
				
				var counter = 0;
				while (results.isValidRow()) {
					
					
					nearbyStores.add(he.create('nearbyStore', {
						counter: counter,
						id: results.fieldByName('store_id'),
						name: results.fieldByName('name'),
						type: 'whats_on',
						categories: gsm.return_store_categories( results.fieldByName('store_id') )
						// logo: results.fieldByName('logo'),
					}));
								
					results.next();
					counter++;
				}
				
				results.close();
				results = null;
				
				barsView.add(nearbyStores);
				sv.add(barsView);
				
				// var titleViewNearby = he.create('View', {top: 5, zIndex: 1012, backgroundColor: '#000', height: Ti.UI.SIZE});
				// titleViewNearby.add(he.create('ImageView', {image: '/application/assets/images/black_tab.png', width: Ti.UI.FILL , height: Ti.UI.SIZE, left: 0, top: 0, bottom: 0}));
				// titleViewNearby.add(he.create('Label', 'tabViewLabel', {text: 'restaurants', height: Ti.UI.SIZE}));
				// sv.add(titleViewNearby);

				sv.add(he.create('View', 'detailSeperator', {backgroundColor: 'transparent', bottom: 2 }));
				
				var restaurantView = he.create('View', {layout: 'vertical', height: Ti.UI.SIZE});
				restaurantView.add(he.create('Label', 'detailSubTitle', {text: 'Restaurants' }));
				
				if (platform == 'Android') {
					var nearbyStores_rs = he.create('ScrollView', {
						contentWidth: 'auto',
						scrollType: 'horizontal',
						height: 115,
						width: '100%',
						zIndex: 1011,
						backgroundColor: he.getPset('detailSeperator').backgroundColor,
						top: 0
					});
				} else {
					var nearbyStores_rs = he.create('ScrollView', {
						layout: 'horizontal',
						contentHeight: 'auto',
						contentWidth: 'auto',
						scrollType: 'horizontal',
						height: 115,
						width: app.deviceWidth,
						zIndex: 1013,
						backgroundColor: he.getPset('detailSeperator').backgroundColor,
						top: 0
					});
				}
				
				var results = gsm.return_nearby_stores_by_category(80, w.latitude, w.longitude);
				var boxWidth = app.deviceWidth / 2 - 20;
				var counter = 0;
				
				while (results.isValidRow()) {
					
					nearbyStores_rs.add(he.create('nearbyStore', {
						id: results.fieldByName('store_id'),
						counter : counter,
						name: results.fieldByName('name'),
						type: 'whats_on',
						categories: gsm.return_store_categories( results.fieldByName('store_id') )
						// logo: results.fieldByName('logo'),
					}));
								
					counter++;
					results.next();
				}
				
				results.close();
				results = null;
				
				
				restaurantView.add(nearbyStores_rs);
				sv.add(restaurantView);
			   
			   result.next();
		   }
		   
		   result.close();
		   result = null;
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
			}, 500)
			
		});
		
		app.currentWindow = w;
		return w;
				
		
	});
})();
