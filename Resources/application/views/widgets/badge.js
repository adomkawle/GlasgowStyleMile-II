(function() {
    he.register('badge', function(args) {
    	
        var v = he.create('View', {
        	left: args.left !== undefined ? args.left : 0,
        	top: args.top !== undefined ? args.top : 0,
        	height: 20,
        	width: 30,
        	backgroundColor: 'transparent'
        });
        
        v.add(he.create('ImageView', {
        	left: 0,
        	top: 0,
        	image: directoryPath+'application/assets/images/GCMB/badge.png',
        	height: 20,
        	width: 30,
        	backgroundColor: 'transparent'
        }));
        
        v.add(he.create('Label', {color: '#FFF', font: {fontWeight: 'bold', fontSize: 11}, left: 0, top: 0, text: Math.round(args.count).toFixed(0), textAlign: 'center', height: 20, width:30}))
        
        return v;
    });
})();