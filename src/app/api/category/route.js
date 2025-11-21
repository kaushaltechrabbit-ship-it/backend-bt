import { connectDB } from "@/lib/db";
import Category from "@/models/Category";

export async function POST(req) {
  await connectDB();

  const { name } = await req.json();

  if (!name) {
    return Response.json(
      { success: false, message: "Name is required" },
      { status: 400 }
    );
  }

  const category = await Category.create({ name });

  return Response.json({ success: true, data: category });
}

export async function GET() {
  await connectDB();
  const categories = await Category.find().sort({ createdAt: -1 });
  return Response.json({ success: true, data: categories });
}
