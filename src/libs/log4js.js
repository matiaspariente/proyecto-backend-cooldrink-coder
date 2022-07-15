const log4js = require('log4js');

log4js.configure({
    appenders:{
        loggerFileError: { type: 'file', filename: 'logs/error.log'},
        loggerFileWarning: { type: 'file', filename: 'logs/warn.log'},
        loggerConsole:  { type: 'console'}
    },
    categories:{
        default: {appenders:['loggerConsole'], level: 'info' },
        fileError: {appenders:['loggerFileError'], level: 'error' },
        fileWarning: {appenders:['loggerFileWarning'], level: 'warn' }
    }
})

module.exports = log4js