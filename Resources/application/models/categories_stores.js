//joli.connection = new joli.Connection(gsm.database);

var categories_stores = new joli.model({
  table:    'categories_stores',
  columns:  {
    	id:				 	'TEXT PRIMARY KEY',
    	category_id: 		'INTEGER',
    	store_id:			'INTEGER'
  }
});