const express = require('express')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
const { postcodeValidator, PostcodeValidatorExistsForCountry} = require('postcode-validator')
const EmailValidator = require('email-validator')
const eventValidator = require('./validators/eventValidator')
const participantValidator = require('./validators/participantValidator')
const addressValidator = require('./validators/addressValidator')
const jsonHelper = require('./helpers/jsonHelper')
const dbMiddleware = require('./middleware/dbMiddleware')

const app = express()
const port = 3000

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
        return res.status(400).json(jsonHelper(400, 'Invalid ID'))
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

// /participants/:eventId route

app.get('/participants/:eventId', dbMiddleware, async (req, res) => {
    try {
        const eventId = ObjectId(req.params.eventId)

        const result = await res.locals.collection.find({_id: eventId}).project({participants: 1, _id: 0}).next()

        if ('participants' in result) {
            return res.status(200).json(jsonHelper(200, 'Successfully retrieved participants', result))
        }
        res.status(400).json(jsonHelper(400, 'Invalid ID'))
    } catch(err) {
        console.log(err.message)
        res.status(400).json(jsonHelper(400, 'Invalid ID'))
    }
})

app.post('/participants/:eventId', dbMiddleware, async (req, res) => {
    const eventId = ObjectId(req.params.eventId)
    const participantId = ObjectId()

    const dataToInsert = {
        id: participantId,
        name: req.body.name,
        email: req.body.email,
        address: req.body.address
    }

    let generalErrors = participantValidator.validate(dataToInsert)
    let addressErrors = []

    if(!EmailValidator.validate(dataToInsert.email)) {
        generalErrors.push({ message: 'email must be a valid email' })
    }

    if(dataToInsert.address) {
        addressErrors = addressValidator.validate(dataToInsert.address)
        if(!postcodeValidator(dataToInsert.address.postcode, 'GB')) {
            addressErrors.push({ message: 'postcode must be a valid postcode' })
        }
    }

    const errors = generalErrors.concat(addressErrors)
    if(errors.length > 0)  {
        let message = ''
        errors.forEach(error => {
            message += error.message + ' '
        })
        return res.status(400).json(jsonHelper(400, message))
    }

    const result = res.locals.collection.updateOne({_id: eventId}, {$push : {participants: dataToInsert}})

    if(result.modifiedCount === 0) {
        res.status(400).json(jsonHelper(400, 'Could not add participant'))
    } else {
        res.status(200).json(jsonHelper(200, 'Participant added',{id: participantId}))
    }
})

app.put('/participants/:eventId', async (req, res) => {
    res.status(405).json(jsonHelper(405, 'Method not allowed'))
})

app.delete('/participants/:eventId', async (req, res) => {
    res.status(405).json(jsonHelper(405, 'Method not allowed'))
})

// Catch-all route

app.all('*', (req, res) =>{
    res.status(404).json(jsonHelper(404, 'Route not implemented, see documentation at: https://github.com/iO-Academy/2022-mar-gifti-api'))
})

app.listen(port)