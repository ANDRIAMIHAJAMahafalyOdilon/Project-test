import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRecipient {
  email: string;
  name: string;
  status: "pending" | "signed" | "declined";
}

export interface IDocuSignEnvelope extends Document {
  status: "draft" | "sent" | "delivered" | "completed" | "declined";
  subject: string;
  recipients: IRecipient[];
  completedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const recipientSchema = new Schema<IRecipient>(
  {
    email: { type: String, required: true },
    name: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "signed", "declined"],
      default: "pending",
    },
  },
  { _id: false }
);

const schema = new Schema<IDocuSignEnvelope>(
  {
    status: {
      type: String,
      enum: ["draft", "sent", "delivered", "completed", "declined"],
      default: "sent",
    },
    subject: { type: String, required: true },
    recipients: [recipientSchema],
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const DocuSignEnvelopeModel: Model<IDocuSignEnvelope> =
  mongoose.models.DocuSignEnvelope ??
  mongoose.model<IDocuSignEnvelope>("DocuSignEnvelope", schema);
