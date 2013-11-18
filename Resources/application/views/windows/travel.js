(function() {
    he.register('travel', function(args) {
    	    	
    	// Get some defaults
    	var activity 	= platform == 'Android' ? Ti.Android.currentActivity : null;
		var win 		= Ti.UI.currentWindow;
    	
        var backBtn = he.create('backBtn');
        var w = he.create('Window', {title: 'Travel', navBarHidden: false, leftNavButton: backBtn});
        w.orientationModes = [Titanium.UI.PORTRAIT];
        backBtn.addEventListener('click', function() {
            w.close();
        });
        
        var travelCategories = he.create('travelCategories', {top: 0, navBarHidden:true});
        w.add(travelCategories);
        
        w.add(he.create('adMob', {top: 5, bottom: 0}));
        
        GoogleAnalytics.trackPageView('travel');

        return w;
    });
})();
