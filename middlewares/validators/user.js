const validator = require("validator");
const { promisify } = require("util");

exports.userValidator = async (req, res, next) => {
  try {
    const errorMessages = [];
    if (req.user.user !== req.params.id) {
      return next({ statusCode: 403, message: "Forbidden!" });
    }

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
