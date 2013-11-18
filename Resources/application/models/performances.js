//joli.connection = new joli.Connection(gsm.database);

var performances = new joli.model({
	table : 'performances',
	columns : {
		id : 'INTEGER PRIMARY KEY AUTOINCREMENT',
		event_id : 'INTEGER',
		venue_id : 'INTEGER',
		supplier_ref : 'TEXT',
		date_time : 'TEXT',
		date_only : 'TEXT',
		duration : 'TEXT',
		performance_space : 'TEXT',
		is_cancelled : 'TEXT',
		ticket_prices : 'TEXT',
		created_on : 'TEXT',
		modified_on : 'TEXT'
	}
});
