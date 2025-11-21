import Quote from "@/models/Quote";
import { connectDB } from "@/lib/db";
import { sendMail } from "@/lib/sendMail";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();

    // Save to DB
    const quote = await Quote.create(body);

    // Send email notification
    await sendMail({
      to: process.env.SUPPORT_EMAIL, 
      subject: "New Quote Received - Brand Tailors",
      html: `
        <h2>New Quote Submission</h2>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Phone:</strong> ${`${body.countryCode} ${body.phone}`}</p>
        <p><strong>Service:</strong> ${body.services || "Not Seleted"}</p>
      `,
    });

    return Response.json({
      success: true,
      message: "Thank you! We received your message.",
      data: quote,
    });

  } catch (error) {
    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      return Response.json({ success: false, message: firstError }, { status: 400 });
    }

    return Response.json(
      { success: false, message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}

