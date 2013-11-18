//joli.connection = new joli.Connection(gsm.database);

var categories = new joli.model({
  table:    'categories',
  columns:  {
    	id:				 	'INTEGER PRIMARY KEY AUTOINCREMENT',
    	last_modified: 		'TEXT',
    	display:			'TEXT',
    	name:				'TEXT',
    	group_id:			'INTEGER',
    	type:				'TEXT',
    	result_count:		'INTEGER'
  }
});