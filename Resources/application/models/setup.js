//ActiveRecord.logging      = true;
// ActiveRecord.autoMigrate  = true;
//ActiveSupport.log         = Ti.API.info;
//ActiveRecord.connect(ActiveRecord.Adapters.Ti, "zendit");

//ActiveRecord.connection.db.execute("DROP TABLE IF EXISTS items");

joli.connection = new joli.Connection(db_version);
joli.models.initialize();

// Now create index

joli.connection.execute("CREATE UNIQUE INDEX IF NOT EXISTS index_1 ON categories_stores (category_id, store_id);");
joli.connection.execute("CREATE UNIQUE INDEX IF NOT EXISTS index_2 ON events_categories (category_id, event_id);");
joli.connection.execute("CREATE UNIQUE INDEX IF NOT EXISTS index_3 ON offers_stores (offer_id, store_id);");
joli.connection.execute("CREATE UNIQUE INDEX IF NOT EXISTS index_4 ON performances (event_id, date_time);");
joli.connection.execute("CREATE UNIQUE INDEX IF NOT EXISTS index_5 ON events (start_date, end_date);");
