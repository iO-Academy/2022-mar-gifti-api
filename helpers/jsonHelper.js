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

module.exports = jsonHelper