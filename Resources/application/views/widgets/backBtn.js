(function() {
	he.register('backBtn', function(params) {

		var b = he.create('Button', {
			backgroundImage: directoryPath+'application/assets/images/back.png',
			width: 42,
			height: 29
		});

		return b;

	});
})();
