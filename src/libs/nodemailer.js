let {createTransport} = require('nodemailer')

const email = process.env._EMAIL_PEDIDOS;
const password = process.env._PASS_PEDIDOS

const transport = createTransport({
    service:'gmail',
    port: 587,
    auth: {
        user: email,
        pass:password
    }
})

module.exports = transport