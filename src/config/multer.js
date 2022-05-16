const multer = require('multer');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new ApiError('Not an image! Please upload only images.', httpStatus.BAD_REQUEST), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadUserPhoto = upload.single('photo');
