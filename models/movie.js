const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    synopsis: {
      type: String,
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    trailer: {
      type: String, // url format
      required: false,
    },
    posterImage: {
      type: String,
      required: false,
      get: getImage,
      default: "i.imgur.com/hXgKBGQ.jpg",
    },
    releaseDate: {
      type: Date,
      required: false,
      default: "1970-01-01",
    },
    director: {
      type: String,
      required: false,
    },
    budget: {
      type: Number,
      required: false,
    },
    featuredSong: {
      type: String,
      required: false,
    },
    avgRating: {
      type: Number,
      required: false,
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

movieSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "movie_id",
  justOne: false,
});

function getImage(image) {
  if (!image || image.includes("https") || image.includes("http")) {
    return image;
  }

  return `/images/posters/${image}`;
}

// Enable soft delete, it will make delete column automaticly
movieSchema.plugin(mongooseDelete, { overrideMethods: "all" });

module.exports = mongoose.model("Movie", movieSchema); // Export transaction models
