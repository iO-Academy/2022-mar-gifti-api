const express = require('express')
const cors = require('cors')

const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectId
const app = express()
const port = 3000

app.use(express.json())
app.use(cors())
const url= 'mongodb://root:password@localhost:27017'

app.get('/events/:id', async (req, res) => {
    const userId = ObjectId(req.params.id)
    const connection = await MongoClient.connect(url)
    const db = connection.db('gifti')
    const collection = db.collection('events')
    const data = await collection.findOne({_id:userId})

    res.json(data)
})



app.listen(port)