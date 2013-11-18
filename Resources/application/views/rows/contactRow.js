(function() {
	he.register('contactRow', function(args) {

		var tr = he.create('TableViewRow', {
			hasChild : args.hasChild === true ? true : false,
			height : Ti.UI.SIZE,
			minRowHeight : 75,
			className : 'RowStyleOne',
			type: args.type
		});

		var leftTitle = he.create('Label', 'contactRowLeftTitle', {
			text : args.leftTitle
		});
		
		var rightTitle = he.create('Label', 'contactRowRightTitle', {
			text : args.rightTitle
		});
		
		if(args.rightTitleMore) {
			var rightTitleMore = he.create('Label', 'contactRowRightTitleMore', {
				text : args.rightTitleMore
			});
			tr.add(rightTitleMore);

		}

		tr.add(leftTitle);
		tr.add(rightTitle);

		return tr;

	});
})();
