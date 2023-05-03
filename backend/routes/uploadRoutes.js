const express = require('express');
/* const path = require('path');
const multer = require('multer'); */
const router = express.Router()
const sharp = require('sharp');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage})
const fs = require('fs')

/* const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)

    if(extname && mimetype) {
        return cb(null, true)
    } else {
        cb('Image only')
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    },
})

router.post('/', upload.single('image'), (req, res) => {
    res.send(`/${req.file.path}`)
}) */
router.post("/", upload.single("image"), async (req, res)=> {
    const name = Date.now().toString();
    const formatName = req.file.originalname.split(' ').join('-');
    const fileName = `${name}-${formatName}`
    fs.access('uploads', (err) => {
      if(err){
        fs.mkdirSync('uploads')
      }
    })
    await sharp(req.file.buffer).resize({width: 640, height: 510})
    .toFile('uploads/'+fileName)
    
    res.send('/uploads/'+fileName);
  
    
  });
module.exports = router