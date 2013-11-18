//joli.connection = new joli.Connection(gsm.database);

var offers = new joli.model({
  table:    'offers',
  columns:  {
    	id:				 	'INTEGER PRIMARY KEY AUTOINCREMENT',
    	last_modified: 		'TEXT',
    	name:				'TEXT',
    	start_date: 		'TEXT',
    	end_date: 			'TEXT'
  }
});