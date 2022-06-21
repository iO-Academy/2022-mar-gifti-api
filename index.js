const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId

const app = express()
const port = 3000
const url= 'mongodb://root:password@localhost:27017'

/**
 * Returns a connection to the 'gifti' database
 *
 * @returns {Promise<Db>}
 */
const getDb = async () => {
    let connection = {}
    connection = await MongoClient.connect(url, {ignoreUndefined: true})
    return connection.db('gifti')
}

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
        return res.status(500).json({
            status: 500,
            message: 'Internal server error (none of your business)',
            data: null
        })
    }
    res.locals.collection = connection.collection('events')
    next()
}

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true}))

// Below are the API routes, grouped by route and ordered GET>POST>PUT>DELETE

// /events route

app.get('/events', async (req, res) =>{
    res.status(405).json({
        "status": 405,
        "message": "Method not allowed",
        "data": null
    })
})

app.post('/events', dbMiddleware, async (req, res) =>{
    const dataToInsert = {
        event_name: req.body.event_name,
        deadline: req.body.deadline,
        participants: []
    }

    const result = await res.locals.collection.insertOne(dataToInsert)
    if(result.insertedId) {
        res.status(200).json({
            status: 200,
            message: 'Document added successfully',
            data: {id: result.insertedId}
        })
    } else {
        res.status(400).json({
            status: 400,
            message: 'Failed to add document',
            data: null
        })
    }
})

app.put('/events', async (req, res) =>{
    res.status(405).json({
        "status": 405,
        "message": "Method not allowed",
        "data": null
    })
})

app.delete('/events', async (req, res) =>{
    res.status(405).json({
        "status": 405,
        "message": "Method not allowed",
        "data": null
    })
})

// /events/:id Route

app.get('/events/:id', dbMiddleware, async (req, res) => {
    let _id
    try {
        _id = ObjectId(req.params.id)
    } catch(err) {
        res.status(400).json({
            "status": 400,
            "message": "Invalid ID",
            "data": null
        })
    }

    const data = await res.locals.collection.findOne({_id})
    if(data._id) {
        res.status(200).json({
            "status": 200,
            "message": "Event retrieved successfully!",
            "data": data
        })
    } else {
        res.status(400).json({
            "status": 400,
            "message": "Invalid ID",
            "data": null
        })
    }
})

app.post('/events/:id', async (req, res) => {
    res.status(405).json({
        "status": 405,
        "message": "Method not allowed",
        "data": null
    })
})

app.put('/events/:id', async (req, res) => {
    res.status(405).json({
        "status": 405,
        "message": "Method not allowed",
        "data": null
    })
})

app.delete('/events/:id', async (req, res) => {
    res.status(405).json({
        "status": 405,
        "message": "Method not allowed",
        "data": null
    })
})

// Catch-all route

app.all('*', (req, res) =>{
    res.status(404).json({
        status: 404,
        message: 'Route not implemented, see documentation at: https://github.com/iO-Academy/2022-mar-gifti-api',
        data: null
    })
})

app.listen(port)