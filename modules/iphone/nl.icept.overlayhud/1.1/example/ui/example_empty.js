var overlayhudModule = require('nl.icept.overlayhud');

/*
There are a lot options and we will only show a few of them in the examples. This are all the options and their default values:

{
	zIndex: 999,
	
	backgroundColor: "#000",
	borderRadius: 10,
	opacity: 0.8,
	
	height: 'auto',
	width: 'auto',
	top: null,
	bottom: null,
	left: null,
	right: null
}

*/

var example1Button = Ti.UI.createButton({borderRadius: 4.0,	top: 20, left: 20, right: 20, height: 50, title: "Buttons"});

var scrollView = Ti.UI.createScrollView({
	contentHeight: 'auto',
	contentWidth: 'auto',
	showHorizontalScrollIndicator: true,
	showVerticalScrollIndicator: true
});

scrollView.add(example1Button);

Ti.UI.currentWindow.add(scrollView);

scrollView.show();

example1Button.addEventListener("click", function(e) {
	var emptyHUD = overlayhudModule.createEmptyHUD({
		width: 150,
		height: 100
	});
	
	emptyHUD.add(Ti.UI.createButton({borderRadius: 4.0,	top: 10, left: 10, right: 10, height: 20, title: "Button 1", backgroundColor: "#fff"}));
	emptyHUD.add(Ti.UI.createButton({borderRadius: 4.0,	top: 40, left: 10, right: 10, height: 20, title: "Button 2", backgroundColor: "#fff"}));
	emptyHUD.add(Ti.UI.createButton({borderRadius: 4.0,	top: 70, left: 10, right: 10, height: 20, title: "Button 3", backgroundColor: "#fff"}));
	
	emptyHUD.show();
	
	setTimeout(function () {
		emptyHUD.hide({});
	}, 3000);
});