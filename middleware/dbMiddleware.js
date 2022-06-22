const jsonHelper = require("../helpers/jsonHelper");
const getDb = require('../helpers/getDb')

/**
 * Middleware to connect to the events collection and store it in res.locals. Should used as a route specific callback
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
const dbMiddleware = async (req, res, next) => {
    let connection = null
    try {
        connection = await getDb()
    } catch(err) {
        return res.status(500).json(jsonHelper(500, 'Internal server error (none of your business)'))
    }
    res.locals.collection = connection.collection('events')
    next()
}

module.exports = dbMiddleware