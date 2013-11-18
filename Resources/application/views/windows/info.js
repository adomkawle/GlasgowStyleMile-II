(function() {
	he.register('info', function(args) {

		// Get some defaults
		var activity 	= platform == 'Android' ? Ti.Android.currentActivity : null;
		var win 		= Ti.UI.currentWindow;
		
		// Atanas: Insert the correct title
		var title;
		if( rebrand == 'gcmb' ) {
			title = 'Glasgow Scotland with Style';
		} else if( rebrand == 'sms' ) {
			title = 'SMS Glasgow';
		} else if( rebrand == 'pmg' ) {
			// We do not have a design reference for this title
			// However, the app name is not Glasgow Scotland with Style
			// So I am assuming that the new app name should be used here
			title = 'Official Glasgow Guide';
		} else {
			// Default
			title = 'Glasgow Scotland with Style';
		}

		var backBtn = he.create('backBtn');
		var w = he.create('Window', {
			title: title,
			backgroundColor: '#FFFFFF',
			leftNavButton: backBtn
		});
		w.orientationModes = [Titanium.UI.PORTRAIT];
		backBtn.addEventListener('click', function() {
			w.close();
		});

		if (rebrand == 'sms') {

			var html = '<!DOCTYPE HTML><html lang="en-US"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Information</title><style type="text/css">@font-face{font-family: "Semplicita Pro";src: url("Semplicita-Pro-Medium.otf");}html {background-color: #494949;padding: 0px;} p, li {color: #dfdfdf; font-family:"Semplicita Pro"; font-size: 13px; width: 90%; margin: 10px 5%;}</style></head><body><center><img style="margin: 10px auto;" src="application/rebrands/sms/SMS_HeaderLogo.png"></center>'+
			'<p>The SMS Special Conference in Glasgow will focus on complex, multi-stakeholder settings which feature high levels of ambiguity, non-linearity, uncertainty and interdependence.  The purpose of this conference is to ask whether new approaches to strategy and strategic management are required to deal with such settings.</p>'+
'<p>To ensure you get the most from this year’s conference in Glasgow, this app will provide you with a snapshot of conference events, as well as how you can make the most of your time in the city.'+
'Glasgow, one of Europe\'s most vibrant, dynamic and stylish cities, has been named the number one UK destination "on the rise" by the world\'s largest travel site, TripAdvisor®</p>'+
'<p>From outstanding architecture, world-class museums and galleries, and one of the best shopping experiences in the UK to fabulous restaurants, a cutting-edge music scene and some of Europe\'s leading festivals and major events there’s a huge variety of attractions to entertain visitors.</p>'+
'<p>With the SMS Glasgow app you can take advantage of:</p>'+
'<ul>'+
'<li>Key SMS Glasgow conference events within the SMS Glasgow section of the app</li>'+
'<li>A real-time ‘guidebook’ of leisure events and attractions as well as regularly updated retail, dining and leisure special offers.</li>'+
'<li>Location-based searching and integrated on and offline mapping – making it easier to explore, discover and enjoy wherever you are in Glasgow.</li>'+
'<li>A comprehensive ‘What’s on’ listing allowing event searches to be made by date, genre or proximity.</li>'+
'<li>Travel and transport information, allowing you to view transport networks, call a taxi and link to a useful journey planner.</li></ul></body></html>';

		} else if( rebrand == 'pmg' ) {
			// Atanas: TODO: Replace the text with the one provided by the client
			var html_start = '<!DOCTYPE HTML><html lang="en-US"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Information</title><style type="text/css">@font-face{font-family: "Semplicita Pro";src: url("Semplicita-Pro-Medium.otf");}html {background-color: #494949;padding: 0px;} p {color: #dfdfdf; font-family:"Semplicita Pro"; font-size: 13px; width: 90%; margin: 10px 5%;}</style></head><body><img style="margin: 10px auto; margin-right:0px; display:block; margin-bottom:30px;" src="';
			var html_middle = '" width="130" />';
			var html_end = '</body></html>';

			var default_img = 'application/rebrands/pmg/pmg_info@2x.png';

			var default_html = "<p>Glasgow is one of Europe's most exciting destinations, which combines the energy and sophistication of a great international city with some of Scotland's most spectacular scenery.</p><p>Be the first to know what is on in the city with the Glasgow city guide app. Access the latest retail, dining and leisure offers.  As well as full what's on listings, location based searching and integrated Google mapping.</p><p>Whether you live in Glasgow or are just visiting this app is the perfect guide while in the city.  Whether you are looking for something to see and do or trying to find somewhere to eat this app can help.</p>";

			var html = html_start + default_img + html_middle + styles.get('about_text', default_html) + html_end;
		} else {

			var html_start = '<!DOCTYPE HTML><html lang="en-US"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Information</title><style type="text/css">@font-face{font-family: "Semplicita Pro";src: url("Semplicita-Pro-Medium.otf");}html {background-color: #494949;padding: 0px;} p {color: #dfdfdf; font-family:"Semplicita Pro"; font-size: 13px; width: 90%; margin: 10px 5%;}</style></head><body><img style="margin: 10px auto;" src="';
			var html_middle = '" width="300" />';
			var html_end = '</body></html>';

			var default_img = 'application/assets/images/style_GSWS/Logo_inverted.png';

			var default_html = "<p>Glasgow is one of Europe's most exciting destinations, which combines the energy and sophistication of a great international city with some of Scotland's most spectacular scenery.</p><p>Be the first to know what is on in the city with the Glasgow city guide app. Access the latest retail, dining and leisure offers.  As well as full what's on listings, location based searching and integrated Google mapping.</p><p>Whether you live in Glasgow or are just visiting this app is the perfect guide while in the city.  Whether you are looking for something to see and do or trying to find somewhere to eat this app can help.</p>";

			var html = html_start + styles.get('about_image', default_img) + html_middle + styles.get('about_text', default_html) + html_end;
		}

		var description1 = he.create('WebView', {html : html}); // url: '/application/views/windows/info.html'
		description1.setEnableZoomControls(false);

		w.add(description1);

		GoogleAnalytics.trackPageView('info');

		return w;
	});
})();
