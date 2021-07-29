const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

/* 
movieSchema: {
  title: String,
  synopsis: String,
  category: String,
  trailer: String, // youtube url
  posterImage: String,
  reviews: [String], // array of reviews object
  releaseDate: Date,
  director: String,
  budget: Number,
  featuredSong: String,
  avgRating: Number
}
*/

const movie = new mongoose.Schema(
  {
    // good: {
    //   type: mongoose.Schema.Types.Mixed,
    //   required: true,
    // },
    // customer: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "customer",
    // },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    synopsis: {
      type: String,
      required: true,
    },
    trailer: {
      type: String, // url format
      required: false,
    },
    posterImage: {
      type: String,
      required: false,
      default: "i.imgur.com/hXgKBGQ.jpg",
    },
    releaseDate: {
      type: Date,
      required: false,
      default: "1970-01-01",
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

// Enable soft delete, it will make delete column automaticly
movieSchema.plugin(mongooseDelete, { overrideMethods: "all" });

module.exports = mongoose.model("movie", movieSchema); // Export transaction models
