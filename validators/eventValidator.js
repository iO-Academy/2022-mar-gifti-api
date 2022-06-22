const Schema = require("validate");

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
        type: String,
        match: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
        required: true
    },
    address_required: {
        type: Boolean,
        required: true
    }
})

module.exports = eventValidator