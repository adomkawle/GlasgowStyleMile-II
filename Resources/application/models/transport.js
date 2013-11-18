//joli.connection = new joli.Connection(gsm.database);

var transport = new joli.model({
	table : 'transport',
	columns : {
		id : 'INTEGER PRIMARY KEY AUTOINCREMENT',
		name : 'TEXT',
		latitude : 'TEXT',
		longitude : 'TEXT',
		type : 'TEXT',
		telephone : 'TEXT',
		website : 'TEXT'
	}
});
