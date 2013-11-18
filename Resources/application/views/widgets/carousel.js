(function() {
    he.register('carousel', function(args) {


        var v = he.create('ScrollableView', 'carousel', {height: '115', top: args.top || 0, width: Ti.Platform.displayCaps.platformWidth, zIndex: 99});

        // v.totalViews = 1;

        var results = joli.connection.execute('SELECT * FROM highlights');

        var data = [];

        // SMS rebrand has a hard coded single banner
        if (rebrand == 'sms') {
            data.push(he.create('carouselItem', {image: Ti.Filesystem.resourcesDirectory+'application/rebrands/sms/carousel.jpg', title: null, link: 'http://glasgow.strategicmanagement.net/index.php'}));
        } else {
            while (results.isValidRow()) {
                Ti.API.info(results.fieldByName('image'));
                data.push(he.create('carouselItem', {image: results.fieldByName('image'), title: results.fieldByName('title'), link: results.fieldByName('link')}));
                // v.totalViews++;
                results.next();
            }
        }

        v.totalViews = data.length;

        results.close();
        results = null;
        v.views = data;

        return v;
    });
})();
