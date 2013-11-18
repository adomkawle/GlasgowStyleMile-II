(function() {
	he.register('homeTitleBar', function() {

		var v = he.create('View', {
			background: 'transparent',
			top: 20,
			left: 0,
			width: Ti.UI.FILL,
			height: 50
		});
		
		// Atanas: Switch to purple background
		var bgcolor = '#001';
		var opacity = 0.7;
		if( rebrand == 'pmg' ) {
			bgcolor = '#CD0059';
			opacity = 1;
		} 

		// Slightly transparent background
		v.add(he.create('View', {
			backgroundColor: bgcolor,
			opacity: opacity,
			height: Ti.UI.FILL,
			width: Ti.UI.FILL
		}));
		
		// Atanas:
		// The original logo is overwritten by update styles
		// I am switching back to the original logo here
		// It is not very elegant but once we have the new styles feed, the following quick fix must be removed
		var logo = styles.get('homeLogo');
		var left_offset = (app.deviceWidth - (rebrand == 'sms' ? 90 : 136)) / 2;
		if( rebrand == 'pmg' ) {
			logo = styles.get('hardCodedHomeLogo');
			left_offset = app.deviceWidth - 112;
		}

		v.add(he.create('ImageView', {
			image: logo,
			defaultImage: styles.get('homeLogo', null, true),
			hires: true,
			width: rebrand == 'sms' ? 90 : 136,
			// height: 20,
			left: left_offset
		}));

		// Atanas: The right offset of the info button is different for People Make Glasgow
		// It is on the right, because the logo is on the left
		// We do not have a design reference and the project manager made this decision
		var right_offset = ((Ti.Platform.displayCaps.platformWidth - 95 * 3) / 2) - 5;
		if( rebrand == 'pmg' ) {
			right_offset = app.deviceWidth - 47;
		}

		var viewInfo = he.create('View', {
			height: 40,
			width: 40,
			right: right_offset,
			top: 13
		});

		var infoBtn = he.create('Label', {
			text: 'J',
			top: 0,
			textAlign: 'center',
			font: {
				fontFamily: iconFont,
				fontSize: 25
			},
			color: '#' + styles.get('infoColor')
		});



		viewInfo.add(infoBtn);

		viewInfo.addEventListener('singletap', function() {
			var infoWindow = he.create('info', {navBarHidden : false});
			navigationController.open( infoWindow );
		});
		infoBtn.addEventListener('touchstart', function() {
			infoBtn.color = '#'+styles.get('infoFocusColor');
		});
		infoBtn.addEventListener('touchend', function() {
			infoBtn.color = '#'+ styles.get('infoColor');
		});
		v.add(viewInfo);

		// Change CMS URL option
		/*
		var secretBtn = he.create('Button', {
			width: 20,
			height: 20,
			borderRadius: 10,
			backgroundColor: '#FFF',
			borderColor: 'none',
			opacity: 0.5,
			left: 10,
			top: 15,
			title: 'O'
		});
		secretBtn.addEventListener('click', function() {
			var cmsUrlWindow = he.create('cmsUrlWindow');
			navigationController.open( cmsUrlWindow );
		});
		v.add(secretBtn);
		*/

		return v;

	});
})();
