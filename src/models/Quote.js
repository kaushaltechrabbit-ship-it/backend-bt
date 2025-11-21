import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    countryCode: {
      type: String,
      required: [true, "Country Code is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      minlength: [8, "Phone number must be at least 8 digits"],
      maxlength: [20, "Phone number cannot exceed 20 digits"],
    },

   

    services: {
      type: String,
      required: [true, "Service is required"],
      
    },
  },
  { timestamps: true }
);

export default mongoose.models.Quote ||
  mongoose.model("Quote", quoteSchema);
