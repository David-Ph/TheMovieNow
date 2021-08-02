const validator = require("validator");
const { promisify } = require("util");

exports.userValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (validator.isEmpty(req.body.fullname)) {
      errorMessages.push("Name must not be empty");
    }

    if (req.files) {
      const file = req.files.photo;

      if (!file.mimetype.startsWith("image")) {
        errorMessages.push("File must be an image");
      }

      if (file.size > 2000000) {
        errorMessages.push("Image must be less than 2MB");
      }

      file.name = new Date().getTime() + "_" + file.name;

      const move = promisify(file.mv);

      await move(`./public/users/${file.name}`);

      req.body.photo = file.name;
    }
    if (errorMessages.length > 0) {
      return next({ statusCode: 404, messages: errorMessages });
    }

    next();
  } catch (error) {
    next(error);
  }
};
