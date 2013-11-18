// INIT
var overlayhud = require('nl.icept.overlayhud');
Ti.API.info("module is => " + overlayhud);

// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

var tab1 = Titanium.UI.createTab({  
    icon: 'KS_nav_views.png',
    title: 'Empty HUD',
    window: Titanium.UI.createWindow({  
	    title: 'Empty HUD',
	    url: 'ui/example_empty.js',
	    
	    backgroundColor: "#fff",
	    barColor: "#000"
	})
});

var tab2 = Titanium.UI.createTab({  
    icon: 'KS_nav_ui.png',
    title: 'Loading HUD',
    window: Titanium.UI.createWindow({  
	    title: 'Loading',
	    url: 'ui/example_loading.js',
	    
	    backgroundColor: "#fff",
	    barColor: "#000"
	})
});

var tabGroup = Titanium.UI.createTabGroup();

tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  

tabGroup.open();
