import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    weight: {
      type: Number,
    },
    height: {
      type: Number,
    },
    dailyCaloriesTarget: {
      type: Number,
    },
    goalWeight: {
      type: Number,
    },
    calorieDeficit: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
