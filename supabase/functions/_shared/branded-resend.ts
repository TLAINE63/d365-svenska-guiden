import { Resend as Provider } from "npm:resend@4.0.0";
import { brandEmail, type BrandableEmail } from "./email-branding.ts";

/** Keep the existing provider and attachments; standardize every send at its boundary. */
export class Resend {
  private provider: Provider;
  constructor(apiKey?: string) { this.provider = new Provider(apiKey); }
  emails = {
    send: (email: BrandableEmail) => this.provider.emails.send(brandEmail(email) as Parameters<Provider["emails"]["send"]>[0]),
  };
}