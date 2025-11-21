import { connectDB } from "@/lib/db";
import Tag from "@/models/Tag";
export async function POST(req) {
  await connectDB();

  const { name } = await req.json();

  if (!name) {
    return Response.json(
      { success: false, message: "Name is required" },
      { status: 400 }
    );
  }

  // Create the tag
  const tag = await Tag.create({ name });

  return Response.json({ success: true, data: tag });
}

export async function GET() {
  await connectDB();

  const tags = await Tag.find().sort({ createdAt: -1 });

  return Response.json({ success: true, data: tags });
}
