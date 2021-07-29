const { Category } = require("../models");

class CategoryController {
  async getAllCategories(req, res, next) {
    try {
      const data = await Category.find();
      if (data.length === 0) {
        return next({ message: "Categories not found", statusCode: 404 });
      }

      res.status(200).json({ data });
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      const newData = await Category.create(req.body);

      const data = await Category.findOne({
        _id: newData._id,
      });

      res
        .status(201)
        .json({ data, message: "New Category Successfully Created!" });
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const newData = await Category.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true }
      );

      if (!newData) {
        return next({ statusCode: 404, message: "Category not found" });
      }

      res
        .status(201)
        .json({ newData, message: "Category successfully updated!" });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      //   for soft delete
      const data = await Category.deleteById(req.params.id);

      if (data.nModified === 0) {
        return next({ statusCode: 404, message: "Category not found" });
      }

      res.status(200).json({ message: "Category successfully deleted" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();
