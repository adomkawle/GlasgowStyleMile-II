//joli.connection = new joli.Connection(gsm.database);

var stores = new joli.model({
  table:    'stores',
  columns:  {
    	id:				 	'INTEGER PRIMARY KEY AUTOINCREMENT',
    	last_modified: 		'TEXT',
    	store_id:			'INTEGER',
    	display:			'TEXT',
    	name:				'TEXT',
    	tags:			    'TEXT',
    	featured_until:		'TEXT',
    	description:		'TEXT',
    	location:			'TEXT',
    	latitude:			'TEXT',
    	longitude:			'TEXT',
    	address:			'TEXT',
    	phone:				'TEXT',
    	fax:				'TEXT',
    	email:				'TEXT',
    	website:			'TEXT',
    	logo:				'TEXT'
  }
});