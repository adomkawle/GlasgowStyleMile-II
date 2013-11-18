// Define a global namespace
var gsm = {};

(function() {

	// Know which category we should show in details.js
	gsm.preferedCategory = false;

	gsm.zeroPad = function(num,count) {
		var numZeropad = num + '';
		while(numZeropad.length < count) {
			numZeropad = "0" + numZeropad;
		}
		return numZeropad;
	};

	gsm.convert_date = function( /* String */ theDate) {
		// 22/10/2011 23:00:00 -> 2011-10-22 23:00:00

		var segments, dateSegment,dateSegments, timeSegment, outputDate;

		if (theDate.indexOf(" ") !== -1) {
			segments = theDate.split(' ');

			dateSegment = segments[0];
			timeSegment = segments[1];

			dateSegments = dateSegment.split('/');

			return dateSegments[2] + '-' + gsm.zeroPad(dateSegments[1],2) + '-' + gsm.zeroPad(dateSegments[0],2) + ' ' + timeSegment;
			// latitude : locations[0].replace(" ",""),
		} else if (theDate.indexOf("T") !== -1) {

			segments = theDate.split('T');

			dateSegment = segments[0];
			timeSegment = segments[1];

			dateSegments = dateSegment.split('-');

			return dateSegments[0] + '-' + gsm.zeroPad(dateSegments[1],2) + '-' + gsm.zeroPad(dateSegments[2],2) + ' ' + timeSegment;

			//return theDate.replace("T"," ");
		}

		return '';

	};

	gsm.daysBetween = function(first, second) {
		Ti.API.info(first + ' ' + second);
		try {
			 // Copy date parts of the timestamps, discarding the time parts.
			var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
			var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

			// Do the maths.
			var millisecondsPerDay = 1000 * 60 * 60 * 24;
			var millisBetween = two.getTime() - one.getTime();
			var days = millisBetween / millisecondsPerDay;

			// Round down.
			return Math.floor(days);
		} catch(e) {

		}
	};

	gsm.hoursBetween = function(first, second) {
		Ti.API.info(first + ' ' + second);
		try {

			var millisecondsPerHour = 1000 * 60 * 60;
			var millisBetween = second - first.getTime();
			var hours = millisBetween / millisecondsPerHour;

			// Round down.
			return Math.floor(hours);
		} catch(e) {

		}
	};


	gsm.database = db_version;
	gsm.update_url = 'http://xml2json.com/process/feed/957d12aac741b759bb839ea0ce29acb3?appId=GSWS&lastModified=';

	// The params seem to cause XML error in response
	// gsm.update_url = 'http://xml2json.com/process/feed/957d12aac741b759bb839ea0ce29acb3';
	// Oh wait, they happen on that URL too, yay.

	gsm.events_url = 'http://xml2json.com/process/feed/c79d570ca59b9db9ff77d2ca39613324?appId=GSWS&lastModified=';
	gsm.categories_url = 'http://xml2json.com/process/feed/26c659d3163ac0f80ed784f14b138b5f?appId=GSWS&lastModified=';
	gsm.events_categories_url = 'http://xml2json.com/process/feed/c929a5c6648095cd33c0411f61434ea3?appId=GSWS&lastModified=';
	gsm.performances_url = 'http://xml2json.com/process/feed/29cd388deade646171f553cf6c1a0ef1?appId=GSWS&lastModified=';
	gsm.highlights_url = 'http://xml2json.com/process/feed/a6ef52957bc6942bd6915384dad2b327?appId=GSWS&lastModified=';
	gsm.special_offers = 'http://xml2json.com/process/feed/da590b99fdd13ec2c03e0139a4ad7eab';

	// gsm.gallery_url = 'http://gcmb-gallery.10t.co.uk/api';
	// gsm.styles_url = 'http://gcmb-gallery.10t.co.uk/api/styles';
	gsm.gallery_url = 'http://www.seeglasgow.com/appcms';
	gsm.styles_url = 'http://www.seeglasgow.com/appcms/styles';

	// if (Titanium.App.Properties.getString('gallery_url')) gsm.gallery_url = Titanium.App.Properties.getString('gallery_url');
	// if (Titanium.App.Properties.getString('styles_url')) gsm.styles_url = Titanium.App.Properties.getString('styles_url');

	gsm.tweet_url = 'https://api.twitter.com/1/users/show.json?screen_name=';


	// gsm.update_url_xml = 'http://seeglasgowapp.com/api/getUpdates';
	gsm.default_last_modified = '';

	if (platform == 'Android') {
		// Atanas:
		// ActivityIndicator is replaced by ProgressIndicator after Titanium 3.0
		// The new ActivityIndicator is view based and it resembles the iOS activity indicator
		// gsm.actInd = Titanium.UI.createActivityIndicator({
		gsm.actInd = Ti.UI.Android.createProgressIndicator({
			height : 50,
			width : 10,
			message : 'Loading'
		});
	} else {
		gsm.actInd = require("application/libraries/overlayHUD");
		gsm.actInd.load('Loading');

		// Map the Android func to the right func for this
		gsm.actInd.setMessage = gsm.actInd.changeMessage;
	}

	gsm.default_homepage_image = 'application/assets/images/default_image.png';

	gsm.remoteHomepageUrl = 'http://gcmb-gallery.10t.co.uk/uploads/';

	gsm.return_categories = function( type ) {
		var result = new joli.query().select().from('categories').where('display = ?', 'TRUE').order('name ASC');
		if (type) {
			result.where('type = ?', type);
		}
		// result.where('id != ?', styles.get('category_id'));
		return result.execute();
	};
	gsm.return_category = function(/* Integer */ category_id) {
		var result = new joli.query().select().from('categories').where('id = ?', category_id);
		return result.execute()[0];
	};

	gsm.return_events = function(/* Date */ theDate, /* Number */ id, /* Number */ start, /* Number */ limit ) {
		if (!start) { start = 0; }
		if (!limit) { limit = 1000; }
		var fudge = Math.pow(Math.cos((app.longitude * Math.PI / 180)),2);

		var result;
		var id_sql;

		if (id != 0) {
			id_sql = "AND events_categories.category_id = '" + id + "'";
		} else{
			id_sql = "";
		}
//alert('***fetching 4 date: '+theDate);
//theDate = '2013-12-03';
		if ( theDate !== 'all') {
			//result = joli.connection.execute("SELECT *, events.id as event_id FROM performances LEFT JOIN events ON performances.event_id = events.id JOIN events_categories ON events_categories.event_id = events.id WHERE performances.date_time LIKE '" + theDate + "%' " + id_sql + " GROUP BY event_id  ORDER BY (('" + app.latitude + "' - latitude) * (" + app.latitude + " - latitude) + (" + app.longitude + " - longitude) * (" + app.longitude + " - longitude) * " + fudge + ")");
			result = joli.connection.execute("SELECT *, events.id as event_id FROM performances LEFT JOIN events ON performances.event_id = events.id JOIN events_categories ON events_categories.event_id = events.id WHERE events.start_date LIKE '" + theDate + "%'" + id_sql + " GROUP BY event_id  ORDER BY (('" + app.latitude + "' - latitude) * (" + app.latitude + " - latitude) + (" + app.longitude + " - longitude) * (" + app.longitude + " - longitude) * " + fudge + ")");
		} else {
			result = joli.connection.execute("SELECT *, events.id as event_id FROM performances LEFT JOIN events ON performances.event_id = events.id JOIN events_categories ON events_categories.event_id = events.id WHERE performances.date_time >= '" + date('Y-m-d') + "' " + id_sql + " GROUP BY event_id  ORDER BY (('" + app.latitude + "' - latitude) * (" + app.latitude + " - latitude) + (" + app.longitude + " - longitude) * (" + app.longitude + " - longitude) * " + fudge + ")");
		}

		//alert('Total Events: ' + result.getRowCount());
		// Ti.API.info('Total Events: ' + result.getRowCount());
		return result;
	};

	gsm.return_performances = function(/* Number */ event_id) {
		var result = joli.connection.execute("SELECT * FROM performances WHERE event_id = '" + event_id + "' AND date_time >= '" + date("Y-m-d") + "' ORDER BY date_time ASC ");
		// Ti.API.info('Found ' + result.getRowCount() + ' rows ');
		return result;
	};

	gsm.return_events_by_keyword = function(/* String */ keyword, /* Number */ start, /* Number */ limit) {
		if (!start) { start = 0; }
		if (!limit) { limit = 1000; }
		var result = joli.connection.execute("SELECT *, events.id as event_id FROM events WHERE name LIKE '%" + keyword + "%' OR venue_name LIKE '%" + keyword + "%' OR description LIKE '%" + keyword + "%' ORDER BY start_date ASC LIMIT " + limit);
		// Ti.API.info('Found ' + result.getRowCount() + ' rows ');
		return result;
	};

	gsm.return_event = function(/* Number */ id) {
		var result = joli.connection.execute("SELECT * FROM events WHERE id = '" + id + "' LIMIT 1");
		// Ti.API.info('Found ' + result.getRowCount() + ' rows ');
		return result;
	};

	gsm.return_stores = function( /* Integer */ category_id, /* Number */ start, /* Number */ limit ) {
		if (!start) { start = 0; }
		if (!limit) { limit = 1000; }
		var fudge = Math.pow(Math.cos((app.longitude * Math.PI / 180)),2);
		//var result = new joli.query().select().from('stores').join('categories_stores', 'categories_stores.store_id', 'stores.id').where('categories_stores.category_id = ?', category_id).where('display = ?', 'TRUE').order("(('" + app.latitude + "' - latitude) * (" + app.latitude + " - latitude) + (" + app.longitude + " - longitude) * (" + app.longitude + " - longitude) * " + fudge + ")"); // .limit(20);
		var result = joli.connection.execute("SELECT * FROM stores LEFT JOIN categories_stores ON categories_stores.store_id = stores.id WHERE categories_stores.category_id = '" + category_id + "' AND display = 'TRUE' ORDER BY (('" + app.latitude + "' - latitude) * (" + app.latitude + " - latitude) + (" + app.longitude + " - longitude) * (" + app.longitude + " - longitude) * " + fudge + ")");
		return result;
	};

	gsm.return_stores_near_me = function( /* Number */ start, /* Number */ limit ) {
		if (!start) { start = 0; }
		if (!limit) { limit = 1000; }
		var fudge = Math.pow(Math.cos((app.longitude * Math.PI / 180)),2);
		//var result = new joli.query().select().from('stores').where('display = ?', 'TRUE').order("(('" + app.latitude + "' - latitude) * (" + app.latitude + " - latitude) + (" + app.longitude + " - longitude) * (" + app.longitude + " - longitude) * " + fudge + ")").limit(100); // .limit(20);
		var result = joli.connection.execute("SELECT * FROM stores WHERE display = 'TRUE' ORDER BY (('" + app.latitude + "' - latitude) * (" + app.latitude + " - latitude) + (" + app.longitude + " - longitude) * (" + app.longitude + " - longitude) * " + fudge + ") LIMIT 30");
		return result;
	};


	gsm.return_stores_by_keyword = function( /* String */ keyword, /* Number */ start, /* Number */ limit) {
		if (!start) { start = 0; }
		if (!limit) { limit = 1000; }
 		var result = joli.connection.execute("SELECT * FROM stores WHERE  display = 'TRUE' AND  name LIKE '%" + keyword + "%' OR description LIKE '%" + keyword + "%' ORDER BY name ASC LIMIT " + limit);

		//fallback
		if (result.rowCount == 0){
			var words	=  keyword.split(" ");
			//
			if (words.length > 0){
				for (var i = 0; i < words.length; i++){

					var word = words[i];
					var result = joli.connection.execute("SELECT * FROM stores WHERE  display = 'TRUE' AND  name LIKE '%" + word + "%' OR description LIKE '%" + word + "%' ORDER BY name ASC LIMIT " + limit);
					if(result.rowCount > 0 ){
						break;
					} continue;

				}
			}
		}

		return result;
	};

	gsm.return_nearby_stores = function(/* Integer */ store_id, /* Number */ latitude, /* Number */ longitude) {
		if (!latitude) { latitude = app.latitude; }
		if (!longitude) { longitude = app.longitude; }

		var fudge = Math.pow(Math.cos((latitude * Math.PI / 180)),2);
		var result = joli.connection.execute("SELECT * FROM stores WHERE display = 'TRUE' AND id != " + store_id + " order by (('" + latitude + "' - latitude) * (" + latitude + " - latitude) + (" + longitude + " - longitude) * (" + longitude + " - longitude) * " + fudge + ") limit 10")


		return result;
	};

	gsm.return_nearby_stores_by_category = function(/* Number */ category_id, /* Number */ latitude, /* Number */ longitude) {
		if (!latitude) { latitude = app.latitude; }
		if (!longitude) { longitude = app.longitude; }

		var fudge = Math.pow(Math.cos((app.latitude * Math.PI / 180)),2);
		var result = joli.connection.execute("SELECT *, stores.id as store_id FROM stores LEFT JOIN categories_stores ON categories_stores.store_id = stores.id WHERE  categories_stores.category_id = '" + category_id + "' AND logo != '' AND stores.display = 'TRUE' order by (('" +latitude + "' - latitude) * (" + latitude + " - latitude) + (" + longitude + " - longitude) * (" + longitude + " - longitude) * " + fudge + ") limit 10")
		return result;
	};

	gsm.return_store_offers = function(/* Integer */ store_id) {
		var result = joli.connection.execute("SELECT * FROM offers LEFT JOIN offers_stores ON offers.id = offers_stores.offer_id JOIN stores ON offers_stores.store_id = stores.id WHERE stores.id = '" + store_id + "'");
		return result;
	};

	gsm.return_stores_hot = function() {
		var fudge = Math.pow(Math.cos((app.longitude * Math.PI / 180)),2);
		var result = joli.connection.execute("SELECT * FROM stores WHERE featured_until >= '" + date('Y-m-d') + "' order by (('" + app.latitude + "' - latitude) * (" + app.latitude + " - latitude) + (" + app.longitude + " - longitude) * (" + app.longitude + " - longitude) * " + fudge + ")");
		return result;
	};

	gsm.return_stores_hot_count = function() {
		var result = joli.connection.execute("SELECT * FROM stores WHERE featured_until >= '" + date('Y-m-d') + "'");
		var count = result.getRowCount();
		result.close();
		return count;
	};

	gsm.return_special_offers = function(/* Number */ store_id) {
		var fudge = Math.pow(Math.cos((app.longitude * Math.PI / 180)),2);
		if (store_id !== undefined) {
			var result = joli.connection.execute("SELECT *, stores.id as store_id, offers.id as offers_id, offers.name as offer_description FROM offers LEFT JOIN offers_stores ON offers.id = offers_stores.offer_id JOIN stores ON offers_stores.store_id = stores.id WHERE stores.id = '" + store_id + "' AND offers.end_date >= '" + date('Y-m-d') + "' GROUP BY stores.id order by offers.end_date ASC");
			return result;
		} else{
			var result = joli.connection.execute("SELECT *, stores.id as store_id, offers.id as offers_id, offers.name as offer_description FROM offers LEFT JOIN offers_stores ON offers.id = offers_stores.offer_id JOIN stores ON offers_stores.store_id = stores.id WHERE offers.end_date >= '" + date('Y-m-d') + "' GROUP BY stores.id  order by stores.name ASC");
			return result;
		}

	};

	gsm.get_special_offers = function()
	{
		new joli.query().destroy().from('offers_stores').execute();
		new joli.query().destroy().from('offers').execute();

		var xhr = Titanium.Network.createHTTPClient();
		xhr.timeout = 30000;
		xhr.onerror = function() {};

		xhr.onload = function()
		{
			if(platform != "Android"){
			var response = JSON.parse(this.responseData);
			} else {
			var response = JSON.parse(this.responseText);
			}


			Ti.API.info('begin 290');
			joli.connection.execute("BEGIN IMMEDIATE TRANSACTION;");

			// Loop through categories
			for (var i = 0, j = response.offer.length; i < j; i++)
			{
				var offer = response.offer[i];

				var result = offers.newRecord({
					id : offer.offerId,
					name : offer.name,
					start_date : gsm.convert_date(offer.startDate),
					end_date : gsm.convert_date(offer.endDate),
					last_modified : gsm.convert_date(offer.attributes.lastModified)
				});
				result.save();

				var result = offers_stores.newRecord({
					id : offer.offerId + '_' + offer.storeId,
					offer_id : offer.offerId,
					store_id : offer.storeId
				});
				result.save();


			}
			Ti.API.info('commit 316');
			joli.connection.execute("COMMIT;");

		};

		xhr.open('GET', gsm.special_offers, true);
		xhr.send();
	};

	gsm.return_special_offers_count = function() {
		var result = joli.connection.execute("SELECT *, stores.id as store_id, offers.id as offers_id, offers.name as offer_description FROM offers LEFT JOIN offers_stores ON offers.id = offers_stores.offer_id JOIN stores ON offers_stores.store_id = stores.id WHERE offers.end_date >= '" + date('Y-m-d') + "' GROUP BY stores.id  order by stores.name ASC");
		var count = result.getRowCount();
		result.close();
		return count;
	};



	gsm.return_transportation = function(/* String */ type) {
		var result = new joli.query().select().from('transport').where('type = ?', type);
		return result.execute();
	}

	gsm.return_store_images = function( /* Integer */ store_id ) {
		var result = new joli.query().select().from('images').where('store_id = ?', store_id);
		return result.execute();
	};

	gsm.return_store = function( /* Integer */ store_id ) {
		var result = new joli.query().select().from('stores').where('stores.id = ?', store_id).limit(1);
		return result.execute()[0];
	};

	gsm.return_store_categories = function(store_id) {

		var q = joli.connection.execute("SELECT categories.* FROM categories JOIN categories_stores on categories.id = categories_stores.category_id WHERE categories_stores.store_id = "+store_id);
		var result = [];
		while(q.isValidRow()) {
			result.push({
				id: q.fieldByName('id'),
				name: q.fieldByName('name')
			});
			q.next();
		}
		return result;
	}

	gsm.refresh_category_result_count = function() {
		var categories = gsm.return_categories();

		for (var i=0,j=categories.length;i<j;i++) {
			var category = categories[i];

			var results = joli.connection.execute("SELECT * FROM stores LEFT JOIN categories_stores ON categories_stores.store_id = stores.id WHERE categories_stores.category_id = '" + category.id + "' AND display = 'TRUE' GROUP BY stores.id");
			results.getRowCount();
			// Now update the categories table
			var update = new joli.query().update('categories').set({result_count: results.getRowCount()}).where('id = ?', category.id).execute();

			results.close();
		}
		try {
			categories.close();
		} catch(e) {}

	};

	gsm.clear_database = function() {
		new joli.query().destroy().from('adverts').execute();
		new joli.query().destroy().from('categories_stores').execute();
		new joli.query().destroy().from('categories').execute();
		new joli.query().destroy().from('events_categories').execute();
		new joli.query().destroy().from('events').execute();
		new joli.query().destroy().from('highlights').execute();
		new joli.query().destroy().from('images').execute();
		new joli.query().destroy().from('offers_stores').execute();
		new joli.query().destroy().from('offers').execute();
		new joli.query().destroy().from('performances').execute();
		new joli.query().destroy().from('stores').execute();

		Titanium.App.Properties.setString('lastUpdate', 'never');
		Titanium.App.Properties.setString('lastUpdateEventsCategories', 'never');
		Titanium.App.Properties.setString('lastUpdateCategories', 'never');
		Titanium.App.Properties.setString('lastUpdateEvents', 'never');
		Titanium.App.Properties.setString('lastUpdatePerformances', 'never');
		Titanium.App.Properties.setString('lastUpdateHighlights', 'never');
	};

	gsm.drop_database = function() {
		joli.connection.execute("DROP TABLE IF EXISTS stores");
		joli.connection.execute("DROP TABLE IF EXISTS adverts");
		joli.connection.execute("DROP TABLE IF EXISTS categories_stores");
		joli.connection.execute("DROP TABLE IF EXISTS categories");
		joli.connection.execute("DROP TABLE IF EXISTS events_categories");
		joli.connection.execute("DROP TABLE IF EXISTS events");
		joli.connection.execute("DROP TABLE IF EXISTS highlights");
		joli.connection.execute("DROP TABLE IF EXISTS images");
		joli.connection.execute("DROP TABLE IF EXISTS offers_stores");
		joli.connection.execute("DROP TABLE IF EXISTS offers");
		joli.connection.execute("DROP TABLE IF EXISTS performances");
	};

	gsm.update = function() {

		gsm.actInd.setMessage('Updating Application');
		gsm.show_loading();

		setTimeout(function() {
			Ti.API.info("Hiding loader after failsafe timeout")
			gsm.hide_loading();
		}, 90000);

		try {
			var xhr = Titanium.Network.createHTTPClient();
			xhr.timeout = 30000;
			xhr.onerror = function() {
				Ti.API.info('ERROR ');
				gsm.update_highlights();
			};
			xhr.onload = function() {

				try {
					if(platform != "Android"){
						var response = JSON.parse(this.responseData);
					} else {
						var response = JSON.parse(this.responseText);
					}
				} catch(e) {
					Ti.API.info('ERROR parsing update JSON');
					gsm.update_highlights();
				}

				var type;
				//response = response.getUpdatesResponse;

				// Ti.API.info('response: '+JSON.stringify(response));

				try {
					if (response.categories) {
						// Loop through categories
						Ti.API.info('begin 438');

						joli.connection.execute("BEGIN IMMEDIATE TRANSACTION;");

						for (var i = 0, j = response.categories.category.length; i < j; i++) {
							var category = response.categories.category[i];
							try {
								display = category.display;
								// if no category,
								if (category.name == undefined){
									type = 'deleted';
									category_name = 'Deleted';
									display = "FALSE";

								} else {
									var category_name = category.name;

									if (category_name.charAt( category_name.length-1 ) == '.' || category_name.charAt( 0 ) == '.') {
										if (category_name.charAt( category_name.length-1 ) == '.') {
											category_name = category_name.substr(0, category_name.length-1);
										} else {
											category_name = category_name.substr(1, category_name.length);
										}
										type = 'hidden';
										display = "FALSE";

									} else if (category_name.indexOf("Hide - ") != -1) {
										type = 'hidden';
										display = "FALSE";

									} else if (category_name.indexOf("Shops - ") != -1) {
										type = 'shopping';

									} else if (category_name.indexOf("FD - ") != -1) {
										type = 'food_drink';

									} else {
										type = 'lifestyle';
									}
									category_name = category_name.replace("Shops - ", '');
									category_name = category_name.replace("FD - ", '');
									category_name = category_name.replace("Hide - ", '');
								}

								joli.connection.execute('REPLACE INTO categories (id, last_modified, display, name, type) VALUES('+category.attributes.id+', \
								                        	"'+gsm.convert_date(category.attributes.lastModified)+'", \
								                        	"'+display+'", \
								                        	"'+category_name+'", \
								                        	"'+type+'");'
								                        );

							} catch(e) {
								Ti.API.info('Category Error: ' + e);
							}
						}
						Ti.API.info('commit 473');

						joli.connection.execute("COMMIT;");
					}

				} catch(e) {
					Ti.API.info('Category Error: ' + e);
					joli.connection.execute("COMMIT;");
				}

				// Loop through stores
				if (response.stores && typeof response.stores === "object") {
					Ti.API.info('begin 482');
					joli.connection.execute("BEGIN IMMEDIATE TRANSACTION;");

					for (var i = 0, j = response.stores.store.length; i < j; i++) {
						var store = response.stores.store[i];

							if (store.display == 'FALSE')
							{
								try {
									joli.connection.execute("DELETE FROM stores WHERE store_id = " + store.storeId);
								} catch(e) {}
							}
							else
							{
								try {
									var locations = store.location.split(',');

									var result = stores.newRecord({
										id : store.storeId,
										last_modified : gsm.convert_date(store.attributes.lastModified),
										store_id : store.storeId,
										display : store.display,
										name : store.name,
										tags : store.tags,
										featured_until : gsm.convert_date(store.featuredUntil),
										description : store.desc,
										location : store.location,
										latitude : locations[0].replace(" ",""),
										longitude : locations[1].replace(" ",""),
										address : store.address,
										phone : store.phone,
										fax : store.fax,
										email : store.email,
										website : store.websiteUrl,
										logo : store.logoUrl
									});
									result.save();


									// Associate with categories
									if ( typeof store.categoryIds.categoryId == "object") {

										// Loop through the array
										// Ti.API.info("Category object length" + store.categoryIds.categoryId.length);
										for (var ii = 0, jj = store.categoryIds.categoryId.length; ii < jj; ii++) {

											var category = store.categoryIds.categoryId[ii];
											// For this store, associate with categories & offers
											var result = categories_stores.newRecord({
												id : category + '_' + store.storeId,
												category_id : category,
												store_id : store.storeId
											});
											result.save();
										}
									} else {
										// Ti.API.info("Category length" + store.categoryIds.categoryId.length);
										// Check if it has a value worth storing
										if (store.categoryIds.categoryId.length > 0) {
											var result = categories_stores.newRecord({
												id : store.categoryIds.categoryId + '_' + store.storeId,
												category_id : store.categoryIds.categoryId,
												store_id : store.storeId
											});
											result.save();
										}
									}

									try {
										var offer;

										if (store.offers.offer.offerId) {
											offer = store.offers.offer;

											//alert(offer);
											// Single object
											var result = offers.newRecord({
													id : offer.offerId,
													name : offer.name,
													start_date : gsm.convert_date(offer.startDate),
													end_date : gsm.convert_date(offer.endDate),
													last_modified : gsm.convert_date(offer.attributes.lastModified)
												});
												result.save();

												var result = offers_stores.newRecord({
													id : offer.offerId + '_' + store.storeId,
													offer_id : offer.offerId,
													store_id : store.storeId
												});
												result.save();

										} else if (store.offers.offer.length > 1) {
											for (var iii = 0, jjj = store.offers.offer.length; iii < jjj; iii++) {
												offer = store.offers.offer[iii];

												//alert(offer);

												var result = offers.newRecord({
													id : offer.offerId,
													name : offer.name,
													start_date : gsm.convert_date(offer.startDate),
													end_date : gsm.convert_date(offer.endDate),
													last_modified : gsm.convert_date(offer.attributes.lastModified)
												});
												result.save();

												var result = offers_stores.newRecord({
													id : offer.offerId + '_' + store.storeId,
													offer_id : offer.offerId,
													store_id : store.storeId
												});
												result.save();
											}
										}
									} catch(e) {}

									if ( typeof store.imageUrls.imageUrl == "object") {

										// Loop through the array
										// Ti.API.info("Image object length" + store.imageUrls.imageUrl.length);
										for (var iiii = 0, jjjj = store.imageUrls.imageUrl.length; iiii < jjjj; iiii++) {

											var image = store.imageUrls.imageUrl[iiii];
											// For this store, associate with categories & offers
											var result = images.newRecord({
												location : image,
												store_id : store.storeId
											});
											result.save();
										}
									} else {
										// Ti.API.info("Image length" + store.imageUrls.imageUrl.length);
										// Check if it has a value worth storing
										if (store.imageUrls.imageUrl.length > 0) {
											var result = images.newRecord({
												location : store.imageUrls.imageUrl,
												store_id : store.storeId
											});
											result.save();
										}
									}
								} catch(e) {
									// Error
								}
							}
					}

					gsm.doneList();
					Ti.API.info('commit 639');
	 				joli.connection.execute("COMMIT;");
	 				gsm.update_highlights();
				} else {
					Ti.API.info('No stores to do, moving on.');

					Titanium.App.Properties.setString('lastUpdate', date('Y-m-d'));
					gsm.refresh_category_result_count();
					Ti.API.info('Changed updated date to ' + Titanium.App.Properties.getString('lastUpdate', app.dbInstallDateYMD));

					gsm.doneList();
	 				gsm.update_highlights();
				}


				// Since we've got lots of new results, we should update the counts to make sure they are accurate
				Titanium.App.Properties.setString('lastUpdate', date('Y-m-d'));
				gsm.refresh_category_result_count();
				Ti.API.info('Changed updated date to ' + Titanium.App.Properties.getString('lastUpdate', app.dbInstallDateYMD));
			};

			var update_url = gsm.update_url;

			// Find out if we need to update, generally not in the same day
			if (Titanium.App.Properties.getString('lastUpdate', app.dbInstallDateYMD) === 'never') {
				// update_url = update_url.replace('&lastModified=', '');
				update_url = update_url + app.dbInstallDateYMD + '&today='+date('Y-m-d');
			} else {

				if (Titanium.App.Properties.getString('lastUpdate', app.dbInstallDateYMD) != date('Y-m-d')) {
					update_url = update_url + Titanium.App.Properties.getString('lastUpdate', app.dbInstallDateYMD) + '&today='+date('Y-m-d');

				} else {

					gsm.doneList();
					gsm.update_highlights();
	 				return false;
				}

			}

			Ti.API.info('Update URL was:' + update_url);

			xhr.open('POST', update_url, false);

			xhr.send();
		} catch(e) {
			gsm.update_highlights();
		}
	};

	gsm.update_list_categories = function () {
		try {
			var xhr = Titanium.Network.createHTTPClient();
			xhr.timeout = 30000;

			xhr.onerror = function() {
				Ti.API.info('ERROR ');
				gsm.doneList();
			};

			xhr.onload = function() {
				gsm.actInd.setMessage('Updating Application');
				// gsm.show_loading();

				if(platform != "Android"){
				var response = JSON.parse(this.responseData);
				} else {
				var response = JSON.parse(this.responseText);
				}

				//response = response.getUpdatesResponse;
				Ti.API.info('begin 680');
				joli.connection.execute("BEGIN IMMEDIATE TRANSACTION;");

				// Loop through categories
				for (var i = 0, j = response.row.length; i < j; i++) {
					var category = response.row[i];
					try {
						var result = categories.newRecord({
							id : category.CategoryID,
							display : 'TRUE',
							name : category.Name,
							group_id: category.CategoryGroupID,
							type : 'list'
						});
						result.save();
						// Ti.API.info('Saved a category');
					} catch(e) {
						// Ti.API.info(e);
					}
				}

				Ti.API.info('begin 703');
				joli.connection.execute("COMMIT;");

				Titanium.App.Properties.setString('lastUpdateCategories', date('Y-m-d'));

				gsm.doneList();

				// gsm.hide_loading();
				// gsm.actInd.setMessage('Loading');
			};

			var update_url = gsm.categories_url;

			// Find out if we need to update, generally not in the same day
			if (Titanium.App.Properties.getString('lastUpdateCategories', app.dbInstallDateYMD) === 'never') {
				// update_url = update_url.replace('&lastModified=', '');
				update_url = update_url + app.dbInstallDateYMD;
			} else{
				if (Titanium.App.Properties.getString('lastUpdateCategories', app.dbInstallDateYMD) != date('Y-m-d')) {
					update_url = update_url + Titanium.App.Properties.getString('lastUpdateCategories', app.dbInstallDateYMD);

				} else{
					gsm.doneList();
					return false;
				}
			}

			Ti.API.info('Update URL was:' + update_url);

			xhr.open('POST', update_url, false);
			//xhr.setRequestHeader('token', z.user.token);
			xhr.send();
		} catch(e) {
			gsm.doneList();
		}
	};





	gsm.update_list_events_categories = function () {
		try {
			var xhr = Titanium.Network.createHTTPClient();
			xhr.timeout = 30000;
			xhr.onerror = function() {
				Ti.API.info('ERROR ');
				gsm.update_gallery();
			};
			xhr.onload = function() {
				// gsm.actInd.setMessage('Updating Application');
				// gsm.show_loading();

				if(platform != "Android"){
				var response = JSON.parse(this.responseData);
				} else {
				var response = JSON.parse(this.responseText);
				}

				var type;
				//response = response.getUpdatesResponse;
				Ti.API.info('begin 751');
				joli.connection.execute("BEGIN IMMEDIATE TRANSACTION;");

				// Loop through categories

				for (var i = 0, j = response.row.length; i < j; i++) {
					var relationship = response.row[i];
					try {

						var result = events_categories.newRecord({
							id : relationship.EventCategoryID,
							event_id : relationship.EventID,
							category_id: relationship.CategoryID
						});
						result.save();
						// Ti.API.info('Saved a category');
					} catch(e) {

					}
					gsm.doneList();
				}
				Ti.API.info('commit 772');
				joli.connection.execute("COMMIT;");
				gsm.update_gallery();
				Titanium.App.Properties.setString('lastUpdateEventsCategories', date('Y-m-d'));

				// gsm.hide_loading();
				// gsm.actInd.setMessage('Loading');
			};

			var update_url = gsm.events_categories_url;

			// Find out if we need to update, generally not in the same day
			if (Titanium.App.Properties.getString('lastUpdateEventsCategories', app.dbInstallDateYMD) === 'never') {
				// update_url = update_url.replace('&lastModified=', '');
				update_url = update_url + app.dbInstallDateYMD;
			} else{
				if (Titanium.App.Properties.getString('lastUpdateEventsCategories', app.dbInstallDateYMD) != date('Y-m-d')) {
					// Else check if it was more than one week ago

					if (gsm.daysBetween(Date.parse(Titanium.App.Properties.getString('lastUpdateEventsCategories', app.dbInstallDateYMD)), Date.parse('today')) > 7) {
						update_url = update_url + Titanium.App.Properties.getString('lastUpdateEventsCategories', app.dbInstallDateYMD);
					}

				} else{
					gsm.doneList();
					gsm.update_gallery();
					return false;
				}
			}

			Ti.API.info('Update URL was:' + update_url);

			xhr.open('POST', update_url, false);
			//xhr.setRequestHeader('token', z.user.token);
			xhr.send();
		} catch(e) {
			gsm.update_gallery();
		}
	};

	gsm.update_list_events = function () {
		try {
			var xhr = Titanium.Network.createHTTPClient();
			xhr.timeout = 30000;
			xhr.onerror = function() {
				Ti.API.info('ERROR ');
				gsm.update_list_events_categories();
			};
			xhr.onload = function() {

				// gsm.show_loading();

				if(platform != "Android"){
				var response = JSON.parse(this.responseData);
				} else {
				var response = JSON.parse(this.responseText);
				}
				//response = response.getUpdatesResponse;


				// Loop through events
				try {
					// gsm.actInd.setMessage('Updating Application');
					Ti.API.info('begin 824');
					joli.connection.execute("BEGIN IMMEDIATE TRANSACTION;");

					for (var i = 0, j = response.row.length; i < j; i++) {
						var event = response.row[i];
						try {

							var locations = event.Map.split(',');

							var result = events.newRecord({
								id : event.EventID,
								venue_id : event.VenueID,
								name : event.Name,
								sort_name : event.SortName,
								start_date : gsm.convert_date(event.StartDateTime),
								end_date : gsm.convert_date(event.EndDateTime),
								expiry_date : gsm.convert_date(event.ExpiryDateTime),
								duration : event.Duration,
								description : event.Description,
								description_is_html : event.DescriptionIsHTML,
								additional_details : event.AddtionalDetails,
								image_url : event.ImageUrl,
								thumbnail_image_url : event.ThumbnailImageUrl,
								performance_space : event.PerformanceSpace,
								has_other_venues : event.HasOtherVenues,
								is_free : event.IsFree,
								is_cancelled : event.IsCancelled,
								ticket_prices : event.TicketPrices,
								created_on : gsm.convert_date(event.CreatedOn),
								modified_on : gsm.convert_date(event.ModifiedOn),
								ticket_url : event.TicketUrl,
								venue_name : event.VenueName,
								address : event.Address,
								town : event.Town,
								postcode : event.Postcode,
								telephone : event.Telephone,
								email : event.Email,
								website : event.Website,
								location : event.Map,
								latitude : locations[0].replace(" ",""),
								longitude : locations[1].replace(" ",""),
								details : event.Details
							});
							result.save();
							// Ti.API.info('Saved event');
						} catch(e) {
							Ti.API.info(e);
						}

					}
					Ti.API.info('commit 874');
					joli.connection.execute("COMMIT;");
					gsm.update_list_events_categories();

					Titanium.App.Properties.setString('lastUpdateEvents', date('d-m-Y'));

					// gsm.hide_loading();
					// gsm.actInd.setMessage('Loading');

				} catch(e) {
					joli.connection.execute("COMMIT;");
					gsm.update_list_events_categories();
					// gsm.hide_loading();
					// gsm.actInd.setMessage('Loading');
				}

			};

			var update_url = gsm.events_url;

			// Find out if we need to update, generally not in the same day
			if (Titanium.App.Properties.getString('lastUpdateEvents', app.dbInstallDateDMY) === 'never') {
				// update_url = update_url.replace('&lastModified=', '');
				update_url = update_url + app.dbInstallDateDMY;
			} else{
				if (Titanium.App.Properties.getString('lastUpdateEvents', app.dbInstallDateDMY) != date('d-m-Y')) {
					update_url = update_url + Titanium.App.Properties.getString('lastUpdateEvents', app.dbInstallDateDMY);
				} else{
					gsm.update_list_events_categories();
					return false;
				}
			}

			Ti.API.info('Update URL was:' + update_url);

			xhr.open('POST', update_url, false);
			//xhr.setRequestHeader('token', z.user.token);
			xhr.send();
		} catch(e) {
			gsm.update_list_events_categories();
		}
	};

	gsm.update_performances = function () {
		try {
			var xhr = Titanium.Network.createHTTPClient();
			xhr.timeout = 30000;
			xhr.onerror = function() {
				Ti.API.info('ERROR ');
				gsm.update_list_events();
			};
			xhr.onload = function() {
				// gsm.actInd.setMessage('Updating Application');
				// gsm.show_loading();

				if(platform != "Android"){
				var response = JSON.parse(this.responseData);
				} else {
				var response = JSON.parse(this.responseText);
				}
				var type;
				//response = response.getUpdatesResponse;


				// Loop through categories
				try {
					Ti.API.info(JSON.stringify(response));
					Ti.API.info('begin 70');
					joli.connection.execute("BEGIN IMMEDIATE TRANSACTION;");

					for (var i = 0, j = response.row.length; i < j; i++) {
						var record = response.row[i];
						try {

							var result = performances.newRecord({
								id : record.PerformanceID,
								event_id : record.EventID,
								venue_id: record.VenueID,
								supplier_ref: record.SupplierRef,
								date_time: gsm.convert_date(record.DateTime),
								date_only: record.DateOnly,
								duration: record.Duration,
								performance_space: record.PerformanceSpace,
								is_cancelled: record.IsCancelled,
								ticket_prices: record.TicketPrices,
								created_on: gsm.convert_date(record.CreatedOn),
								modified_on: gsm.convert_date(record.ModifiedOn)
							});
							result.save();
							// Ti.API.info('Saved a performance');
						} catch(e) {
							Ti.API.info('erearsda');
							Ti.API.info(e);
						}

					}

					Ti.API.info('commit 999');
					joli.connection.execute("COMMIT;");
					gsm.update_list_events();

				} catch (e) {
					Ti.API.info(e);
					joli.connection.execute("COMMIT;");
				}

				Titanium.App.Properties.setString('lastUpdatePerformances', date('d-m-Y'));
				gsm.update_list_events();

				// gsm.hide_loading();

			};

			var update_url = gsm.performances_url;

			// Find out if we need to update, generally not in the same day
			if (Titanium.App.Properties.getString('lastUpdatePerformances', app.dbInstallDateDMY) === 'never') {
				// update_url = update_url.replace('&lastModified=', '');
				update_url = update_url +  app.dbInstallDateDMY;
			} else{
				if (Titanium.App.Properties.getString('lastUpdatePerformances', app.dbInstallDateDMY) != date('d-m-Y')) {
					update_url = update_url + Titanium.App.Properties.getString('lastUpdatePerformances', app.dbInstallDateDMY);
				} else{
					gsm.update_list_events();
					return false;
				}
			}

			Ti.API.info('Update URL was:' + update_url);

			xhr.open('POST', update_url, false);
			//xhr.setRequestHeader('token', z.user.token);
			xhr.send();
		} catch(e) {
			gsm.update_list_events();
		}
	};

	gsm.update_highlights = function () {
		try {
			var xhr = Titanium.Network.createHTTPClient();
			xhr.timeout = 30000;
			xhr.onerror = function() {
				Ti.API.info('ERROR update_highlights');
				gsm.update_performances();
			};
			xhr.onload = function() {
				// gsm.actInd.setMessage('Updating Application');
				// gsm.show_loading();

				if(platform != "Android"){
					var response = JSON.parse(this.responseData);
				} else {
					var response = JSON.parse(this.responseText);
				}
				//response = response.getUpdatesResponse;

				joli.connection.execute("DELETE FROM highlights");

				//joli.connection.execute("BEGIN IMMEDIATE TRANSACTION");
				try {
					// Loop through categories
					for (var i = 0, j = response.event.length; i < j; i++) {
						var highlight = response.event[i];
						try {
							var result = highlights.newRecord({
								id : highlight.attributes.id,
								publish_date : gsm.convert_date(highlight.attributes.publishDate),
								expiry_date : gsm.convert_date(highlight.attributes.expireDate),
								title : highlight.heroTitle,
								description : highlight.heroDesc,
								link : highlight.heroLink.attributes.url,
								image : highlight.heroImage.attributes.src,
								thumbnail_title : highlight.tnTitle,
								thumbnail_image : highlight.tnImage.attributes.src
							});
							result.save();
							// Ti.API.info('Saved a highlight');
						} catch(e) {
							Ti.API.info(e);
						}

					}
					Titanium.App.Properties.setString('lastUpdateHighlights', date('Y-m-d'));

				} catch (e) {

				}
				// gsm.hide_loading();
				gsm.update_performances();

			};

			var update_url = gsm.highlights_url;

			// Find out if we need to update, generally not in the same day
			if (Titanium.App.Properties.getString('lastUpdateHighlights', app.dbInstallDateYMD) === 'never') {
				// update_url = update_url.replace('&lastModified=', '');
				update_url = update_url + app.dbInstallDateYMD;
			} else{
				if (Titanium.App.Properties.getString('lastUpdateHighlights', app.dbInstallDateYMD) != date('Y-m-d')) {
					update_url = update_url + Titanium.App.Properties.getString('lastUpdateHighlights', app.dbInstallDateYMD);
				} else{
					gsm.update_performances();
					return false;
				}
			}

			Ti.API.info('Update URL was:' + update_url);

			xhr.open('POST', update_url, false);
			//xhr.setRequestHeader('token', z.user.token);
			xhr.send();
		} catch(e) {
			gsm.update_performances();
		}
	};

	gsm.get_xml_value = function( /* XML Node */ node ) {
		try {
			return node.text;
		} catch(e) {
			return null;
		}
	};


	gsm.update_gallery = function(callback) {
		try {
			var xhr = Titanium.Network.createHTTPClient();
			xhr.timeout = 30000;
			xhr.onerror = function() {
				Ti.API.info('ERROR ');
				gsm.update_styles();
			};
			xhr.onload = function() {


				if(platform != "Android"){
				var response = JSON.parse(this.responseData);
				} else {
				var response = JSON.parse(this.responseText);
				}

				try {
					joli.connection.execute("DELETE FROM galleries;");
					Ti.API.info('begin 1075');
					joli.connection.execute("BEGIN IMMEDIATE TRANSACTION;");

					for (var i = 0; i < response.length; i++) {
						var result = galleries.newRecord({
							id: response[i].id,
							url: response[i].url,
							marker: response[i].marker,
							title: response[i].title,
							description: response[i].description,
							sort: response[i].sort,
							lat: response[i].lat,
							lng: response[i].lng,
							homepage: response[i].homepage
						});
						result.save();
					}

					joli.connection.execute("COMMIT ;");
					Ti.API.info('commit 1094');
					gsm.update_styles();

					// Map marker images

					// Make sure our folder exists
					var dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory+'marker_images');
					if (!dir.exists()) {
						Ti.API.info('Making marker_images directory:'+dir.nativePath);
						dir.createDirectory();
					}

					var markers = new joli.query().select().from('galleries').execute();
					var keep_files = [];

					for (var i = 0; i < markers.length; i++) {
						var filename = markers[i].marker.split('/')[ markers[i].url.split('/').length-1 ];
						if (platform === 'Android') {
							filename = 'android_'+filename;
							markerUrl = markers[i].marker.replace('markers/', 'markers/android_');
						} else {
							markerUrl = markers[i].marker;
						}

						var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory+'marker_images', filename);
						if (!file.exists()) {
							// Ti.API.info('Download marker: '+filename);
							gsm.download_marker_image(Ti.Filesystem.applicationCacheDirectory+'marker_images', filename, markerUrl);
						}
					}

					// Homepage images...

					// Make sure our folder exists
					var dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory+'homepage_images');
					if (!dir.exists()) {
						Ti.API.info('Making homepage_images directory:'+dir.nativePath);
						dir.createDirectory();
					}

					// Update the images to cache for the homepage background
					var homepage = new joli.query().select().from('galleries').where('homepage = ?', 1).execute();
					var keep_files = [];

					for (var i = 0; i < homepage.length; i++) {
						var filename = homepage[i].url.split('/')[ homepage[i].url.split('/').length-1 ];
						keep_files.push(filename);

						var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory+'homepage_images', filename);
						if (!file.exists()) {
							Ti.API.info('Download: '+filename);

							gsm.download_homepage_image(Ti.Filesystem.applicationCacheDirectory+'homepage_images', filename, homepage[i].url);
						}
					}

					// Remove old ones
					var dir = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory+'homepage_images');
					var dirItems = dir.getDirectoryListing();

					for (var i = 0; i < dirItems.length; i++) {
						Ti.API.info('Checking for: '+dirItems[i]+': '+keep_files.indexOf(dirItems[i]));
						if (keep_files.indexOf(dirItems[i]) === -1) {
							Ti.API.info('Deleting: '+dirItems[i]);
							var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationCacheDirectory+'homepage_images', dirItems[i]);
							file.deleteFile()
						}
					}

					gsm.doneCount++;

				} catch(e) {
					Ti.API.info('update_gallery error: '+e);
				}

				if (callback) callback();
			}

			xhr.open('POST', gsm.gallery_url, false);
			//xhr.setRequestHeader('token', z.user.token);
			xhr.send();
		} catch(e) {
			gsm.update_styles();
		}
	}

	gsm.download_homepage_image = function(filepath, filename, url) {

		var xhr = Titanium.Network.createHTTPClient();
		xhr.timeout = 30000;
		xhr.onerror = function() {
			Ti.API.info('ERROR downloading: '+url);
		};
		xhr.onload = function() {
			// Atanas: Android crashing bug fix
			// https://jira.appcelerator.org/browse/TIMOB-13138
			var file = Ti.Filesystem.getFile(filepath, filename);
			file.write( xhr.responseData );
		};

		xhr.open('GET', url);

		xhr.send();
	}

	gsm.download_marker_image = function(filepath, filename, url) {

		var xhr = Titanium.Network.createHTTPClient();
		xhr.timeout = 30000;
		xhr.onerror = function() {
			Ti.API.info('ERROR downloading: '+url);
		};
		xhr.onload = function() {
			// Atanas: Android crashing bug fix
			// https://jira.appcelerator.org/browse/TIMOB-13138
			var file = Ti.Filesystem.getFile(filepath, filename);
			file.write( xhr.responseData );

			joli.connection.execute('UPDATE galleries SET marker = "'+filepath+'/'+filename+'" WHERE marker = "'+url+'";');
		};

		xhr.open('GET', url, true);

		xhr.send();
	}

	gsm.get_gallery = function( for_map ) {
		return new joli.query().select().from('galleries').order( for_map ? 'lat DESC' : 'sort ASC' ).execute();
	}

	gsm.get_homepage_image = function() {
		var dir = Ti.Filesystem.getFile( Ti.Filesystem.applicationCacheDirectory + 'homepage_images' );

		if (! dir.exists() ) {
			Ti.API.info(gsm.default_homepage_image);
			return gsm.default_homepage_image;
		}

		var dirItems_str = dir.getDirectoryListing();
		if (dirItems_str !== null) var dirItems = dirItems_str.toString().split(',');

		if (!dirItems || dirItems.length == 0) {
			Ti.API.info(gsm.default_homepage_image);
			return gsm.default_homepage_image;
		}

		var imagePath = Ti.Filesystem.applicationCacheDirectory+'homepage_images'+Ti.Filesystem.separator + dirItems[Math.floor(Math.random()*dirItems.length)];
		Ti.API.info('imagePath: '+imagePath);

		if (platform == 'Android') {
			var file = Ti.Filesystem.getFile(imagePath);
			var ret = file.resolve();
		} else {
			var ret = imagePath;
		}
		return ret;
	}

	gsm.update_styles = function(callback, errorCallback) {
		// SMS rebrand styles don't get updated, mmk?
		if (rebrand == 'sms') {
			if (callback) callback();
			gsm.hide_loading();
			return;
		}

		try {
			var xhr = Titanium.Network.createHTTPClient();
			xhr.timeout = 30000;
			xhr.onerror = function() {
				Ti.API.info('ERROR fetching styles.');
				if (errorCallback) errorCallback();
				gsm.hide_loading();
			};
			xhr.onload = function() {

				if (platform != "Android") {
					var styles = JSON.parse(this.responseData);
				} else {
					var styles = JSON.parse(this.responseText);
				}

				try {
					for (name in styles) {
						joli.connection.execute('DELETE FROM styles WHERE name = "'+name+'"');
						joli.connection.execute('INSERT INTO styles (`name`, `value`) VALUES("'+name+'", "'+styles[name]+'")');
						// Ti.API.info('Saved style: '+name+' = '+styles[name]);
					}
					gsm.hide_loading();

				} catch(e) {
					Ti.API.info('update_styles error: '+e);
				}

				if (callback) callback();
			};

			xhr.open('GET', gsm.styles_url, false);
			xhr.send();
		} catch(e) {
			gsm.hide_loading();
		}
	}


	gsm.doneCount = 0;

	gsm.doneList = function(){
		gsm.doneCount++;
		if(gsm.doneCount >= 4){
			// gsm.hide_loading();
		}
	}

	/*
	gsm.update_xml = function() {
		var xhr = Titanium.Network.createHTTPClient();
		xhr.timeout = 30000;
		xhr.onerror = function() {
			Ti.API.info('ERROR ');
		};
		xhr.onload = function() {
			//var response = JSON.parse(this.responseText);
			var response = this.responseXML.documentElement;

			// Loop through categories
			var xml_categories = response.getElementsByTagName("category");

			for (var i=0,j=xml_categories.length;i<j;i++) {
				var category = xml_categories.item(i);

				try {
					var result = categories.newRecord({
						id : category.getElementsByTagName("categoryId").item(0).text,
						last_modified : category.getAttribute("lastModified"),
						display : category.getElementsByTagName("display").item(0).text,
						name : category.getElementsByTagName("name").item(0).text
					});
				} catch(e) {
					try {
						var result = categories.newRecord({
							id : category.getElementsByTagName("categoryId").item(0).text,
							last_modified : category.getAttribute("lastModified"),
							display : category.getElementsByTagName("display").item(0).text
						});
					} catch(e) {
					}
				}


				result.save();
				Ti.API.info('Saved a category');
				category = null;
			}

			var xml_stores = response.getElementsByTagName("store");
			// Loop through stores
			for (var i=0,j=xml_stores.length;i<j;i++) {

				var store = xml_stores.item(i);

				var result = stores.newRecord({
					id : gsm.get_xml_value(store.getElementsByTagName("storeId").item(0)),
					last_modified : gsm.get_xml_value(store.getAttribute("lastModified")),
					store_id :gsm.get_xml_value(store.getElementsByTagName("storeId").item(0)),
					display : gsm.get_xml_value(store.getElementsByTagName("display").item(0)),
					name : gsm.get_xml_value(store.getElementsByTagName("name").item(0)),
					tags : gsm.get_xml_value(store.getElementsByTagName("tags").item(0)),
					featured_until : gsm.get_xml_value(store.getElementsByTagName("featuredUntil").item(0)),
					description : gsm.get_xml_value(store.getElementsByTagName("desc").item(0)),
					location : gsm.get_xml_value(store.getElementsByTagName("location").item(0)),
					address : gsm.get_xml_value(store.getElementsByTagName("address").item(0)),
					phone : gsm.get_xml_value(store.getElementsByTagName("phone").item(0)),
					fax : gsm.get_xml_value(store.getElementsByTagName("fax").item(0)),
					email : gsm.get_xml_value(store.getElementsByTagName("email").item(0)),
					website : gsm.get_xml_value(store.getElementsByTagName("websiteUrl").item(0)),
					logo : gsm.get_xml_value(store.getElementsByTagName("logoUrl").item(0))
				});
				result.save();

				store = null;
				result = null;


				for (var i = 0; i <= store.categoryIds.categoryId.length; i++) {
					var category = store.categoryIds.categoryId[i];
					// For this store, associate with categories & offers
					var result = categories_stores.newRecord({
						category_id : category.categories.lastModified,
						store_id : store.store_id
					});
					result.save();
				}


				// For this store, associate with categories & offers
				var result = categories_stores.newRecord({
					offer_id : category.lastModified,
					store_id : category.display
				});
				result.save();



			}


			// Loop through adverts
			for (var i = 0; i <= response.advertisements.advertisement.length; i++) {
				var category = response.categories.category[i];

				var result = adverts.newRecord({
					id : advert.attributes.id,
					display : advert.display,
					name : advert.name,
					type : advert.type,
					start_date : advert.start_date,
					end_date : advert.end_date,
					valid_location : advert.valid_location,
					valid_distance : advert.valid_distance,
					image_url : advert.image_url,
					click_through_type : advert.click_through_type,
					click_through_id : advert.click_through_id
				});
				result.save();
			}

			result = null;
			response = null;
			xml_categories = null;
			xml_stores = null;
			xhr = null;

		};

		xhr.open('GET', gsm.update_url_xml);
		xhr.send();
	}
	*/

	// Atanas: The old Twitter function is deprecated
	/* gsm.getTweet = function(callback) {
		var twitter_account = styles.get('twitter_account');
  		var xhr = Titanium.Network.createHTTPClient();
		xhr.timeout = 30000;
		// var callback = callback;
		xhr.onerror = function() {
			Ti.API.info('ERROR fetching styles.');
		};
		xhr.onload = function() {

			if(platform == 'Android'){
				var data = JSON.parse(this.responseText);

			} else {
				var data = JSON.parse(this.responseData);
			}


			callback(data.status.text, data.status.created_at);

		};

		xhr.open('GET', 'https://api.twitter.com/1/users/show.json?screen_name='+twitter_account, false);
		xhr.send();

	} */
	
	gsm.getTweet = function(callback) {
		var bearerToken = Ti.App.Properties.getString('TwitterBearerToken', null);
		if (bearerToken == null) {
			globalCodebird.__call('oauth2_token', {}, function(reply) {
				var bearer_token = reply.access_token;
				globalCodebird.setBearerToken(bearer_token);
				Ti.App.Properties.setString('TwitterBearerToken', bearer_token);
				globalCodebird.__call('users/show', "screen_name="+styles.get('twitter_account'), function(reply) {
					if( reply.status.text ) {
						callback(reply.status.text, reply.status.created_at);
					}
				}, true);
			});
		} else {
			Ti.API.info("We do have a bearer token...");
			globalCodebird.setBearerToken(bearerToken);
			globalCodebird.__call('users/show', "screen_name="+styles.get('twitter_account'), function(reply) {
				if( reply.status.text ) {
					callback(reply.status.text, reply.status.created_at);
				}
			}, true);
		}
	}

	gsm.loading_count = 0;

	gsm.show_loading = function() {
		gsm.loading_count++;
		gsm.actInd.show();
	}

	gsm.hide_loading = function() {
		Ti.API.info('gsm.hide_loading');
		gsm.actInd.hide();
	}



})();
