(function() {
    he.register('calendar', function(args) {
    	
        var v = he.create('ScrollView', {layout: 'horizontal', scrollType: 'horizontal', backgroundColor: '#CCC', left: 0, right: 0, height: 50, top: args.top ? args.top : 0, width: Ti.Platform.displayCaps.platformWidth, zIndex: 99});
           
             
        v.add(he.create('calendarItem'));
        v.add(he.create('calendarItem'));
        v.add(he.create('calendarItem'));
        v.add(he.create('calendarItem'));
        v.add(he.create('calendarItem'));
        v.add(he.create('calendarItem'));
        v.add(he.create('calendarItem'));
        v.add(he.create('calendarItem'));
        v.add(he.create('calendarItem'));
        v.add(he.create('calendarItem'));
        v.add(he.create('calendarItem'));
        v.add(he.create('calendarItem'));
        v.add(he.create('calendarItem'));
        v.add(he.create('calendarItem'));
        v.add(he.create('calendarItem'));
        v.add(he.create('calendarItem'));

                
        return v;
    });
})();