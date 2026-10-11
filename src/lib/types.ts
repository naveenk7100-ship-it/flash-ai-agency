import { ReactNode } from "react";

export interface Project {
  id: string;
  name: string;
  tagline: string;
  category: "AI SaaS & Content" | "Computer Vision & PDE" | "EdTech & Analytics" | "Lead Intelligence";
  summary: string;
  features: string[];
  techStack: string[];
  metrics: {
    label: string;
    value: string;
  }[];
  liveStatus: "Live Production" | "Deployed System" | "Enterprise Engine";
  accentColor: string;
}

export interface Service {
  id: string;
  title: string;
  badge: string;
  description: string;
  deliverables: string[];
  tech: string[];
  priceEstimate: string;
  timeline: string;
  popular?: boolean;
}

export interface BookingSubmission {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  serviceId: string;
  preferredDate: string;
  preferredTime: string;
  budgetRange: string;
  projectBrief: string;
  status: "new" | "contacted" | "scheduled" | "completed" | "archived";
  createdAt: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  source?: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
}

export interface WhatsAppNotificationResult {
  sent: boolean;
  provider: "whatsapp_cloud_api" | "unconfigured";
  reason?: string;
  recipient?: string;
}

export interface EmailNotificationResult {
  sent: boolean;
  provider: "resend" | "unconfigured";
  reason?: string;
}
