const twilio = require('twilio')

const accountSid = process.env._TWILIO_SID
const authToken = process.env._TWILIO_TOKEN

const client = twilio(accountSid,authToken)

module.exports = client