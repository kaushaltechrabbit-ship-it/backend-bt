import Contact from "@/models/Contact";
import { connectDB } from "@/lib/db";
import { sendMail } from "@/lib/sendMail";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();

    // Save to DB
    const contact = await Contact.create(body);

    // Send email notification
    await sendMail({
      to: process.env.SUPPORT_EMAIL, // Receive email to your inbox
      subject: "New Contact Received - Brand Tailors",
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Country:</strong> ${body.country}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Phone:</strong> ${body.phone}</p>
        <p><strong>Services:</strong> ${body.services.join(", ")}</p>
        <p><strong>Message:</strong> ${body.message || "No message provided"}</p>
      `,
    });

    return Response.json({
      success: true,
      message: "Thank you! We received your message.",
      data: contact,
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

