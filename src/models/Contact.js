import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    country: {
      type: String,
      required: [true, "Country is required"],
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

    message: {
      type: String,
      required: false, // OPTIONAL
      minlength: [5, "Message must be at least 5 characters long"],
      maxlength: [500, "Message cannot exceed 500 characters"],
    },

    services: {
      type: [String],
      required: true,
      validate: {
        validator: function (v) {
          return v.length > 0;
        },
        message: "At least one service must be selected",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Contact ||
  mongoose.model("Contact", contactSchema);
