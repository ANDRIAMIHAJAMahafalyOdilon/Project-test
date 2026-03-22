import { DocuSignEnvelopeModel } from "../models/docusign-envelope.model";
import { AppError } from "../middlewares/errorHandler";

export type CreateEnvelopeInput = {
  subject: string;
  recipients: { email: string; name: string }[];
  documentUrl: string;
};

export async function createEnvelope(input: CreateEnvelopeInput) {
  const recipients = input.recipients.map((r) => ({
    email: r.email,
    name: r.name,
    status: "pending" as const,
  }));

  const doc = await DocuSignEnvelopeModel.create({
    subject: input.subject,
    recipients,
    status: "sent",
  });

  return {
    id: doc._id.toString(),
    status: doc.status,
    subject: doc.subject,
    recipients: doc.recipients,
    createdAt: doc.createdAt!.toISOString(),
  };
}

export async function getEnvelopes(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;
  const [data, total] = await Promise.all([
    DocuSignEnvelopeModel.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize).lean(),
    DocuSignEnvelopeModel.countDocuments(),
  ]);

  return {
    data: data.map((d) => ({
      id: d._id.toString(),
      status: d.status,
      subject: d.subject,
      recipients: d.recipients,
      createdAt: d.createdAt!.toISOString(),
      completedAt: d.completedAt?.toISOString(),
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getEnvelope(envelopeId: string) {
  const doc = await DocuSignEnvelopeModel.findById(envelopeId).lean();
  if (!doc) throw new AppError(`Envelope not found: ${envelopeId}`, 404);
  return {
    id: doc._id.toString(),
    status: doc.status,
    subject: doc.subject,
    recipients: doc.recipients,
    createdAt: doc.createdAt!.toISOString(),
    completedAt: doc.completedAt?.toISOString(),
  };
}

export async function voidEnvelope(envelopeId: string) {
  const doc = await DocuSignEnvelopeModel.findById(envelopeId);
  if (!doc) throw new AppError(`Envelope not found: ${envelopeId}`, 404);
  if (doc.status === "completed") throw new AppError("Cannot void a completed envelope", 400);

  doc.status = "declined";
  doc.recipients.forEach((r) => {
    r.status = "declined";
  });
  await doc.save();

  return {
    id: doc._id.toString(),
    status: doc.status,
    subject: doc.subject,
    recipients: doc.recipients,
    createdAt: doc.createdAt!.toISOString(),
    completedAt: doc.completedAt?.toISOString(),
  };
}
