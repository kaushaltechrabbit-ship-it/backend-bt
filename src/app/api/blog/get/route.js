import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Category from "@/models/Category";
import Tag from "@/models/Tag";
export async function GET() {
  try {
    await connectDB();

    const now = new Date();

    // 1️⃣ Auto update scheduled blogs whose time has passed
    await Blog.updateMany(
      {
        isScheduled: true,
        scheduledAt: { $lte: now }
      },
      {
        $set: { isScheduled: false }
      }
    );

    // 2️⃣ Fetch visible blogs
    const blogs = await Blog.find({
      $or: [
        { isScheduled: false },
        { scheduledAt: { $lte: now } },
      ],
    })
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


