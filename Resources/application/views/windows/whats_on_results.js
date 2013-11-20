(function() {
	he.register('whatsOnResults', function(args) {
				
		// Get some defaults
		var activity 	= platform == 'Android' ? Ti.Android.currentActivity : null;
		var win 		= Ti.UI.currentWindow;
		var isAndroid 	= Ti.Platform.osname === 'android';
		var currentResults = [];
		var currentOrder = 'distance';
		
		var windowTitle;

		var eventsForMap = [];

		if (args.type === 'by_keyword') {
			windowTitle = 'Searching for ' + args.keyword;
		} else {
			var type_names = {
				music:		'Music',
				comedy:		'Comedy',
				days_out:	'Days Out',
				visual_art:	'Visual Art',
				theatre:	'Theatre',
				family:		'Family',
				cinema:		'Cinema',
				sport:		'Sport',
				clubs:		'Clubs',
				lgbt:		'LGBT',
				talks:		'Talks',
				books:		'Books',
				everything:	'Everything',
				all:	'Everything'
			};
			
			windowTitle = 'What\'s On - ' + type_names[args.type];
		}
		
		var backBtn = he.create('backBtn');
		var mapBtn = he.create('Button', {
			backgroundImage: directoryPath+'application/assets/images/map.png',
			width: 61,
			height: 29
		});
		// Atanas: Window title on iOS 7
		var w;
		if( ios7 == true ) {
			w = he.create('Window', {title: windowTitle, navBarHidden: false, leftNavButton: backBtn, rightNavButton: mapBtn, layout: 'vertical', backgroundColor: '#fff', titleControl:  Ti.UI.createLabel({ text: windowTitle, color: 'white' })});
		} else {
			w = he.create('Window', {title: windowTitle, navBarHidden: false, leftNavButton: backBtn, rightNavButton: mapBtn, layout: 'vertical', backgroundColor: '#fff'});
		}	
		w.orientationModes=[Titanium.UI.PORTRAIT];
		backBtn.addEventListener('click', function() {
			w.close();
		});
		
		mapBtn.addEventListener('click', function() {
			var mapWindow = he.create('mapWindow', {events: eventsForMap, title: windowTitle, type: 'whats_on'});
			navigationController.open( mapWindow );
		});
				
 
		w.addEventListener('open', function() {
			GoogleAnalytics.trackPageView('whats_on/results');

			if (args.type === 'by_keyword') {
				setResultsTableKeyword(args.keyword);	
			} else {
				Ti.App.Properties.setBool("OPEN", true);
				setResultsTable('all');	
			}
			
		});
		
		var titleBar = he.create('titleBar', {useSwitch: true, top: 0, height: 50});
		w.add(titleBar); 

		// View to hold the buttons
		var switchView = he.create('View', 'switchView');
		// Create and style the buttons
		var azBtn = he.create('Label', 'switchBtn', {text: 'A-Z', right: 0});
		var nearBtn = he.create('Label', 'switchBtn', {
			backgroundImage: directoryPath+'application/assets/images/switchLeftActive.png',
			color: '#'+styles.get('switchActiveText'),
			text: 'Near me',
			left: 0
		});
		
		var dPick = false;
		
		// Add button event listeners
		azBtn.addEventListener('click', function() {
			if (currentOrder != 'az') {
				azBtn.backgroundImage = directoryPath+'application/assets/images/switchRightActive.png';
				azBtn.color = '#FF3300';
				nearBtn.backgroundImage = false;
				nearBtn.color = '#999999';
				currentOrder = 'az';
				reOrderResults('az');
			}
		});
		nearBtn.addEventListener('click', function() {
			if (currentOrder != 'nearby') {
				azBtn.backgroundImage = false;
				azBtn.color = '#999999';
				nearBtn.backgroundImage = directoryPath+'application/assets/images/switchLeftActive.png';
				nearBtn.color = '#FF3300';
				currentOrder = 'nearby';
				reOrderResults('nearby');
			}
		});
		// Add the buttons to the view
		switchView.add(azBtn);
		switchView.add(nearBtn);
		titleBar.add(switchView);
		

		var datePickerView = he.create('View', {backgroundColor: '#fff', width: Ti.UI.FILL, height:(Ti.Platform.osname == "android" ) ? "60dp" : '220', zIndex: 100, top: 0});
		
		var addToCalander = he.create('contactButton', {text: 'Choose Date', type: 'noicon', top: 10, noarrow: true,textleft: 85});
		w.add(addToCalander);					
		var datePicker = he.create('Picker', {/*columns: 1, */zIndex: 100, selectionIndicator: true, left: 0, right: 0, top:0, bottom:0, width:Ti.UI.FILL});
		
		var data = [];

		data.push(he.create('PickerRow', {title: 'All Dates', date: 'all'}));
		data.push(he.create('PickerRow', {title: 'Today - ' + date('jS'), date:date('Y-m-d')}));
		
		for(var i=1,j=14;i<j;i++) {
			data.push(he.create('PickerRow', {date: date('Y-m-d', strtotime('+' + i + ' days')),title: date('l - jS M', strtotime('+' + i + ' days'))}));
		}
		
		datePicker.add(data);
		datePickerView.add(datePicker);
		
		
		var dateData = '';
		datePicker.addEventListener('change', function(e) {			
			resultsTable.setData([]);
			dateData = e.row.date;
			//alert('***date selected: '+dateData);
			dPick = true;
			// setResultsTable(e.row.date);
		});
		
		var close_btn = he.create('contactButton', {text: 'Pick Date', top: 20, type: 'noicon', noarrow: true, textleft: 95});		
		var ModalWindow = Ti.UI.createWindow({backgroundColor:'#fff', title: 'Choose Date', layout:'vertical'});
		ModalWindow.add(datePickerView);
		ModalWindow.add(close_btn);
		
		close_btn.addEventListener('singletap', function(){
			ModalWindow.close();
			setTimeout(function(){
				resultsTable.setData([]);
				Ti.App.Properties.setBool("OPEN", false);
				setResultsTable(dateData);
			}, 300);
		});
		addToCalander.addEventListener('singletap', function(){
			
			 ModalWindow.open({modal:true});
			 dPick = false;
		});
			//
		
		// w.add(datePickerView);
		
		var resultsTable = he.create('TableView', 'ResultsTable', { zIndex: 110, bottom: 0, height: 'auto', width: 'auto'});
		var data = [];
		var assoData = [];
		
		resultsTable.addEventListener('click', function(e) {
			Ti.API.info('The ID was: ' + e.rowData.id);
			var whatsOnDetail = he.create('whatsOnDetail', {id: e.rowData.id});
			 			
			setTimeout(function(){
				navigationController.open( whatsOnDetail );
			}, 100);
			
			gsm.current_id = e.rowData.id;
		});
		
		
		// var noCurrentResults  = he.create('Label', {
			// font :{
				// fontSize: 20,
				// fontFamily: bodyFont
			// },
			// color : '#000000',
			// text : 'Unable to find any events for your requested date',
			// top: 50
		// });
// 		
		
		
		function setResultsTable(/* String */ theDate) {
			
			var ACT_DATE = theDate;
			
			gsm.actInd.show();
			
			if (theDate == '' || theDate == undefined || dPick == false){
 				theDate = 'all';
 				ACT_DATE = 'all';
			}
			
			theDate = 'all';
				
			var events = gsm.return_events(theDate , args.id, 0), dates = '', data = [];
			
			currentResults = [];
			data = [];
			eventsForMap = [];
			assoData = [];
				


			var count = events.rowCount;
			
			
			// no results returned add an label. 			
			if (count == 0){
				alert("Unable to find any events for your requested date");
			} else {
				
				try{
				} catch(e) {
					
				}
			}
			
			
			var ACT_DATE_Arr = ACT_DATE.split('-');
			
			var ACT_DATE_CMP = ACT_DATE_Arr[0]+"-"+ACT_DATE_Arr[2]+"-"+ACT_DATE_Arr[1];
			
		
		var FLAG = Ti.App.Properties.getBool("OPEN");
		
		if(FLAG || ACT_DATE == 'all'){
				
			while (events.isValidRow()) {

				var END_DATE = events.fieldByName('end_date').split(" ")[0];
				var END_DATE_Arr = END_DATE.split('-');

				var END_DATE_CMP = END_DATE_Arr[0] + "-" + END_DATE_Arr[2] + "-" + END_DATE_Arr[1];

				//if (ACT_DATE_CMP == events.fieldByName('start_date').split(" ")[0] && ACT_DATE_CMP == END_DATE_CMP) {

				dates = date('D M jS Y', strtotime(events.fieldByName('start_date'))) + ' - ' + date('D M jS Y', strtotime(events.fieldByName('end_date')));
				var distance = (geolib.getDistance({
					latitude : app.latitude,
					longitude : app.longitude
				}, {
					latitude : events.fieldByName('latitude'),
					longitude : events.fieldByName('longitude')
				}) * 0.001).toFixed(1);

				currentResults.push({
					distance : distance,
					title : events.fieldByName('name'),
					dates : dates,
					prices : events.fieldByName('ticket_prices'),
					venue : events.fieldByName('venue_name'),
					id : events.fieldByName('event_id')
				});

				assoData.push(events.fieldByName('event_id'));
				eventsForMap.push({
					title : events.fieldByName('name'),
					id : events.fieldByName('event_id'),
					lat : events.fieldByName('latitude'),
					lng : events.fieldByName('longitude')
				});

				data.push(he.create('eventsRow', {
					distance : distance + 'km',
					title : events.fieldByName('name'),
					dates : dates,
					prices : events.fieldByName('ticket_prices'),
					venue : events.fieldByName('venue_name'),
					id : events.fieldByName('event_id'),
					hasChild : true
				}));
				// }else{
				// Ti.API.info("Unable to find any events for your requested date");
				// }
				events.next();
			}
			
			events.close();
		}else{
				while (events.isValidRow()) {
				
				var END_DATE = events.fieldByName('end_date').split(" ")[0];
				var END_DATE_Arr = END_DATE.split('-');
				
				var END_DATE_CMP = END_DATE_Arr[0]+"-"+END_DATE_Arr[2]+"-"+END_DATE_Arr[1];
				Ti.API.info('CONDITION');
					
				if (ACT_DATE_CMP == events.fieldByName('start_date').split(" ")[0]) { //&& ACT_DATE_CMP == END_DATE_CMP) {
					
					currentResults.length = 0;
					data.length = 0;
					eventsForMap.length = 0;
					assoData.length = 0; 

					
					Ti.API.info('CONDITION');
					
					dates = date('D M jS Y', strtotime(events.fieldByName('start_date'))) + ' - ' + date('D M jS Y', strtotime(events.fieldByName('end_date')));
					var distance = (geolib.getDistance({
						latitude : app.latitude,
						longitude : app.longitude
					}, {
						latitude : events.fieldByName('latitude'),
						longitude : events.fieldByName('longitude')
					}) * 0.001).toFixed(1);

					currentResults.push({
						distance : distance,
						title : events.fieldByName('name'),
						dates : dates,
						prices : events.fieldByName('ticket_prices'),
						venue : events.fieldByName('venue_name'),
						id : events.fieldByName('event_id')
					});

					assoData.push(events.fieldByName('event_id'));
					eventsForMap.push({
						title : events.fieldByName('name'),
						id : events.fieldByName('event_id'),
						lat : events.fieldByName('latitude'),
						lng : events.fieldByName('longitude')
					});

					data.push(he.create('eventsRow', {
						distance : distance + 'km',
						title : events.fieldByName('name'),
						dates : dates,
						prices : events.fieldByName('ticket_prices'),
						venue : events.fieldByName('venue_name'),
						id : events.fieldByName('event_id'),
						hasChild : true
					}));
				}else{
					Ti.API.info("Unable to find any events for your requested date");
				}
					events.next();
			}

			events.close();
		}
	
		
						
			gsm.categoryLength = data.length;
			gsm.whatson_array  = assoData;
		
			events = null;
			resultsTable.setData(data);
			
			gsm.actInd.hide();
		};

		
		function setResultsTableKeyword(/* String */ keyword){
			gsm.actInd.show();
			
			//resultsTable.setData([]);
			var events = gsm.return_events_by_keyword(keyword), dates = '', data = [];
			var i = '0';
			
			while(events.isValidRow()) {
				i++;
				dates = date('D M jS Y', strtotime(events.fieldByName('start_date'))) + ' - ' + date('D M jS Y', strtotime(events.fieldByName('end_date')));
				var distance = (geolib.getDistance({latitude: app.latitude, longitude: app.longitude}, {latitude: events.fieldByName('latitude'), longitude: events.fieldByName('longitude')}) * 0.001).toFixed(1);
				currentResults.push({distance: distance, title: events.fieldByName('name'), dates: dates, prices: events.fieldByName('ticket_prices'), venue: events.fieldByName('venue_name'), id: events.fieldByName('event_id')});
				data.push(he.create('eventsRow', {distance: distance + 'km', title: events.fieldByName('name'), dates: dates, prices: events.fieldByName('ticket_prices'), venue: events.fieldByName('venue_name'), id: events.fieldByName('event_id'), hasChild: true}));
				events.next();
			}
			// rows.getRowCount()
	
			events.close();
			events = null;
			resultsTable.setData(data);
			
			gsm.actInd.hide();
			// 	check to see if it actually worth while displaying this page if not close this window so it goes back to the starting.
			if (i == 0 )
			{
				setTimeout(function(){
					w.close();
					alert("Sorry we were unable to find any results relating to your search. Please try again")	;
				}, 501);
			}
		};
		
		function reOrderResults(/* String */ order) {
			
			gsm.actInd.show();
			
			
			var data = [];
			if (order === 'az') {
				currentResults.sort(app.sortByName);
			} else {
				currentResults.sort(app.sortByDistance);
			}
			
			// Now re-populate the table
			for(var i=0,j=currentResults.length;i<j;i++) {
				var event = currentResults[i];
				data.push(he.create('eventsRow', {distance: event.distance + 'km', title: event.title, dates: event.dates, prices: event.prices, venue: event.venue, id: event.id, hasChild: true}));
			}
			
			resultsTable.setData(data);
			
			data = null;
			
			gsm.actInd.hide();
			
		};

		w.add(resultsTable); 
	   
		return w;
	});
})();

 
