import { connectDB } from "@/lib/db";
import Career from "@/models/Career";
import { sendMail } from "@/lib/sendMail";
import cloudinary from "@/lib/cloudinary";


export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const phone = formData.get("phone");
    const position = formData.get("position");
    const resume = formData.get("resume"); // FILE

    if (!resume) {
      return Response.json(
        { success: false, message: "Resume is required" },
        { status: 400 }
      );
    }

    // Convert resume → buffer
    const bytes = await resume.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const cloudStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "career-resumes",
      },
      async (error, result) => {
        if (error) {
          console.log(error);
          return Response.json(
            { success: false, message: "File upload failed" },
            { status: 500 }
          );
        }

        // Save to MongoDB
        const newApplication = await Career.create({
          name,
          email,
          phone,
          position,
          resumeUrl: result.secure_url,
        });

        // 🔥 SEND EMAIL TO ADMIN
        await sendMail({
          to: process.env.SUPPORT_EMAIL, // you will receive this
          subject: `New Career Application - ${position}`,
          html: `
            <h2>New Career Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Position Applied:</strong> ${position}</p>
            <p><strong>Resume Link:</strong> 
              <a href="${result.secure_url}" target="_blank">Download Resume</a>
            </p>
          `,
        });

        return Response.json({
          success: true,
          message: "Application submitted successfully!",
          data: newApplication,
        });
      }
    );

    cloudStream.end(buffer);
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
