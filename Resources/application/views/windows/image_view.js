(function() {
    he.register('zoomImageView', function(args) {
    	
    	
    	    	
    	// Get some defaults
    	var activity 	= platform == 'Android' ? Ti.Android.currentActivity : null;
		var win 		= Ti.UI.currentWindow;
		var currentType = '';
    	
        var w = he.create('Window', {title: 'Map', navBarHidden:true});
        w.orientationModes=[Titanium.UI.PORTRAIT];
        
        w.addEventListener('open', function(){        	
        	//getTravelResults(args.type);
        });
        
        //var v = he.create('View', {layout: 'vertical', width: app.deviceWidth, height: app.deviceHeight});
        
        //var titleBar = he.create('titleBar', {useSwitch: true, zIndex: 1});
        //v.add(titleBar); 
        
        var iv = he.create('ImageView', {image: args.image, width: app.deviceWidth, canScale: false, enableZoomControls: false, zIndex: 2})
        
        w.add(iv);
        
        iv.addEventListener('click', function(){
        	iv.width = app.deviceWidth * 1.5;
        });
        
        //w.add(v);
        
        return w;
    });
})();