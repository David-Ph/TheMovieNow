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
    // Enable timestamps
    timestamps: {
      createdAt: "createdAt",
      UpdatedAt: "updateAt",
    },
  }
);

// Prevent user for submitting more than one review per Movie
ReviewSchema.index({ Movie: 1, User: 1 }, { unique: true });

// Static method to get average rating
ReviewSchema.statics.getAverageRating = async function (MovieId) {
  const obj = await this.aggregate([
    {
      $match: { Movie: MovieId },
    },
    {
      $group: {
        _id: "$Movie",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("Movie").findByIdAndUpdate(MovieId, {
      averageRating: obj[0].averageRating,
    });
  } catch (e) {
    console.error(e);
  }
};

// call getAverageCost after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.Movie);
});

// call getAverageCost after remove
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.Movie);
});

// Enable soft delete, it will make delete column automatic
ReviewSchema.plugin(mongooseDelete, { overrideMethods: "all" });

// Export model
module.exports = mongoose.model("Review", ReviewSchema);
