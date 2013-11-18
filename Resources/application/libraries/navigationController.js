var navigationController = {};
navigationController.windowStack = [];
navigationController.navGroup = {};
var open = false;
var openCounter = 0;

// iOS stuff
var first = true;
var tabGroup = {};

(function(){
	navigationController.open = function(windowToOpen, noanimate) {

		//bind an open layout event to prevent this overclicking nonsense;


		if(open == true && windowToOpen != undefined){
				return;
		}

		if(windowToOpen != undefined){
			if(openCounter != 0){
			open = true;
			windowToOpen.addEventListener('open', function(){
				open = false;
			});
			} else {
				openCounter++;
			}
		}

		setTimeout(function(){
			lastOpenedWindow = windowToOpen;
		},500);

		if (platform == 'iOS') {
			if (first) {
				tabGroup = Ti.UI.createTabGroup();

				tabGroup.addTab(Ti.UI.createTab({
					window: he.create('DirectoryWindow', {navBarHidden: false}),
					title: 'Home',
					icon: 'application/assets/images/tabs/home.png'
				}));

				tabGroup.addTab(Ti.UI.createTab({
					window: he.create('whatsOn', {navBarHidden: false}),
					title: 'What\'s on',
					icon: 'application/assets/images/tabs/whats_on.png'
				}));

				tabGroup.addTab(Ti.UI.createTab({
					window: he.create('GalleryMapWindow', {navBarHidden: false}),
					title: 'See Glasgow',
					icon: 'application/assets/images/tabs/see_glasgow.png'
				}));

				tabGroup.addTab(Ti.UI.createTab({
					window: he.create('ResultsWindow', {navBarHidden: false, type: 'search'}),
					title: 'Search',
					icon: 'application/assets/images/tabs/search.png'
				}));

				tabGroup.open();

				first = false;
			} else {

				//some sort of animate window override.



				if(noanimate){

					tabGroup.activeTab.open(windowToOpen,{animated:false} );

				}else {
					tabGroup.activeTab.open(windowToOpen);
				}
			}

		} else {
			//add the window to the stack of windows managed by the controller
			navigationController.windowStack.push(windowToOpen);

			//grab a copy of the current nav controller for use in the callback
			var that = this;
			//hack - setting this property ensures the window is "heavyweight" (associated with an Android activity)
			windowToOpen.navBarHidden = false;

			//This is the first window
			if(navigationController.windowStack.length === 1) {
				if(Ti.Platform.osname === 'android') {
					windowToOpen.exitOnClose = true;
					windowToOpen.open();
				} else {
					navigationController.navGroup = Ti.UI.iPhone.createNavigationGroup({
						window : windowToOpen
					});
					var containerWindow = Ti.UI.createWindow();
					containerWindow.add(navigationController.navGroup);
					containerWindow.open();
				}
			}
			//All subsequent windows
			else {
				if(Ti.Platform.osname === 'android') {
					windowToOpen.open();
				} else {

					navigationController.navGroup.open(windowToOpen);

				}
			}
		}
	};
	navigationController.home = function(windowToOpen){

		//store a copy of all the current windows on the stack
		var windows = navigationController.windowStack.concat([]);
		for(var i = 1, l = windows.length; i < l; i++) {
			try {
				windows[i].close();
			} catch(e) {}
		}

		navigationController.windowStack = []; //reset stack

		// Open the new home window:
		navigationController.open(windowToOpen);

		//Ti.API.info();
	};
	navigationController.back = function(w){
		//store a copy of all the current windows on the stack
		if (navigationController.windowStack.length <= 1) {
            Ti.API.warn("navigationController: Attempt made to go back from main home page.");
            return;
        }

        var w = navigationController.windowStack.pop();
        if(Ti.Platform.osname === 'android') {
            w.close();
        }else{
            navigationController.navGroup.close(w);
        }
	};
})();
