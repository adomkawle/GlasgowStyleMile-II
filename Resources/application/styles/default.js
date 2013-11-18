(function() {

	var	defaultFont = 'Helvetica';

	// Atanas:
	// Add logo for the travel page
	var logo_file = (rebrand == 'sms') ? (directoryPath+'application/rebrands/sms/SMS_HeaderLogo.png') : (directoryPath+'application/assets/images/style_GCMB/glasgow_logo.png');
	var logo_height = (rebrand == 'sms') ? 40 : 55;
	if( rebrand == 'pmg' ) {
		logo_file = directoryPath+'application/rebrands/pmg/travel_logo.png';
	}

	he.registerPsets({
		Window: {
			backgroundColor: '#'+styles.get('windowBackgoundColor'),
			layout: 'vertical',
			navBarHidden : false,
			barColor: '#'+styles.get('barColor'),
			barImage: 'application/assets/images/nav_bar.png',
			height: 'auto',
			activity : {
				onCreateOptionsMenu : function(e) {
					var menu = e.menu;

					var m1 = menu.add({itemId: 1, groupId: 0, order: 1, title : 'Home'});
					m1.setIcon( '/application/assets/images/tabs/home_dark.png' );
					m1.addEventListener('click', function() {
						var directoryWindow = he.create('DirectoryWindow', {navBarHidden : false});
						navigationController.home( directoryWindow );
						navigationController.open( directoryWindow );
					});

					var m3 = menu.add({itemId: 3, groupId: 0, order: 3, title : 'What\'s On'});
					m3.setIcon( '/application/assets/images/tabs/whats_on_dark.png' );
					m3.addEventListener('click', function() {
						var whatsOnWindow = he.create('whatsOn', {navBarHidden : false});
						navigationController.open( whatsOnWindow );
					});

					var m2 = menu.add({itemId: 2, groupId: 0, order: 2, title : 'See Glasgow'});
					m2.setIcon( '/application/assets/images/tabs/see_glasgow_dark.png' );
					m2.addEventListener('click', function() {
						var galleryMapWindow = he.create('GalleryMapWindow', {navBarHidden : false});
						navigationController.open( galleryMapWindow );
					});

					var m4 = menu.add({itemId: 4, groupId: 0, order: 4, title : 'Search'});
					m4.setIcon( '/application/assets/images/tabs/search_dark.png' );
					m4.addEventListener('click', function() {
						var travel = he.create('ResultsWindow', {navBarHidden : false, type:'search' });
						navigationController.open( travel );
					});
				}
			}
		},
		actionBar: {
			backgroundColor: '#666666'
		},

		label: {
			font: {
				fontFamily: bodyFont
			}
		},

		// Directory Row Styles
		directoryRowImageView: {
			left: 0,
			width: 75,
			canScale: true,
			top: 10,
			bottom: 10
		},
		directoryRowTitle: {
			left: 20,
			top: 15,
			bottom: 15,
			height: Ti.UI.SIZE,
			width: '60%',
			color: '#'+styles.get('rowTextColor'),
			font: {
				// fontWeight: 'bold'
				fontFamily: bodyFont
			}
		},
		directoryRowSubTitle: {
			left: 83,
			top: 35,
			height: Ti.UI.SIZE,
			width: 200,
			color: '#888888',
			font: {
				fontSize: '12dp',
				fontFamily: bodyFont
			},
			wordWrap: true,
			ellipsize: true
		},
		directoryRowSpecialOffer: {
			left: 20,
			bottom: 10,
			top: 32,
			height: 'auto',
			width: 'auto',
			color: '#FF0000',
			text: 'Special Offer!',
			font: {
				fontSize: '12dp',
				fontFamily: bodyFont
			},
		},
		directoryRowDistance: {
			right: 40,
			top: 15,
			height: 20,
			width: 'auto',
			color: '#'+styles.get('rowDistanceColor'),
			backgroundColor: '#'+styles.get('rowDistanceBackground'),
			borderRadius: 5,
			font: {
				fontWeight: 'bold',
				fontSize: '12dp',
				fontFamily: bodyFont
			}
		},
		directoryRowArrow: {
			right: 10,
			top: 15,
			height: 20,
			width: 20,
			color: '#'+styles.get('rowArrowColor'),
			selectedColor: '#'+styles.get('rowArrowSelectedColor'),
			font: {
				fontFamily: iconFont,
				fontSize: 22
			}
		},


		ResultsTable: {
			top: 0,
			left: 0,
			right: 0
		},
		categoryRowTitle: {
			left: 10,
			top: 15,
			height: 'auto',
			width: 'auto',
			color: '#666666',
			fontWeight: 'bold',
			font: {
				fontWeight: 'bold',
				fontSize: '14dp',
				fontFamily: bodyFont
			}
		},
		categoryRowResultCount: {
			right: 15,
			top: 15,
			height: 'auto',
			width: 'auto',
			color: '#000000',
			font: {
				fontWeight: 'normal',
				fontSize: '14dp',
				fontFamily: bodyFont
			}
		},
		//
		detailDescription: {
			left: 10,
			right: 10,
			bottom: 10,
			color: '#333',
			font: {
				fontWeight: 'normal',
				fontSize: '14dp',
				fontFamily: bodyFont
			},
			height: Ti.UI.SIZE
		},
		detailImage: {
			width: 130,
			height: 140,
			left: 15
		},

		contactView: {
			backgroundColor: '#FFFFFF',
			height: Ti.UI.SIZE,
			layout: 'vertical',
			top: 0
		},
		contactRowLeftTitle: {
			left: 10,
			top: 15,
			width: 60,
			height: 'auto',
			color: '#0000FF',
			textAlign: 'right',
			font: {
				fontWeight: 'bold',
				fontSize: '12dp',
				fontFamily: bodyFont
			}
		},
		contactRowRightTitle: {
			left: 80,
			top: 15,
			width: 'auto',
			height: 'auto',
			color: '#333333',
			textAlign: 'left',
			font: {
				fontWeight: 'normal',
				fontSize: '12dp',
				fontFamily: bodyFont
			}
		},
		contactRowRightTitleMore: {
			left: 80,
			top: 30,
			width: 'auto',
			height: 'auto',
			color: '#333',
			textAlign: 'left',
			font: {
				fontWeight: 'normal',
				fontSize: '11dp',
				fontFamily: bodyFont
			}
		},
		titleViewLabel: {
			left: 30,
			top: 0,
			color: '#FFFFFF',
			font: {
				fontWeight: 'bold',
				fontSize: '12dp',
				fontFamily: bodyFont
			}
		},
		titleBar: {
			backgroundColor: '#'+styles.get('sortBarBackground')
		},
		titleBarLabel: {
			top: 8,
			left: 90,
			zIndex: 999,
			color: '#FFF',
			font: {
				fontWeight: 'bold',
				fontSize: '14dp',
				fontFamily: bodyFont
			}
		},
		tabViewLabel: {
			color: '#FFFFFF',
			left: 7,
			top: 5,
			font: {
				fontWeight: 'bold',
				fontSize: '12dp',
				fontFamily: bodyFont
			}
		},
		tabViewLabelInstructions: {
			color: '#000000',
			right: 5,
			bottom: 0,
			font: {
				fontWeight: 'normal',
				fontSize: '12dp',
				fontFamily: bodyFont
			}
		},
		eventsBackground: {
			image: directoryPath+'application/assets/images/GCMB/events-back.png',
			width: 320,
			height: 207
		},
		musicIcon: {
			left: 0,
			top: 0,
			width: 'auto',
			height: 'auto',
			image: directoryPath+'application/assets/images/GCMB/events-music.png'
		},
		comedyIcon: {
			left: 79,
			top: 0,
			width: 'auto',
			height: 'auto',
			image: directoryPath+'application/assets/images/GCMB/events-comedy.png'
		},
		daysOutIcon: {
			left: 79*2,
			top: 0,
			width: 'auto',
			height: 'auto',
			image: '/application/assets/images/GCMB/events-daysout.png'
		},
		visualArtIcon: {
			left: 79*3,
			top: 0,
			width: 'auto',
			height: 'auto',
			image: directoryPath+'application/assets/images/GCMB/events-art.png'
		},

		theatreIcon: {
			left: 0,
			top: 51,
			width: 'auto',
			height: 'auto',
			image: directoryPath+'application/assets/images/GCMB/events-theatre.png'
		},
		familyIcon: {
			left: 79*1,
			top: 51,
			width: 'auto',
			height: 'auto',
			image: directoryPath+'application/assets/images/GCMB/events-family.png'
		},
		cinemaIcon: {
			left: 79*2,
			top: 51,
			width: 'auto',
			height: 'auto',
			image: directoryPath+'application/assets/images/GCMB/events-cinema.png'
		},
		sportIcon: {
			left: 79*3,
			top: 51,
			width: 'auto',
			height: 'auto',
			image: directoryPath+'application/assets/images/GCMB/events-sport.png'
		},

		clubsIcon: {
			left: 0,
			top: 102,
			width: 'auto',
			height: 'auto',
			image: directoryPath+'application/assets/images/GCMB/events-clubs.png'
		},
		lgbtIcon: {
			left: 79,
			top: 102,
			width: 'auto',
			height: 'auto',
			image: directoryPath+'application/assets/images/GCMB/events-gay.png'
		},
		talksIcon: {
			left: 79*2,
			top: 102,
			width: 'auto',
			height: 'auto',
			image: directoryPath+'application/assets/images/GCMB/events-talks.png'
		},
		booksIcon: {
			left: 79*3,
			top: 102,
			width: 'auto',
			height: 'auto',
			image: directoryPath+'application/assets/images/GCMB/events-books.png'
		},
		theListIcon: {
			width: 'auto',
			height: 'auto',
			image: directoryPath+'application/assets/images/GCMB/thelist.png'
		},
		travelBackground: {
			backgroundColor: '#FFFFFF',
			height: Ti.UI.FILL
		},
		travelContainer : {
			height: 180, /* Match below */
			width: app.deviceWidth,
			top: '30%'

		},
		threebythree: {
			width: app.deviceWidth / 3,
			height: 180 / 3, /* Match above */
			opacity: 1,
			backgroundColor: '#000000'
			/*
			backgroundGradient: {
				type: 'linear',
				startPoint: { x: '0%', y : '0%' },
				endPoint:   { x: '0%', y : '100%'},
				colors: [{ color: '#2b2b2b', offset: 0.0} , { color: '#000000', offset: 1}]
			}
			*/
		},
		threebythreelabel:{
			bottom: 1,
			color: '#CCCCCC',
			// width: Ti.UI.FILL,
			font:{
				fontSize: 14,
				fontFamily: bodyFont
			},
			textAlign: 'center'
		},
		travelPlanner : {
			left: 10,
			fontSize: 16,
			text: 'Journey Planner',
			top: 80,
			color: '#'+styles.get('travelText')
		},
		travelText : {
			left: 10,
			fontSize: 16,
			text: 'Visitor Information',
			top: 20,
			color: '#'+styles.get('travelText')
		},
		busIcon: {
			left: 0,
			top: 3,
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			image: directoryPath+'application/assets/images/GCMB/bus_icon.png'
		},
		subwayIcon: {
			left: 0,
			top: 3,
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			image: directoryPath+'application/assets/images/GCMB/subway_icon.png'
		},
		railIcon: {
			left: 0,
			top: 3,
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			image: directoryPath+'application/assets/images/GCMB/rail_icon_3.png'
		},

		taxiIcon: {
			left: 0,
			top: 3,
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			image: directoryPath+'application/assets/images/GCMB/taxi_icon.png'
		},
		roadIcon: {
			left: 0,
			top: 3,
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			image: directoryPath+'application/assets/images/GCMB/road_icon.png'
		},
		parkingIcon: {
			left: 0,
			top: 3,
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			image: directoryPath+'application/assets/images/GCMB/parking_icon.png'
		},

		ferryIcon: {
			left: 0,
			top: 3,
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			image: directoryPath+'application/assets/images/GCMB/ferry_icon.png'
		},
		airIcon: {
			left: 0,
			top: 3,
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			image: directoryPath+'application/assets/images/GCMB/air_icon.png'
		},
		mobilityIcon: {
			left: 0,
			top: 3,
			width: Ti.UI.SIZE,
			height: Ti.UI.SIZE,
			image: directoryPath+'application/assets/images/GCMB/mobility_icon.png'
		},

		visitIcon: {
			right: 50,
			top: 20,
			width: 31,
			height: 31,
			image: directoryPath+'application/assets/images/GCMB/comms_icon_map.png'
		},
		visitLabel: {
			right: 52,
			top: 20+31,
			font: {
				fontWeight: 'normal',
				fontSize: '11dp',
				fontFamily: bodyFont
			},
			width: 31,
			color: '#666666',
			text: 'visit',
			textAlign: 'center'
		},
		callIcon: {
			right: 7,
			top: 20,
			width: 31,
			height: 31,
			image: directoryPath+'/application/assets/images/GCMB/comms_icon_call.png'
		},
		callLabel: {
			right: 7,
			top: 20+31,
			font: {
				fontWeight: 'normal',
				fontSize: '11dp',
				fontFamily: bodyFont
			},
			width: 31,
			color: '#666666',
			text: 'call',
			textAlign: 'center'
		},
		websiteIcon: {
			right: 7,
			top: 70,
			width: 31,
			height: 31,
			image: directoryPath+'/application/assets/images/GCMB/comms_icon_web.png'
		},
		websiteLabel: {
			right: 5,
			top: 70+31,
			font: {
				fontWeight: 'normal',
				fontSize: '11dp',
				fontFamily: bodyFont
			},
			width: 40,
			color: '#666666',
			text: 'website',
			textAlign: 'center'
		},
		travelLogo: {
			top: 0,
			right: rebrand == 'pmg' ? 0 : 'auto',
			height: logo_height,
			image: logo_file
		},
		showMeEverything: {
			bottom: 0,
			height: 40,
			width: 150,
			background: 'transparent'
		},

		tile: {
			width: 93,
			height: 80,
			left: 2,
			top: 2
		},

		tileBackground: {
			backgroundColor: '#'+styles.get('tileBackgroundColor'),
			width: Ti.UI.Fill,
			height: Ti.UI.Fill,
			opacity: styles.get('tileOpacity'),
			focusBackgroundColor: '#'+styles.get('tileFocusBackgroundColor')
		},

		tileLabel: {
			left: 0,
			width: Ti.UI.FILL,
			bottom: 10,
			height: 20,
			color: '#'+styles.get('tileFontColor'),
			focusFontColor: '#'+styles.get('tileFocusFontColor'),
			textAlign: 'center',
			font: {
				fontSize: 12,
				fontFamily: 'Semplicita-Pro-Medium'
			}
		},
		tileIcon: {
			left: 0,
			top: 10,
			width: Ti.UI.FILL,
			height: 50,
			textAlign: 'center',
			color: '#'+styles.get('tileIconColor'),
			focusIconColor: '#'+styles.get('tileFocusIconColor'),
			font: {
				fontFamily: iconFont,
				fontSize: 35
			}
		},

		TableViewRow: {
			backgroundColor: '#FFFFFF',
			backgroundSelectedColor: '#'+styles.get('rowSelectedBackgroundColor'),
			selectedColor: '#'+styles.get('rowSelectedColor'),
			color: '#'+styles.get('rowTextColor'),
			font: {
				fontFamily: bodyFont
			}
		},

		switchView: {
			top: 10,
			height: 30,
			width: 160,
			left: (app.deviceWidth - 160) / 2,
			backgroundColor: '#'+styles.get('switchInactive'),
			borderRadius: 5
		},
		switchBtn: {
			height: Ti.UI.FILL,
			width: 80,
			color: '#'+styles.get('switchInactiveText'),
			activeColor: '#'+styles.get('switchActiveText'),
			font: {
				fontWeight: 'bold',
				fontFamily: bodyFont
			},
			textAlign: 'center'
		},

		switchWideView: {
			top: 10,
			height: 30,
			width: 210,
			left: (app.deviceWidth - 210) / 2,
			backgroundColor: '#'+styles.get('switchInactive'),
			borderRadius: 5
		},
		switchWideBtn: {
			height: Ti.UI.FILL,
			width: 105,
			color: '#'+styles.get('switchInactiveText'),
			font: {
				fontWeight: 'bold',
				fontFamily: bodyFont
			},
			textAlign: 'center'
		},

		detailTitle: {
			color: '#'+styles.get('storeTitle'),
			left: 10,
			top: 10,
			bottom: 10,
			width: 200,
			height: Ti.UI.SIZE,
			textAlign: 'left',
			font: {
				fontSize: 26,
				fontFamily: bodyFont
			}
		},

		detailSubTitle: {
			color: '#'+styles.get('storeSubTitle'),
			left: 10,
			top: 0,
			bottom: 10,
			height: Ti.UI.SIZE,
			font: {
				fontSize: 16,
				fontFamily: bodyFont
			}
		},
		detailHeader:{
			color: '#'+styles.get('storeSubTitle'),
			left: 10,
			bottom: 10,
			font: {
				fontSize: 20
			}
		},
		detailSeperator: {
			backgroundColor: '#'+styles.get('detailSeperator'),
			height: 10,
			bottom: 10
		},

		contactButton: {
			backgroundColor: '#'+styles.get('contactBtnBackground'),
			height: 40,
			left: 15,
			right: 15,
			bottom: 10,
			color: '#'+styles.get('contactBtnColor'),
			borderRadius: 10,
			backgroundSelectedColor: '#'+styles.get('contactBtnSelectedBackgroundColor'),
			selectedColor: '#'+styles.get('contactBtnSelectedColor')
		},
		contactButton_small: {
			backgroundColor: '#'+styles.get('contactBtnBackground'),
			height: 30,
			bottom: 10,
			width: 70,
			color: '#'+styles.get('contactBtnColor'),
			borderRadius: 5,
			backgroundSelectedColor: '#'+styles.get('contactBtnSelectedBackgroundColor'),
			selectedColor: '#'+styles.get('contactBtnSelectedColor')
		},

		contactTitle: {
			color: '#'+styles.get('contactBtnColor'),
			font: {
				fontSize: 20,
				fontFamily: bodyFont
			},
			left: 70,
			top: 6
		},
		contactTitle_small: {
			color: '#'+styles.get('contactBtnColor'),
			font: {
				fontSize: 14,
				fontFamily: bodyFont
			},
			left: 28,
			top: 8,
			width: Ti.UI.SIZE,
			textAlign: 'left'
		},
		contactIcon: {
			color: '#'+styles.get('contactBtnColor'),
			font: {
				fontSize: 30,
				fontFamily: iconFont
			},
			height: 40,
			top: 2,
			left: 20
		},
		contactIcon_small: {
			color: '#'+styles.get('contactBtnColor'),
			font: {
				fontSize: 20,
				fontFamily: iconFont
			},
			height: Ti.UI.FILL,
			top: 2,
			left: 5
		},

		contactExtra: {
			color: '#'+styles.get('contactBtnColor'),
			top: 30,
			left: 70,
			right: 20,
			bottom: 5,
			height: Ti.UI.SIZE,
			font: {
				fontSize: 14,
				fontFamily: bodyFont
			}
		},

		devider: {
			height: 1,
			backgroundColor: '#DDD'
		}

	});

})();
