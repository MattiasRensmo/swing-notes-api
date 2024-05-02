const Datastore = require('nedb-promise')

const db = new Datastore({
  filename: './db/db.db',
  autoload: true,
})

module.exports = db
