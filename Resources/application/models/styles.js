//joli.connection = new joli.Connection(gsm.database);

var styles = new joli.model({
	table:	'styles',
	columns:  {
		id:			'INTEGER PRIMARY KEY AUTOINCREMENT',
		name: 		'TEXT',
		value:		'string'
  }
});

styles.get = function(name, default_val, return_default) {

	var defaults = require('application/rebrands/'+rebrand+'/styles');

	if (return_default) {
		return defaults[name];
	}

	var result = new joli.query().select().from('styles').where('name = ?', name).execute();

	return (result.length > 0 && result[0].value) ? result[0].value : (default_val !== undefined && default_val ? default_val : defaults[name]);
}
