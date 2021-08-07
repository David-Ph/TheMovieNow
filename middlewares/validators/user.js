const validator = require("validator");
const { promisify } = require("util");

exports.userValidator = async (req, res, next) => {
  try {
    const errorMessages = [];

    if (validator.isEmpty(req.body.fullname)) {
      errorMessages.push("Name can not be empty");
    }

    if (req.body.fullname.length < 3) {
      errorMessages.push("Fullname characters minimal is 3");
    }

    if (!validator.isEmail(req.body.email)) {
      errorMessages.push("email is not valid");
    }

    if (!validator.isStrongPassword(req.body.password)) {
      errorMessages.push("password is not strong enough");
    }

    if (req.files) {
      if (
        !req.files.photo.mimetype.startsWith("image") ||
        req.files.photo.size > 2000000
      ) {
        errorMessages.push("File must be an image and less than 2MB");
      }

      const move = promisify(req.files.photo.mv);

      await move(
        `./images/users/${new Date().getTime() + "_" + req.files.photo.name}`
      );

      req.body.photo = new Date().getTime() + "_" + req.files.photo.name;
    }
    if (errorMessages.length > 0) {
      return next({ statusCode: 404, messages: errorMessages });
    }

    next();
  } catch (error) {
    next(error);
  }
};
