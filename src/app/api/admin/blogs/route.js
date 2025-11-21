import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Category from "@/models/Category";
import Tag from "@/models/Tag";

export async function GET() {
  try {
    await connectDB();

    const blogs = await Blog.find()
      .populate("category", "name")
      .populate("tags", "name")
      .sort({ createdAt: -1 });

    return Response.json({
      success: true,
      data: blogs,
    });

  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}