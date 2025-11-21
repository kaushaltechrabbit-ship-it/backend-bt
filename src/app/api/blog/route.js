export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// export const bodyParser = false;

import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import slugify from "slugify";
import cloudinary from "@/lib/cloudinary";



export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const tags = JSON.parse(formData.get("tags"));
    const metaTitle = formData.get("metaTitle");
    const metaDescription = formData.get("metaDescription");
    const altTag = formData.get("altTag");
    const image = formData.get("image");

    // ⭐ Scheduling fields
    const isScheduled = formData.get("isScheduled") === "true";
    const scheduledAt = formData.get("scheduledAt");
    console.log("isScheduled:", isScheduled);
console.log("scheduledAt:", scheduledAt);
console.log("Full formData keys:", Array.from(formData.keys()));
    if (isScheduled && !scheduledAt) {
      return Response.json(
        { success: false, message: "Scheduled date & time is required" },
        { status: 400 }
      );
    }

    if (!image) {
      return Response.json(
        { success: false, message: "Blog image is required" },
        { status: 400 }
      );
    }

    // Convert to buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: "blog-images",
          resource_type: "auto",
          use_filename: true,
          unique_filename: false,
          filename_override: image.name,
        },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(buffer);
    });

    const slug = slugify(title, { lower: true, strict: true });

    const blog = await Blog.create({
      title,
      description,
      category,
      tags,
      slug,
      metaTitle,
      metaDescription,
      altTag,
      imageUrl: uploadResult.secure_url,
      isScheduled,
      scheduledAt: isScheduled ? new Date(scheduledAt) : null,
    });

    return Response.json({ success: true, data: blog });
  } catch (error) {
    return Response.json({ success: false, message: error.message }, { status: 500 });
  }
}

