export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const bodyParser = false;

import { connectDB } from "@/lib/db";
import Career from "@/models/Career";
import { sendMail } from "@/lib/sendMail";
import cloudinary from "@/lib/cloudinary";

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
];

// ------------------------
// OPTIONS → CORS Preflight
// ------------------------
export async function OPTIONS(req) {
    const origin = req.headers.get("origin");

    return new Response(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin":
                allowedOrigins.includes(origin) ? origin : "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        },
    });
}

// ------------------
// POST → Main Handler
// ------------------
export async function POST(req) {
    try {
        const origin = req.headers.get("origin");

        const corsHeaders = {
            "Access-Control-Allow-Origin":
                allowedOrigins.includes(origin) ? origin : "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        };

        await connectDB();

        const formData = await req.formData();

        const name = formData.get("name");
        const email = formData.get("email");
        const phone = formData.get("phone");
        const position = formData.get("position");
        const resume = formData.get("resume");

        if (!resume) {
            return Response.json(
                { success: false, message: "Resume is required" },
                { status: 400, headers: corsHeaders }
            );
        }

        // Convert file to buffer
        const bytes = await resume.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    folder: "career-resumes",
                    use_filename: true,
                    unique_filename: false,
                    filename_override: resume.name,
                    format: "pdf"
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });


        // Save to DB
        const newApplication = await Career.create({
            name,
            email,
            phone,
            position,
            resumeUrl: uploadResult.secure_url,
        });

        // Send Email
        await sendMail({
            to: process.env.SUPPORT_EMAIL,
            subject: `New Career Application - ${position}`,
            html: `
        <h2>New Career Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Position:</strong> ${position}</p>
        <p><strong>Resume:</strong> <a href="${uploadResult.secure_url}">Download</a></p>
      `,
        });

        return Response.json(
            { success: true, message: "Application submitted successfully!" },
            { status: 200, headers: corsHeaders }
        );
    } catch (error) {
        console.error(error);
        return Response.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}
