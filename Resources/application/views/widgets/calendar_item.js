(function() {
    he.register('calendarItem', function(args) {
    	
        var v = he.create('View', {backgroundColor: '#FFF', left: 0, right: 0, height: 50, top:0, width: 50, borderWidth: 1, borderColor: '#CCC'});
        
        v.add(he.create('View', {backgroundColor: '#333', height: 18, width: 50, top: 0}));
        v.add(he.create('Label', {text: 'Today', top: 0, width: 50, textAlign: 'center', color: '#FFF'}));
        v.add(he.create('Label', {text: '18', bottom: 3, font: {fontSize: 16}, color: '#000', width: 50, textAlign: 'center'}));
                
        return v;
    });
})();