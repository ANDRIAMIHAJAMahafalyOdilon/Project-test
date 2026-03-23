export type SignatureRequest = {
  documentName: string;
  recipientEmail: string;
};

export class DocusignService {
  async createSignatureRequest(payload: SignatureRequest): Promise<{ envelopeId: string; status: string }> {
    // Placeholder for real DocuSign API integration.
    return {
      envelopeId: `env_${payload.documentName.replace(/\s+/g, "_").toLowerCase()}`,
      status: "sent",
    };
  }
}

export const docusignService = new DocusignService();
