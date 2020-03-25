const multer = require('multer');
const uuid4 = require('uuid/v4');

const extMap = {
  'image/jpeg':  '.jpg',
  'image/png':  '.png',
  'image/gif':  '.gif',
};

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/../public/img-uploads')
    },
    filename: function (req, file, cb) {
        let ext = extMap[file.mimetype];
        if(ext){
            cb(null, uuid4() + ext);
        } else {
            cb(new Error('not allowed'));
        }
    }
});

let fileFilter = (req, file, cb)=>{
    cb(null, !!extMap[file.mimetype]);
};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;


