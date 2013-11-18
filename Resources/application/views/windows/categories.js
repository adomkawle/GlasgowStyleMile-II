(function() {
	he.register('CategoriesWindow', function(args) {

		// Get some defaults
		var activity 	= platform == 'Android' ? Ti.Android.currentActivity : null;
		var win 		= Ti.UI.currentWindow;
		var data = [];
		var currentType = args.type ? args.type : 'lifestyle';

		var windowTitle = 'Select Category';
		if (currentType == 'shopping') {
			windowTitle = 'Shopping';

		} else if (currentType == 'lifestyle') {
			windowTitle = 'Guidebook';

		} else if (currentType == 'food_drink') {
			windowTitle = 'Food & Drink';
		}

		var backBtn = he.create('backBtn');
		// Atanas: The title text should be in white on iOS 7
		var w;
		if( ios7 == true ) {
			w = he.create('Window', {title: windowTitle, navBarHidden: false, leftNavButton: backBtn, layout: '', backgroundColor: '#FFF',  titleControl:  Ti.UI.createLabel({ text: windowTitle, color: 'white' })});
		} else {
			w = he.create('Window', {title: windowTitle, navBarHidden: false, leftNavButton: backBtn, layout: '', backgroundColor: '#FFF'});
		}
		
		w.orientationModes=[Titanium.UI.PORTRAIT];

		backBtn.addEventListener('click', function() {
			w.close();
		});
		
		w.add(he.create('adMob', {bottom: 0}));

		// Results Table
		var resultsTable = he.create('TableView', 'ResultsTable', {zIndex: 100, top: 0, bottom: 50});

		resultsTable.addEventListener('click', function(tr){
			//gsm.actInd.show();
			if (tr.rowData.id == 'shopping') {
				var shoppingWindow = he.create('CategoriesWindow', {type: 'shopping'});
				navigationController.open( shoppingWindow );
			} else {
				var resultsWindow = he.create('ResultsWindow', {id: tr.rowData.id, type: 'by_category'});
				navigationController.open( resultsWindow );
			}
		});

		function showResults(/* String */ type){

			// gsm.actInd.show();

			var categories = gsm.return_categories(type);

			var data = [];

			for(var i=0,j=categories.length;i<j;i++){
				var category = categories[i];
				data.push(he.create('categoryRow', {title: category.name, id: category.id}));
			}
			resultsTable.setData(data);

			try {
				categories.close();
			} catch(e){}


			data = null;

			// gsm.actInd.hide();
		}



		w.add(resultsTable);

		w.addEventListener('open', function(){

			showResults(currentType);

			GoogleAnalytics.trackPageView('categories/'+currentType);
		});

		return w;
	});
})();
