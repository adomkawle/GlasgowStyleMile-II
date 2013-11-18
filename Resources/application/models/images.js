//joli.connection = new joli.Connection(gsm.database);

var images = new joli.model({
  table:    'images',
  columns:  {
    	id:				 	'INTEGER PRIMARY KEY AUTOINCREMENT',
    	name:				'TEXT',
    	location:			'TEXT',
    	store_id:			'TEXT'
  }
});