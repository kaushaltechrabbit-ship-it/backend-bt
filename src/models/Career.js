import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Enter valid email"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      minlength: 8,
    },
    position: { type: String, required: [true, "Position is required"] },
    resumeUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Career ||
  mongoose.model("Career", careerSchema);
