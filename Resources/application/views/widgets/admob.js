(function() {
	he.register('adMob', function(args) {

		if (rebrand == 'gcmb') {
			publisherId = "a150801ec514043";

		} else if (rebrand == 'sms') {
			if (platform == 'Android') {
				publisherId = 'a1517a6d93a0400';
			} else {
				publisherId = 'a1517a6d229b8f8';
			}
		} else if( rebrand == 'pmg' ) {
			// Atanas:
			if (platform == 'Android') {
				publisherId = 'a15072ee3435b88';
			} else {
				publisherId = 'a150801ec514043';
			}
		}

		// then create an adMob view
		var adMobView = admob.createView({
			publisherId           : publisherId,
			testing               : false, // default is false
			top                   : args.top, // optional
			bottom                : args.bottom, // Hopefully an option too?

			width                 : 320,
			height                : 50,

			// adBackgroundColor  : "FF8855", // optional
			// backgroundColorTop : "738000", // optional - Gradient background color at top
			// borderColor        : "#000000", // optional - Border color
			textColor             : "#000000", // optional - Text color
			urlColor              : "#00FF00", // optional - URL color
			linkColor             : "#0000FF", // optional -  Link text color,
			zIndex                : 100
		});

		/*
		// listener for adReceived
		adMobView.addEventListener(admob.AD_RECEIVED, function() {
			// alert("ad received");
			Ti.API.info("ad received");
		});

		// listener for adNotReceived
		adMobView.addEventListener(admob.AD_NOT_RECEIVED, function() {
			// alert("ad not received");
			Ti.API.info("ad not received");
			// TODO: Make sure we don't keep checking if there's no network
			if (Titanium.Network.networkTypeName !== 'NONE') {
				// adMobView.requestAd();
			}
		});
		*/

		return adMobView;

	});
})();
