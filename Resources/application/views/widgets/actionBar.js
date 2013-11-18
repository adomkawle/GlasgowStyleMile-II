(function() {
    he.register('ActionBar', function(args) {
    	
        var v = he.create('View', 'actionBar', {height: 50, top: 0, width: Ti.Platform.displayCaps.platformWidth});
        
        return v;
    });
})();