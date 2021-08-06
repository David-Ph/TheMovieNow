const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const ReviewSchema = new mongoose.Schema(
  // Column
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    movie_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movie",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please add rating between 1 and 5"],
    },
    text: {
      type: String,
      required: [true, "Please add a some text"],
    },
  },
  {
    // Enables timestamps
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
    toObject: { getters: true },
    toJSON: {
      getters: true,
      versionKey: false,
      transform: function (doc, ret) {
        delete ret.id;
        delete ret.deleted;
      },
    },
  }
);

// Prevent user for submitting more than one review per Movie
// change this
ReviewSchema.index({ movie_id: 1, user_id: 1 }, { unique: true });

// Static method to get average rating
ReviewSchema.statics.getAverageRating = async function (movie_id) {
  const obj = await this.aggregate([
    {
      $match: { movie_id: movie_id },
    },
    {
      $group: {
        _id: "$movie_id",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("Movie").findByIdAndUpdate(movie_id, {
      averageRating: obj[0].averageRating.toFixed(2),
    });
  } catch (e) {
    console.error(e);
  }
};

// call getAverageCost after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.movie_id);
});

ReviewSchema.post("findOneAndUpdate", function (doc) {
  doc.constructor.getAverageRating(doc.movie_id._id);
});

// call getAverageCost after remove
ReviewSchema.post("remove", function () {
  this.constructor.getAverageRating(this.movie_id);
});

// Enable soft delete, it will make delete column automatic
ReviewSchema.plugin(mongooseDelete, { overrideMethods: "all" });

// Export model
module.exports = mongoose.model("Review", ReviewSchema);
