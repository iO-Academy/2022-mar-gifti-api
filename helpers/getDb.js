const {MongoClient} = require("mongodb");

/**
 * Returns a connection to the 'gifti' database
 *
 * @returns {Promise<Db>}
 */
const getDb = async () => {
    const url= 'mongodb://root:password@localhost:27017'

    let connection = {}
    connection = await MongoClient.connect(url, {ignoreUndefined: true})
    return connection.db('gifti')
}

module.exports = getDb