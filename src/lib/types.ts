import { ReactNode } from "react";

export type BookingStatus =
  | "New"
  | "Contacted"
  | "Discovery Scheduled"
  | "Proposal Sent"
  | "Won"
  | "Lost";

export interface BookingSubmission {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  serviceId: string;
  preferredDate: string;
  preferredTime: string;
  timezone?: string;
  budgetRange: string;
  projectBrief: string;
  referenceLinks?: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export type ReviewStatus = "pending" | "approved" | "rejected";

export interface CustomerReview {
  id: string;
  reviewerName: string;
  company: string;
  role?: string;
  rating: number; // 1 to 5
  reviewText: string;
  status: ReviewStatus;
  date: string;
  verifiedClient: boolean;
  serviceId?: string;
}

export type ProjectStatus = "published" | "draft" | "archived";
export type ProjectType = "Client System" | "Concept Architecture" | "Demo Prototype";

export interface Project {
  id: string;
  name: string;
  tagline: string;
  category: "AI Workflow" | "AI Agents" | "n8n Automation" | "Lead & CRM" | "Vision & PDE";
  projectType: ProjectType;
  status: ProjectStatus;
  problem: string;
  solution: string;
  workflow: string[];
  techStack: string[];
  outcome: string;
  metrics: {
    label: string;
    value: string;
  }[];
  screenshots?: string[];
  demoVideoUrl?: string;
  projectUrl?: string;
  featured?: boolean;
}

export interface Service {
  id: string;
  title: string;
  badge: string;
  shortDescription: string;
  problem: string;
  solution: string;
  keyFeatures: string[];
  suitableClients: string[];
  expectedWorkflow: {
    step: string;
    title: string;
    description: string;
  }[];
  startingInvestment: string;
  typicalTimeline: string;
  iconName: string;
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

export interface NotificationResult {
  sent: boolean;
  provider: string;
  reason?: string;
  recipient?: string;
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

