//joli.connection = new joli.Connection(gsm.database);

var highlights = new joli.model({
	table : 'highlights',
	columns : {
		id : 'INTEGER PRIMARY KEY AUTOINCREMENT',
		publish_date : 'TEXT',
		expiry_date : 'TEXT',
		title : 'TEXT',
		description : 'TEXT',
		link : 'TEXT',
		image : 'TEXT',
		thumbnail_title : 'TEXT',
		thumbnail_image : 'TEXT'
	}
});
