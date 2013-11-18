var openWebBrowser = {};

(function() {
    
    openWebBrowser = function(url, title) {
     
        var current_url = url;
        var backBtn = he.create('backBtn');
        var w = Ti.UI.createWindow({
			titleControl:  Ti.UI.createLabel({ text: 'Browser', color: 'white' }), 
			backgroundColor: 'black',
			navBarHidden: false,
			leftNavButton: backBtn,
			 barColor: '#000',
			 color : 'white'
        });
        
        backBtn.addEventListener('click', function() {
        	w.close();
        });
        
        var flexSpace = Titanium.UI.createButton({
    	    systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
    	});
     
        var win_title = 'web browser';
        if (title!=null) {
            win_title = title;
        }
        var webwindow = Ti.UI.createWebView();
        webwindow.url = url;
        
        
        w.add(webwindow);
     
        var loadIndBg = Ti.UI.createView({
            width:70,
            height:70,
            backgroundColor:'#000000',
            borderRadius:8,
            opacity:0.5
        });
        webwindow.add(loadIndBg);
        var loadInd = Ti.UI.createActivityIndicator({
            height:50,
            width:50,
            style:Ti.UI.iPhone.ActivityIndicatorStyle.BIG
        });
        webwindow.add(loadInd);
        // create a back button image
        var back_button = Ti.UI.createButton({
           image: 'application/assets/images/glyphicons_216_circle_arrow_left.png',enabled:false
        });
        back_button.addEventListener('click', function() {
            webwindow.goBack();
        });
        // create a forward button image
        var forward_button = Ti.UI.createButton({
           image: 'application/assets/images/glyphicons_217_circle_arrow_right.png',enabled:false
        });
        forward_button.addEventListener('click', function() {
            webwindow.goForward();
        });
        var refresh_button = Ti.UI.createButton({
            image: 'application/assets/images/glyphicons_081_refresh.png'
        });
        refresh_button.addEventListener('click', function() {
            webwindow.reload();
        });
        var done_button = Ti.UI.createButton({
            systemButton: Ti.UI.iPhone.SystemButton.DONE
        });
        done_button.addEventListener('click', function() {
            w.close();
        });
        // add the control buttons to the toolbar
        //w.toolbar = [back_button,flexSpace,refresh_button,flexSpace,forward_button,flexSpace,done_button];
        // show activity when loading
        webwindow.addEventListener('beforeload',function(e) {
            loadIndBg.show();
            loadInd.show();
        });
        webwindow.addEventListener('load',function(e) {
            loadIndBg.hide();
            loadInd.hide();
            // set the control buttons
            if (webwindow.canGoForward()) {
                forward_button.enabled = true;
            } else {
                forward_button.enabled = false;
            }
            if (webwindow.canGoBack()) {
                back_button.enabled = true;
            } else {
                back_button.enabled = false;
            }
            current_url = e.url;
        });
      
     loadIndBg.hide();
     loadInd.hide();   
        
        // open the browser window (relative to the current window - [win])
       //w.open({modal: true});
     return w;
     
    };

})();
