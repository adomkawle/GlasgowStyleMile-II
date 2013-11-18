var overlayhudModule = require('nl.icept.overlayhud');

/*
There are a lot options and we will only show a few of them in the examples. This are all the options and their default values:

{
	zIndex: 999,
	
	backgroundColor: "#000",
	borderRadius: 10,
	opacity: 0.8,
	
	color: '#fff',
	fontSize: 20,
	fontWeight: 'bold',
	
	message: "Loading...",
	
	activityIndicator: {
		style: Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
		hidden: false,
		top: null,
		bottom: null,
		left: null,
		right: null
	},
	
	image: {
		image: null,
		images: null,
		opacity: 1.0,
		repeatCount: 1,
		hidden: false,
		height: 'auto',
		width: 'auto',
		top: null,
		bottom: null,
		left: null,
		right: null
	},
	
	label: {
		hidden: false,
		height: 'auto',
		width: 'auto',
		top: null,
		bottom: 20,
		left: null,
		right: null
	},
	
	overlay: {
		height: 150,
		width: 150,
		top: null,
		bottom: null,
		left: null,
		right: null
	}
}

*/

var example1Button = Ti.UI.createButton({borderRadius: 4.0,	top: 20, left: 20, right: 20, height: 50, title: "Normal loading"});
var example2Button = Ti.UI.createButton({borderRadius: 4.0,	top: 90, left: 20, right: 20, height: 50, title: "Fade out"});
var example3Button = Ti.UI.createButton({borderRadius: 4.0,	top: 160, left: 20, right: 20, height: 50, title: "Label on top"});
var example4Button = Ti.UI.createButton({borderRadius: 4.0,	top: 230, left: 20, right: 20, height: 50, title: "Without label"});
var example5Button = Ti.UI.createButton({borderRadius: 4.0,	top: 300, left: 20, right: 20, height: 50, title: "Image"});
var example6Button = Ti.UI.createButton({borderRadius: 4.0,	top: 370, left: 20, right: 20, height: 50, title: "Colors"});

var scrollView = Ti.UI.createScrollView({
	contentHeight: 'auto',
	contentWidth: 'auto',
	showHorizontalScrollIndicator: true,
	showVerticalScrollIndicator: true
});

scrollView.add(example1Button);
scrollView.add(example2Button);
scrollView.add(example3Button);
scrollView.add(example4Button);
scrollView.add(example5Button);
scrollView.add(example6Button);

Ti.UI.currentWindow.add(scrollView);

scrollView.show();

example1Button.addEventListener("click", function(e) {
	var loadingOverlay = overlayhudModule.createLoadingHUD();
	loadingOverlay.show();
	
	setTimeout(function () {
		loadingOverlay.hide({});
	}, 3000);
});

example2Button.addEventListener("click", function(e) {
	var loadingOverlay = overlayhudModule.createLoadingHUD({
		message: 'Waiting to fade...',
		fontSize: 16
	});
	loadingOverlay.show();
	
	setTimeout(function () {
		loadingOverlay.hide({
			opacity: 0,
			duration: 2000
		});
	}, 3000);
});

example3Button.addEventListener("click", function(e) {
	var loadingOverlay = overlayhudModule.createLoadingHUD({
		label: {
			top: 20,
			bottom: null
		}
	});
	loadingOverlay.show();
	
	setTimeout(function () {
		loadingOverlay.hide({});
	}, 3000);
});

example4Button.addEventListener("click", function(e) {
	var loadingOverlay = overlayhudModule.createLoadingHUD({
		label: {
			hidden: true
		}
	});
	loadingOverlay.show();
	
	setTimeout(function () {
		loadingOverlay.hide({});
	}, 3000);
});

example5Button.addEventListener("click", function(e) {
	var loadingOverlay = overlayhudModule.createLoadingHUD({
		label: {
			hidden: true
		},
		
		activityIndicator: {
			hidden: true
		},
		
		image: {
			hidden: false,
			image: '../KS_nav_ui.png'
		}
	});
	loadingOverlay.show();
	
	setTimeout(function () {
		loadingOverlay.hide({});
	}, 3000);
});

example6Button.addEventListener("click", function(e) {
	var loadingOverlay = overlayhudModule.createLoadingHUD({
		backgroundColor: '#f00',
		color: '#000',
		borderRadius: 35
	});
	loadingOverlay.show();
	
	setTimeout(function () {
		loadingOverlay.hide({});
	}, 3000);
});