const { StatusCodes } = require("http-status-codes");
const multer = require("multer");
const { default: ApiError } = require("~/utils/ApiError");
const {
  ALLOW_COMMON_FILE_TYPES,
  LIMIT_COMMON_FILE_SIZE,
} = require("~/utils/validators");

const customFileFilter = (req, file, cb) => {
  console.log("🚀 ~ customFileFilter ~ file:", file);
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errMsg = "File type is invalid. Only accept jpg, jpeg and png";
    return cb(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errMsg), null);
  }
  return cb(null, true);
};

const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customFileFilter,
});

export const multerUploadMiddleware = {
  upload,
};
