const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const categorySchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    // Enables timestamps
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

categorySchema.virtual("movies", {
  ref: "Movie",
  localField: "_id",
  foreignField: "categories",
  justOne: false,
});

// Enable soft delete, it will make delete column automaticly
categorySchema.plugin(mongooseDelete, { overrideMethods: "all" });

module.exports = mongoose.model("Category", categorySchema);
