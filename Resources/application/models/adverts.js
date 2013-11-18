//joli.connection = new joli.Connection(gsm.database);

var adverts = new joli.model({
  table:    'adverts',
  columns:  {
    	id:				 	'INTEGER PRIMARY KEY AUTOINCREMENT',
    	display:			'TEXT',
    	name:				'TEXT',
    	type:				'TEXT',
    	start_date:			'TEXT',
    	end_date:			'TEXT',
    	valid_location:		'TEXT',
    	valid_distance:		'TEXT',
    	image_url:			'TEXT',
    	click_through_type:	'TEXT',
    	click_through_id:	'TEXT'
  }
});