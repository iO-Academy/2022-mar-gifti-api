const Schema = require("validate");

const addressValidator = new Schema ({
    street: {
        type : String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postcode: {
        type: String,
        required: true
    }
})

module.exports = addressValidator