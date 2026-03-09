const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Movie title is required"],
      trim: true,
    },
    posterPath: {
      type: String,
      required: [true, "Poster image URL is required"],
      match: [
        /^https?:\/\/.+/, 
        "Please provide a valid image URL"
      ]
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    tmdbId: {
      type: String, // Optional, can be used to link custom data to TMDB IDs
      unique: true,
      sparse: true, // Allows null/empty values while maintaining unique constraint for non-null
    },
    releaseDate: {
      type: Date,
      required: [true, "Release date is required"],
    },
    trailerUrl: {
      type: String,
      required: [true, "Trailer YouTube link is required"],
    },
    genre: {
      type: [String],
      required: [true, "At least one genre is required"],
      match: [
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/,
        "Please provide a valid YouTube URL"
      ],
      validate: {
        validator: (val) => val.length > 0,
        message: "At least one genre is required"
      }
    },
    category: {
      type: String,
      enum: ["movie", "tv"],
      default: "movie",
    },
    rating: {
      type: Number,
      min: [0, "Rating cannot be below 0"],
      max: [10, "Rating cannot exceed 10"],
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Index for fast searching by title
movieSchema.index({ title: "text" });

const Movie = mongoose.model("AdminMovie", movieSchema);

module.exports = Movie;
