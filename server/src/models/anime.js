import mongoose, { mongo, Schema } from "mongoose";

const animeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  ageRating:{
    type:String
  },
  studio: {
    type: String,
  },
  rating: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  format: {
    type: String,
    required: true,
  },
  episodes: {
    type: String,
    required: true,
  },
  longDescription: {
    type: String,
    required: true,
  },
  imageLinks: {
    type: [String],
    required: true,
  },
  imageCredits: {
    type: String,
    required: true,
  },
  source: {
    type: String,
  },

  recTitle: {
    type: String,
  },
  tags: {
    type: [String],
  },
  releaseDate: {
    type: String,
  },
});

export const Anime = mongoose.model("Anime", animeSchema);
