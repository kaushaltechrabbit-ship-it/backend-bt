import mongoose from "mongoose";

const SeoAuditSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: [true, "Full Name is required"],
            trim: true,
            minlength: [2, "Full Name must be at least 2 characters long"],
            maxlength: [50, "Full Name cannot exceed 50 characters"],
        },



        email: {
            type: String,
            required: [true, "Email is required"],
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
        },

        phone: {
            type: String,
            required: [true, "Phone number is required"],
            minlength: [8, "Phone number must be at least 8 digits"],
            maxlength: [20, "Phone number cannot exceed 20 digits"],
        },




        countryCode: {
            type: String,
            required: [true, "Country Code is required"],
            trim: true,
        },

        websiteUrl: {
            type: String,
            required: [true, "website url is required"],
            match: [
                /^(https?:\/\/)?([\w\-])+(\.[\w\-]+)+[/#?]?.*$/,
                "Please enter a valid website URL",
            ],

        },


        audience: {
            type: String,
            required: [true, "audience is required"],

        },



    },
    { timestamps: true }
);

export default mongoose.models.SeoAudit ||
    mongoose.model("SeoAudit", SeoAuditSchema);
