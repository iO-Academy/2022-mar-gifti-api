const Schema = require("validate");


const participantValidator = new Schema({
    id: {
        required: true,
    },
    name: {
        type: String,
        required: true,
        match: /^(\w.+\s).+$/,
        length: { min: 3, max: 250 }
    },
    email: {
        type: String,
        required: true
    },
    address: {
        street: {
            type : String
        },
        city: {
            type: String
        },
        postcode: {
            type: String
        },
    }
})

module.exports = participantValidator