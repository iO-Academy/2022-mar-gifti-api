import Schema from 'validate'


const participants = new Schema({
    participant_name: {
        type: String,
        required: true,
        length: { min: 3, max: 250 },
        match: '/^(\w.+\s).+$/'
        },
    participant_email: {
        type: String,
        required: true,
        },
    participant_home_address: {
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
        },
    }
})

const errors = participants.validate(obj)

import { postcodeValidator, postcodeValidatorExistsForCountry } from 'postcode-validator';
import * as EmailValidator from 'email-validator';

postcodeValidator('post_code', 'country_code')
EmailValidator.validate('email')