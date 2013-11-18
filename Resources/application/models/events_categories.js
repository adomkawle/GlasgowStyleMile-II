//joli.connection = new joli.Connection(gsm.database);

var events_categories = new joli.model({
  table:    'events_categories',
  columns:  {
    	id:				 	'INTEGER PRIMARY KEY AUTOINCREMENT',
    	category_id: 		'INTEGER',
    	event_id:			'INTEGER'
  }
});