import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, unique: true },
        image: { type: String },
        cloudinaryId: { type: String },
        pricePerKg: { type: Number, required: true },
    },
    { timestamps: true }
);
productSchema.pre("save", function (next) {
    if (this.isModified("name")) {
        this.slug = slugify(this.name, { lower: true, strict: true });
    }
    next();
});

export default mongoose.model("Product", productSchema);
