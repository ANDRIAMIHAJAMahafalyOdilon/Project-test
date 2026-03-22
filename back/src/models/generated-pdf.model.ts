import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGeneratedPDF extends Document {
  url: string;
  filename: string;
  size: number;
  templateId: string;
  buffer?: Buffer;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema<IGeneratedPDF>(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
    size: { type: Number, required: true },
    templateId: { type: String, required: true },
    buffer: { type: Buffer },
  },
  { timestamps: true }
);

export const GeneratedPDFModel: Model<IGeneratedPDF> =
  mongoose.models.GeneratedPDF ?? mongoose.model<IGeneratedPDF>("GeneratedPDF", schema);
