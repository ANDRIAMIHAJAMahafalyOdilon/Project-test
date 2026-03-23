import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPDFTemplate extends Document {
  id: string;
  name: string;
  description: string;
  category: "invoice" | "report" | "contract" | "certificate" | "job";
}

const schema = new Schema<IPDFTemplate>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["invoice", "report", "contract", "certificate", "job"],
      required: true,
    },
  },
  { timestamps: true }
);

schema.virtual("id").get(function () {
  return this._id.toHexString();
});

schema.set("toJSON", { virtuals: true });

export const PDFTemplateModel: Model<IPDFTemplate> =
  mongoose.models.PDFTemplate ?? mongoose.model<IPDFTemplate>("PDFTemplate", schema);
