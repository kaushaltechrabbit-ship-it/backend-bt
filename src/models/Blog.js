import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],

    slug: { type: String, unique: true, required: true },

    metaTitle: String,
    metaDescription: String,
    altTag: String,

    imageUrl: { type: String, required: true },

    // ⭐ Scheduling fields
    isScheduled: { type: Boolean, default: false },
    scheduledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Blog ||
  mongoose.model("Blog", blogSchema);
