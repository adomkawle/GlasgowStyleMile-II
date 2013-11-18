//joli.connection = new joli.Connection(gsm.database);

var events = new joli.model({
	table : 'events',
	columns : {
		id : 'INTEGER PRIMARY KEY AUTOINCREMENT',
		venue_id : 'INTEGER',
		name : 'TEXT',
		sort_name : 'TEXT',
		start_date : 'TEXT',
		end_date : 'TEXT',
		expiry_date : 'TEXT',
		duration : 'INTEGER',
		description : 'TEXT',
		description_is_html : 'TEXT',
		additional_details : 'TEXT',
		image_url : 'TEXT',
		thumbnail_image_url : 'TEXT',
		performance_space : 'TEXT',
		has_other_venues : 'TEXT',
		is_free : 'TEXT',
		is_cancelled : 'TEXT',
		ticket_prices : 'TEXT',
		created_on : 'TEXT',
		modified_on : 'TEXT',
		ticket_url : 'TEXT',
		venue_name : 'TEXT',
		address : 'TEXT',
		town : 'TEXT',
		postcode : 'TEXT',
		telephone : 'TEXT',
		email : 'TEXT',
		website : 'TEXT',
		location : 'TEXT',
		latitude : 'TEXT',
		longitude : 'TEXT',
		details : 'TEXT'
	}
});
