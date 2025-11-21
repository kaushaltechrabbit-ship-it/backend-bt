import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import slugify from "slugify";
import cloudinary from "@/lib/cloudinary";

export async function PUT(req, { params }) {
    try {
        await connectDB();

       const { id } = await params;
        const formData = await req.formData();

        const title = formData.get("title");
        const description = formData.get("description");
        const category = formData.get("category");
        const tags = JSON.parse(formData.get("tags"));
        const metaTitle = formData.get("metaTitle");
        const metaDescription = formData.get("metaDescription");
        const altTag = formData.get("altTag");

        const isScheduled = formData.get("isScheduled") === "true";
        const scheduledAt = formData.get("scheduledAt");

        const newSlug = slugify(title, { lower: true, strict: true });

        let updatedData = {
            title,
            description,
            category,
            tags,
            slug: newSlug,
            metaTitle,
            metaDescription,
            altTag,
            isScheduled,
            scheduledAt: isScheduled ? new Date(scheduledAt) : null,
        };

        // Check if new image is uploaded
        const newImage = formData.get("image");
        if (newImage && typeof newImage === "object") {
            const bytes = await newImage.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadResult = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: "blog-images",
                        resource_type: "auto",
                        use_filename: true,
                        unique_filename: false,
                        filename_override: newImage.name,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            updatedData.imageUrl = uploadResult.secure_url;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, {
            new: true,
        })
            .populate("category", "name")
            .populate("tags", "name");

        return Response.json({
            success: true,
            message: "Blog updated successfully",
            data: updatedBlog,
        });
    } catch (error) {
        return Response.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}



export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;   // ✅ IMPORTANT FIX

    console.log("Deleting blog ID:", id); // debug

    const blog = await Blog.findById(id);

    if (!blog) {
      return Response.json(
        { success: false, message: "Blog not found" },
        { status: 404 }
      );
    }

    console.log("Params:", params);
console.log("ID from params:", (await params).id);

    // OPTIONAL: delete cloud image
    try {
      const publicId = blog.imageUrl.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy("blog-images/" + publicId);
    } catch (err) {
      console.log("Cloudinary deletion failed:", err.message);
    }

    await Blog.findByIdAndDelete(id);

    return Response.json({
      success: true,
      message: "Blog deleted successfully"
    });

  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
