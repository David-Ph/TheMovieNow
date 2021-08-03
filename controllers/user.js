const { user } = require("../models");

class User {
  // async getAllUsers(req, res, next) {
  //   try {
  //     const data = await user.find();
  //     if (data.length === 0) {
  //       return next({ message: "Users not found", statusCode: 404 });
  //     }

  //     res.status(200).json({ data });
  //   } catch (error) {
  //     next(error);
  //   }
  // }

  async getMe(req, res, next) {
    try {
      const data = await user
        .findOne({ _id: req.user.user })
        .select("-password");

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

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
