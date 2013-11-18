(function() {
	he.register('androidMenu', function(args) {

		var menu = Titanium.UI.Android.OptionMenu.createMenu();


		var item1 = Titanium.UI.Android.OptionMenu.createMenuItem({
			title : 'Item 1',
			icon : '/images/item1.png'
		});

		item1.addEventListener('click', function() {
			Ti.UI.createAlertDialog({
				title : 'You clicked Item 1'
			}).show();
		});
		
		var item2 = Titanium.UI.Android.OptionMenu.createMenuItem({
			title : 'Refresh',
			icon : '/images/refresh.png'
		});
		
		item2.addEventListener('click', function() {
			Ti.UI.createAlertDialog({
				title : 'You clicked Refresh'
			}).show();
		});

		menu.add(item1);
		menu.add(item2);
		
		return menu;
	});
})();
