/**
 * Centralized Agency Configuration
 * FLASH.Ai Agency - AI Automation & Systems Engineering Studio
 */

export interface ContactChannel {
  id: string;
  label: string;
  number: string;
  displayNumber: string;
  display: string;
  waUrl: string;
  chatUrl: string;
  telUrl: string;
}

const primaryContact: ContactChannel = {
  id: "primary",
  label: "WhatsApp Line 1",
  number: "+91 93984 21460",
  displayNumber: "+91 93984 21460",
  display: "+91 93984 21460",
  waUrl: "https://wa.me/919398421460",
  chatUrl: "https://wa.me/919398421460",
  telUrl: "tel:+919398421460"
};

const secondaryContact: ContactChannel = {
  id: "secondary",
  label: "WhatsApp Line 2",
  number: "+91 85238 46914",
  displayNumber: "+91 85238 46914",
  display: "+91 85238 46914",
  waUrl: "https://wa.me/918523846914",
  chatUrl: "https://wa.me/918523846914",
  telUrl: "tel:+918523846914"
};

export type WhatsAppContactsList = ContactChannel[] & {
  line1: ContactChannel;
  line2: ContactChannel;
};

const contactsList = [primaryContact, secondaryContact] as WhatsAppContactsList;
contactsList.line1 = primaryContact;
contactsList.line2 = secondaryContact;

export const WHATSAPP_CONTACTS = contactsList;

export const AGENCY_CONFIG = {
  name: "FLASH.Ai Agency",
  tagline: "AI Automation & Systems Engineering Studio",
  email: process.env.NEXT_PUBLIC_AGENCY_EMAIL || "hello@flashai.agency",
  phone: "+91 93984 21460",
  secondaryPhone: "+91 85238 46914",
  location: process.env.NEXT_PUBLIC_BUSINESS_LOCATION || "",
  operatingRegions: "India, USA, UK, Canada & Australia",
  contacts: WHATSAPP_CONTACTS,
  hasPhone: true,
  get hasLocation(): boolean {
    return Boolean(this.location && this.location.trim().length > 0);
  },
  get telLink(): string {
    return "tel:+919398421460";
  },
  get whatsappLink(): string {
    return "https://wa.me/919398421460";
  }
};
