import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";

export async function GET() {
  await connectDB();

  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); // newest first

    return Response.json({
      success: true,
      data: contacts,
    });

  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}