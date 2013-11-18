(function() {
    he.register('DirectoryWindow', function(args) {

        // Get some defaults
        var activity    = platform == 'Android' ? Ti.Android.currentActivity : null;
        var win         = Ti.UI.currentWindow;
        var menu        = null;
        var m1          = null;
        var openedWindow = false;
        var lastTweetUpdate = 0;

        var w = he.create('Window', {
            title: 'Home',
            backgroundImage: gsm.get_homepage_image(),
            // rightNavButton: infoBtn
            navBarHidden: true
            // backgroundColor: '#FFF'
        });
        w.orientationModes=[Titanium.UI.PORTRAIT];


        // Add our own title bar
        w.add(he.create('homeTitleBar'));

        // Add table of options
        // var optionsTable = he.create('TableView', {height: optionsTableHeight, top: 20, left: 15, right: 15, borderRadius: 5,borderWidth: 1, borderColor: '#999', backgroundColor: '#FFF'});
        // var optionsTableData = [];
        var tiles = [];

        var tilesView = he.create('View', {
            layout: 'horizontal',
            top: 10,
            left: (app.deviceWidth - 95 * 3) / 2,
            height: 246
        });

        for (var i = 0; i < tiles.length; i++) {
            tilesView.remove(tiles[i]);
        }
        tiles = [];

        var customTile = he.create('tileView', {title: styles.get('category_name'), icon: 'G', optionType: 'category', optionValue: styles.get('category_id')});

        // 'Icon' is the letter in the custom font which allows us to change the colour, if anyone wonders WTF is happening here
        tiles.push(he.create('tileView', {title: 'Shopping', icon: 'A', optionType: 'by_category', optionValue: 'shopping'}));
        tiles.push(he.create('tileView', {title: 'Guidebook', icon: 'B', optionType: 'by_category', optionValue: 'lifestyle'}));
        tiles.push(he.create('tileView', {title: 'Food & Drink', icon: 'C', optionType: 'by_category', optionValue: 'food_drink'}));

        tiles.push(he.create('tileView', {title: 'See Glasgow', icon: 'D', optionType: 'gallery'}));
        tiles.push(he.create('tileView', {title: 'What\'s On', icon: 'E', optionType: 'whats_hot'}));
        tiles.push(he.create('tileView', {title: 'Near Me', icon: 'F', optionType: 'near_me'}));

        tiles.push(he.create('tileView', {title: 'Travel', icon: 'H', optionType: 'travel'}));
        tiles.push(he.create('tileView', {title: 'Special Offers', icon: 'I', optionType: 'special_offers'}));
        tiles.push( customTile );

        for (var i = 0; i < tiles.length; i++) {
            tilesView.add(tiles[i]);
        }

        function fillDirectory() {
            // Don't do this on the first time
            if (lastTweetUpdate > 0) w.backgroundImage = gsm.get_homepage_image();

            var time = new Date().getTime();
            if (time > lastTweetUpdate + (1000 * 60 * 2)) {
                gsm.getTweet(function(tweet, time) {
                    var days = gsm.daysBetween( Date.parse(time), Date.today() );
                    if (days == 1) {
                        time = '1 day';
                    } else if (days > 1) {
                        time = days+' days';
                    } else {

                        hours = gsm.hoursBetween( Date.parse(time), new Date().getTime() );
                        if (hours == 1) {
                            time = '1 hour';
                        } else if (hours > 1) {
                            time = hours+' hours';
                        } else {
                            time = 'Not long';
                        }
                    }

                    tweet = html_entity_decode(tweet);
                    tweetText.setText(tweet);
                    tweetTime.setText(time+' ago');

                    // var date = new Date(time)
                    // date.format('dd/mm/yy');
                    // tweetTime.setText( date );
                    // tweetView.show();
                }); 
                lastTweetUpdate = time;
            };

			// Atanas:
			// Note: This is only a temporary fix
			// The idea is to update the button whenever there is new information pulled from the CMS
			// This can be accomplished by sending a notification after the update
			// Upon receiving the notification, the app should check if 
			// the information is different from the information in the button
			// Only if it is, the button should be updated (with a smooth animation)
            if (rebrand != 'sms') {
            	// Only update the tile if the text of the label is different
            	if( styles.get('category_name') != customTile.tileLabel.text ) {
            		// Add the new view before removing the old view
            	    var customTileNew = he.create('tileView', {title: styles.get('category_name'), icon: 'G', optionType: 'category', optionValue: styles.get('category_id')});
            		tilesView.add(customTileNew);
            		tilesView.remove(customTile);
            		// For the re-visit of the page
            		customTile = customTileNew;            		
            	}
            	// The following code is causing 
			    // the flashing of the bottom right -most button
                // tilesView.remove(customTile);
                // customTile = he.create('tileView', {title: styles.get('category_name'), icon: 'G', optionType: 'category', optionValue: styles.get('category_id')});
                // tilesView.add(customTile);
            }
       }

        tilesView.addEventListener('singletap', function(e) {

            if(e.source.optionType == 'by_category'){

                var categoriesWindow = he.create('CategoriesWindow', {type: e.source.optionValue});
                navigationController.open( categoriesWindow );
            }

            if(e.source.optionType == 'near_me') {

                var resultsWindow = he.create('ResultsWindow', {type: 'near_me'});
                navigationController.open( resultsWindow );
            }

            if(e.source.optionType == 'whats_hot'){

                // var resultsWindow = he.create('ResultsWindow', {type: 'whats_hot'});
                // navigationController.open( resultsWindow );
                //droid has no tabs.
                if(platform != 'Android'){
                    tabGroup.setActiveTab(1);
                } else {
                    var resultWindows = he.create('whatsOn');
                    navigationController.open(resultWindows);
                }
            }

            if(e.source.optionType == 'special_offers'){

                var resultsWindow = he.create('ResultsWindow', {type: 'special_offers'});
                navigationController.open( resultsWindow );
            }

            if(e.source.optionType == 'events'){

                var resultsWindow = he.create('ResultsWindow', {type: 'events'});
                navigationController.open( resultsWindow );
            }

            if(e.source.optionType == 'gallery'){

                if(platform != 'Android'){
                    tabGroup.setActiveTab(2);
                } else {
	                var resultsWindow = he.create('GalleryWindow');
	                navigationController.open( resultsWindow );
	            }
            }

            if(e.source.optionType == 'category' && e.source.optionValue){

                var resultsWindow = he.create('ResultsWindow', {id: e.source.optionValue, type: 'by_category'});
                navigationController.open( resultsWindow );
            }

            if (e.source.optionType == 'travel') {
                var travel = he.create('travel', {navBarHidden : false});
                navigationController.open( travel );
            }
        });

        w.add(tilesView);

        // Create tweet view

        var tweetView = he.create('View', {
            top: 0,
            height: Ti.UI.SIZE,
            left: 0,
        });
        tweetView.add(he.create('ImageView', {
            left: (app.deviceWidth - 95 * 3) / 2,
            top: 15,
            height: 34,
            width: 50,
            image: directoryPath+'application/assets/images/tweet.png'
        }));
        tweetView.add(he.create('View', {
            backgroundColor: '#'+styles.get('tileBackgroundColor'),
            opacity: styles.get('tileOpacity'),
            right: (app.deviceWidth - 95 * 3) / 2,
            top: 10,
            width: 230,
            height: 70,
            borderRadius: 10
        }));
        var tweetText = he.create('Label', {
            top: 12,
            right: (app.deviceWidth - 95 * 3) / 2 + 10,
            width: 210,
            height: 45,
            font: {
                fontSize: 13,
                fontFamily: 'Semplicita Pro'
            },
            color: '#' +styles.get('tileFontColor'),
            text: 'Loading tweet...'
        });
        var tweetTime = he.create('Label', {
            bottom: 4,
            right: 25,
            width: 210,
            font: {
                fontSize: 12,
                fontFamily: 'Semplicita Pro'
            },
            color: '#' +styles.get('tileFontColor')
        });
        tweetView.add(tweetText);
        tweetView.add(tweetTime);

        tweetView.addEventListener('click', function() {
            var url = 'http://www.twitter.com/'+styles.get('twitter_account');
            if (platform == 'Android') {
                var intent = Ti.Android.createIntent({
                    action : Ti.Android.ACTION_VIEW,
                    data: url
                });

                Ti.Android.currentActivity.startActivity(intent);

            } else {
               
                //openWebBrowser(url);
                navigationController.open(  openWebBrowser(url) );
                
            }
        });

        w.add(tweetView);
        // Twitter


        w.addEventListener('focus', function(){
            openedWindow = false;

            setTimeout(function() {
                GoogleAnalytics.trackPageView('/');
                fillDirectory();
            }, 1);
        });

        if (platform == 'Android') {
            var adMobAd = he.create('adMob', {top: 20, bottom: 0});
            w.add(adMobAd);
        }

        return w;
    });
})();
