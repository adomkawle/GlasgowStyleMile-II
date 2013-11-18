(function() {
    he.register('carouselItem', function(args) {

        var v = he.create('View', {height: '115', top: args.top || 0, width: Ti.Platform.displayCaps.platformWidth, zIndex: 99});

        var theImage = he.create('ImageView', {image: args.image, top: 0, height: 115, width: Ti.Platform.displayCaps.platformWidth, preventDefaultImage: true});
        v.add(theImage);


        if (args.title) {
            var labelView = he.create('View', {opacity: 1, left: 0, right: 0, bottom: 0, height: 27, width: Ti.Platform.displayCaps.platformWidth});
            	labelView.add(he.create('View', {height:1, top:5, opacity:0.5, backgroundColor: '#DDD', width:'94%', left:'2%'}));
                labelView.add(he.create('View', {
                    left: 0,
                    width: Ti.UI.FILL,
                    bottom: 0,
                    height: 20,
                    backgroundColor: '#AAA',
                    opacity: 0.1
                }));
                labelView.add(he.create('Label', {
                    text: args.title,
                    color: '#F30',
                    left: 20,
                    top: 2,
                    height: 25,
                    textAlign: 'left'
                }));
        	v.add(labelView);
        }


		// changing event onto the image.
        theImage.addEventListener('singletap', function() {

        	if (platform == 'android') {
            	var intent = Ti.Android.createIntent({
    				action : Ti.Android.ACTION_VIEW,
    				data : args.link
    			});

    			Ti.Android.currentActivity.startActivity(intent);
			} else {
				navigationController.open(openWebBrowser(args.link));
				
			}
        });

        return v;
    });
})();
