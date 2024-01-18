
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "./uploads/image")
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + "-" +file.originalname);
    }
});

const fileFilter = (req, file, callback)=>{
    const acceptableExt = [".png",".jpg", ".jpeg"];
    if(!acceptableExt.includes(path.extname(file.originalname))){
        return callback(new Error("Only .png, .jpg and .jpeg format allowed"));
    }
    const fileSize = parseInt(req.headers["content-length"]);
    if (fileSize > 1048576){
        return callback(new Error("File size Big"));
    }
    callback(null, true);
};
const uploadImage = multer({ storage: storage, fileFilter: fileFilter, fileSize: 1048576, });


module.exports = uploadImage;

