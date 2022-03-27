//config: local de armazenamento das imagens dos usuarios
const multer = require('multer')

var storage = multer.diskStorage({
    filename: (req, file, done) => {
        done(null, Date.now()+"-"+file.originalname)
    }
})

var upload = multer({storage: storage})

module.exports = upload.single("fileUser")