/**
 * Centralized Agency Configuration
 * Strictly adheres to project privacy:
 * - Phone numbers are only shown when configured via NEXT_PUBLIC_BUSINESS_PHONE.
 * - Official email is preserved as hello@flashai.agency.
 */
export const AGENCY_CONFIG = {
  name: "FLASH.Ai Agency",
  tagline: "AI Automation & Systems Engineering Studio",
  email: process.env.NEXT_PUBLIC_AGENCY_EMAIL || "hello@flashai.agency",
  phone: process.env.NEXT_PUBLIC_BUSINESS_PHONE || "",
  location: process.env.NEXT_PUBLIC_BUSINESS_LOCATION || "",
  operatingRegions: "India, USA, UK, Canada & Australia",
  get hasPhone(): boolean {
    return Boolean(this.phone && this.phone.trim().length > 0);
  },
  get hasLocation(): boolean {
    return Boolean(this.location && this.location.trim().length > 0);
  },
  get telLink(): string {
    return this.hasPhone ? `tel:${this.phone.replace(/[^+\d]/g, "")}` : "";
  },
  get whatsappLink(): string {
    return this.hasPhone ? `https://wa.me/${this.phone.replace(/[^\d]/g, "")}` : "";
  }
};
