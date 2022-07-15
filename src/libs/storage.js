const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("destination")
        cb(null, '../public/img/users')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = 'BOOOOCA'
      console.log("filename")
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  })
  
  const upload = multer({ storage: storage })

  module.exports = upload