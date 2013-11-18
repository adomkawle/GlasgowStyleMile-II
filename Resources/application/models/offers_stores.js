//joli.connection = new joli.Connection(gsm.database);

var offers_stores = new joli.model({
  table:    'offers_stores',
  columns:  {
    	id:				 	'TEXT PRIMARY KEY',
    	offer_id: 			'INTEGER',
    	store_id:			'INTEGER'
  }
});