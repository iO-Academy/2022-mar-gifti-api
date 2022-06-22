const express = require('express')
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const Schema = require('validate')

const app = express()
const port = 3000
const url= 'mongodb://root:password@localhost:27017'

/**
 *  Enforces the format of the JSON object
 *
 * @param status
 * @param message
 * @param data
 * @returns {{data: null, message, status}}
 */
const jsonHelper = (status, message, data = null) => {
    return {
        status,
        message,
        data
    }
}

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
        return res.status(500).json(jsonHelper(500, 'Internal server error (none of your business)'))
    }
    res.locals.collection = connection.collection('events')
    next()
}

/**
 * Schema for the form submission for events
 *
 * @type {Schema}
 */
const eventValidator = new Schema({
    event_name: {
        type: String,
        required: true,
        length: {min : 3, max : 255}
    },
    deadline: {
        type: Date,
        required: true
    }
})

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: true}))

// Below are the API routes, grouped by route and ordered GET>POST>PUT>DELETE

// /events route

app.get('/events', async (req, res) =>{
    res.status(405).json(jsonHelper(405, 'Method not allowed'))
})

app.post('/events', dbMiddleware, async (req, res) =>{
    const dataToInsert = {
        event_name: req.body.event_name,
        deadline: req.body.deadline,
        participants: []
    }

    const errors = eventValidator.validate(dataToInsert)

    if(errors.length > 0) {
        let message = ''
        errors.forEach(error => {
            message += error.message + ' '
        })
        return res.status(400).json(jsonHelper(400, message))
    }

    const result = await res.locals.collection.insertOne(dataToInsert)

    if(result.insertedId) {
        res.status(200).json(jsonHelper(200, 'Document added successfully', {id: result.insertedId}))
    } else {
        res.status(400).json(jsonHelper(400, 'Failed to add document'))
    }
})

app.put('/events', async (req, res) =>{
    res.status(405).json(jsonHelper(405, 'Method not allowed'))
})

app.delete('/events', async (req, res) =>{
    res.status(405).json(jsonHelper(405, 'Method not allowed'))
})

// /events/:id Route

app.get('/events/:id', dbMiddleware, async (req, res) => {
    let _id
    try {
        _id = ObjectId(req.params.id)
    } catch(err) {
        res.status(400).json(jsonHelper(400, 'Invalid ID'))

        return
    }

    const data = await res.locals.collection.findOne({_id})
    if(data._id) {
        res.status(200).json(jsonHelper(200, 'Event retrieved successfully', data))
    } else {
        res.status(400).json(jsonHelper(400, 'Invalid ID'))
    }
})

app.post('/events/:id', async (req, res) => {
    res.status(405).json(jsonHelper(405, 'Method not allowed'))
})

app.put('/events/:id', async (req, res) => {
    res.status(405).json(jsonHelper(405, 'Method not allowed'))
})

app.delete('/events/:id', async (req, res) => {
    res.status(405).json(jsonHelper(405, "Method not allowed"))
})

// /participant/:eventId route

app.get('/participant/:eventId', async (req, res) => {
    res.status(405).json(jsonHelper(405, 'Method not allowed'))
})

app.post('/participant/:eventId', dbMiddleware, async (req, res) => {
    const _id = ObjectId(req.params.eventId)
    const id = ObjectId()

    const dataToInsert = {
        id,
        name: req.body.name,
        email: req.body.email,
        address: req.body.address
    }

    const result = res.locals.collection.updateOne({_id}, {$push : {participants: dataToInsert}})

    if(result.modifiedCount === 0) {
        res.status(400).json(jsonHelper(400, 'Could not add participant'))
    } else {
        res.status(200).json(jsonHelper(200, 'Participant added',{id}))
    }
})

app.put('/participant/:eventId', async (req, res) => {
    res.status(405).json(jsonHelper(405, 'Method not allowed'))
})

app.delete('/participant/:eventId', async (req, res) => {
    res.status(405).json(jsonHelper(405, 'Method not allowed'))
})

// Catch-all route

app.all('*', (req, res) =>{
    res.status(404).json(jsonHelper(404, 'Route not implemented, see documentation at: https://github.com/iO-Academy/2022-mar-gifti-api'))
})

app.listen(port)