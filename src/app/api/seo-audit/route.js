import SeoAudit from "@/models/SeoAudit";
import { connectDB } from "@/lib/db";
import { sendMail } from "@/lib/sendMail";

export async function POST(req) {
  await connectDB();

  try {
    const body = await req.json();

    // Save to DB
    const seoAudit = await SeoAudit.create(body);

    // Send email notification
    await sendMail({
      to: process.env.SUPPORT_EMAIL, 
      subject: "New SEO Audit Request Received - Brand Tailors",
      html: `
        <h2>New Audit Request Submission</h2>
        <p><strong>Full Name:</strong> ${body.fullName}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Website URL:</strong> ${body.websiteUrl}</p>

        <p><strong>Phone:</strong> ${`${body.countryCode} ${body.phone}`}</p>
        <p><strong>Target Audience:</strong> ${body.audience || "Not Seleted"}</p>
      `,
    });

    return Response.json({
      success: true,
      message: "Thank you! We received your message.",
      data: seoAudit,
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

