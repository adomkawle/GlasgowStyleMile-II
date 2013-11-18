(function() {
    he.register('travelMap', function(args) {
    	    	
    	// Get some defaults
    	var activity 	= platform == 'Android' ? Ti.Android.currentActivity : null;
		var win 		= Ti.UI.currentWindow;
    	
        var w = he.create('Window', {title: args.title, navBarHidden:true});
        w.orientationModes=[Titanium.UI.PORTRAIT];
        
        var i = he.create('ImageView', {
            image: args.image,
            enableZoomControls: true,
            width: app.deviceWidth,
            height: 'auto',
            longitudeDelta: 1
        });
        
        w.add(i);

        GoogleAnalytics.trackPageView('travel_map');
        
        return w;
    });
})();
