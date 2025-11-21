import { connectDB } from "@/lib/db";
import Quote from "@/models/Quote";
export async function GET() {
  await connectDB();

  try {
    const quotes = await Quote.find().sort({ createdAt: -1 }); 

    return Response.json({
      success: true,
      data: quotes,
    });

  } catch (error) {
    return Response.json(
      { success: false, message: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}