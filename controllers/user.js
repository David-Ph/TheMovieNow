const { user } = require("../models");

class User {
  async updateUser(req, res, next) {
    try {
      const newData = await user.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );

      if (!newData) {
        return next({ statusCode: 404, message: "User is not found" });
      }

      res.status(201).json({ newData });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new User();
