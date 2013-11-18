(function() {
    he.register('offerRow', function(args) {
    	
    	var tr = he.create('TableViewRow', {
				hasChild: args.hasChild === true ? true : false,
				height: 'auto',
				className: 'RowStyleThree',
				id: args.id,
				backgroundColor: '#000',
				description: args.description
		});
		
		var trv = he.create('View', {height: 'auto', width: 'auto'});
		
		var lbl = he.create('Label', {top: 5, bottom: 5, left: 10, right: 75, text: args.description, color: '#FFF', font: {fontSize: 11}});
		
		Ti.API.info('Label height was: ' + lbl.height);
		
		trv.add(he.create('Label', {top: 5, bottom: 5, left: 10, right: 75, text: args.description, color: '#FFF', font: {fontSize: 11}}));
		
		var share = he.create('ImageView', {image: directoryPath+'application/assets/images/share_default.png', width: 'auto', height: 'auto', right: 5});
    	
    	tr.add(trv);
  		tr.add(share);
  		
  		return tr;
    	
    });
})();