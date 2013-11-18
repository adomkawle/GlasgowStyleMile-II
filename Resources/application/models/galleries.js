//joli.connection = new joli.Connection(gsm.database);

var galleries = new joli.model({
  table:    'galleries',
  columns:  {
    	id:				 	'INTEGER PRIMARY KEY AUTOINCREMENT',
    	url:				'TEXT',
      marker:     'TEXT',
    	title:			'TEXT',
    	description:'TEXT',
      sort:       'INTEGER',
    	lat:				'REAL',
    	lng:				'REAL',
    	homepage:		'INTEGER'
  }
});
