"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  MessageSquare,
  Building,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  LogOut,
  KeyRound,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  X,
  Settings,
  Database,
  Globe,
  Users,
  Inbox,
  Check,
  ArrowRight
} from "lucide-react";
import { Instagram } from "@/components/icons/InstagramIcon";
import { Container } from "@/components/Container";
import { Lead, LeadStatus, BookingSubmission, BookingStatus, ContactSubmission } from "@/lib/types";

type AdminTab = "leads" | "bookings" | "contacts" | "settings";

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as AdminTab) || "leads";

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<{ username: string; mustChangePassword: boolean } | null>(null);

  // Tab state
  const [activeTab, setActiveTab] = useState<AdminTab>(
    ["leads", "bookings", "contacts", "settings"].includes(initialTab) ? initialTab : "leads"
  );

  // Data states
  const [leads, setLeads] = useState<Lead[]>([]);
  const [bookings, setBookings] = useState<BookingSubmission[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [dbInfo, setDbInfo] = useState<{ type: string; configured: boolean; provider: string; host?: string } | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Search & Filter states for Leads
  const [leadSearch, setLeadSearch] = useState("");
  const [leadStatusFilter, setLeadStatusFilter] = useState("all");
  const [leadServiceFilter, setLeadServiceFilter] = useState("all");
  const [leadPage, setLeadPage] = useState(1);
  const [leadLimit] = useState(10);
  const [leadTotalPages, setLeadTotalPages] = useState(1);
  const [leadTotalCount, setLeadTotalCount] = useState(0);

  // Modals
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingSubmission | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // 1. Verify Authentication
  const verifyAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          setAdminUser(data.user);
          if (data.dbInfo) setDbInfo(data.dbInfo);
          if (data.user?.mustChangePassword) {
            setShowPasswordModal(true);
          }
          return true;
        }
      }
      // If unauthorized, redirect to login
      setIsAuthenticated(false);
      router.push("/admin/login?from=/admin");
      return false;
    } catch {
      setIsAuthenticated(false);
      router.push("/admin/login?from=/admin");
      return false;
    }
  }, [router]);

  // 2. Fetch Dashboard Data
  const fetchAllData = useCallback(async () => {
    setLoadingData(true);
    setActionMessage(null);

    try {
      // 2a. Fetch Leads via /api/leads
      const leadParams = new URLSearchParams();
      if (leadSearch) leadParams.set("q", leadSearch);
      if (leadStatusFilter !== "all") leadParams.set("status", leadStatusFilter);
      if (leadServiceFilter !== "all") leadParams.set("service", leadServiceFilter);
      leadParams.set("page", String(leadPage));
      leadParams.set("limit", String(leadLimit));

      const [leadsRes, adminRes] = await Promise.all([
        fetch(`/api/leads?${leadParams.toString()}`),
        fetch("/api/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "getStats" })
        })
      ]);

      if (leadsRes.status === 401 || adminRes.status === 401) {
        setIsAuthenticated(false);
        router.push("/admin/login?from=/admin");
        return;
      }

      const leadsData = await leadsRes.json();
      if (leadsData.success) {
        setLeads(leadsData.leads || []);
        setLeadTotalPages(leadsData.pagination?.totalPages || 1);
        setLeadTotalCount(leadsData.pagination?.total || 0);
        if (leadsData.dbInfo) setDbInfo(leadsData.dbInfo);
      }

      const adminData = await adminRes.json();
      if (adminData.success) {
        setBookings(adminData.bookings || []);
        setContacts(adminData.contacts || []);
      }
    } catch (err: any) {
      setActionMessage({ type: "error", text: err.message || "Failed to refresh dashboard data." });
    } finally {
      setLoadingData(false);
    }
  }, [leadSearch, leadStatusFilter, leadServiceFilter, leadPage, leadLimit, router]);

  useEffect(() => {
    verifyAuth().then((authed) => {
      if (authed) {
        fetchAllData();
      }
    });
  }, [verifyAuth, fetchAllData]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      setIsAuthenticated(false);
      router.push("/admin/login");
    }
  };

  // Lead status update
  const handleUpdateLeadStatus = async (id: string, status: LeadStatus) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
        if (selectedLead?.id === id) setSelectedLead((prev) => (prev ? { ...prev, status } : null));
        setActionMessage({ type: "success", text: `Lead status updated to ${status}.` });
      }
    } catch {
      setActionMessage({ type: "error", text: "Failed to update lead status." });
    }
  };

  // Lead notes update
  const handleSaveLeadNotes = async (id: string, notes: string) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notes })
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, notes } : l)));
        if (selectedLead?.id === id) setSelectedLead((prev) => (prev ? { ...prev, notes } : null));
        setActionMessage({ type: "success", text: "Lead internal notes saved." });
      }
    } catch {
      setActionMessage({ type: "error", text: "Failed to save lead notes." });
    }
  };

  // Lead delete
  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this lead?")) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLead?.id === id) setSelectedLead(null);
        setLeadTotalCount((c) => Math.max(0, c - 1));
        setActionMessage({ type: "success", text: "Lead permanently removed." });
      }
    } catch {
      setActionMessage({ type: "error", text: "Failed to delete lead." });
    }
  };

  // Booking status update
  const handleUpdateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateBooking", id, status })
      });
      if (res.ok) {
        setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
        if (selectedBooking?.id === id) setSelectedBooking((prev) => (prev ? { ...prev, status } : null));
        setActionMessage({ type: "success", text: `Booking status updated to ${status}.` });
      }
    } catch {
      setActionMessage({ type: "error", text: "Failed to update booking status." });
    }
  };

  // Contact status update
  const handleUpdateContactStatus = async (id: string, status: "unread" | "read" | "replied") => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateContact", id, status })
      });
      if (res.ok) {
        setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
        setActionMessage({ type: "success", text: `Inquiry status updated to ${status}.` });
      }
    } catch {
      setActionMessage({ type: "error", text: "Failed to update inquiry status." });
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation do not match.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasswordSuccess(data.message || "Password updated successfully.");
        if (adminUser) {
          setAdminUser({ ...adminUser, mustChangePassword: false });
        }
        setTimeout(() => {
          setShowPasswordModal(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setPasswordSuccess(null);
        }, 1800);
      } else {
        setPasswordError(data.error || "Failed to update password.");
      }
    } catch (err: any) {
      setPasswordError(err.message || "Network exception while changing password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  // CSV Export for Leads
  const handleExportLeadsCSV = () => {
    if (leads.length === 0) return;
    const headers = ["ID", "Type", "Name", "Email", "Phone", "Service", "Company", "Budget", "Status", "Date", "Message"];
    const rows = leads.map((l) => [
      `"${l.id}"`,
      `"${l.type}"`,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email}"`,
      `"${l.phone || ""}"`,
      `"${(l.service || "").replace(/"/g, '""')}"`,
      `"${(l.company || "").replace(/"/g, '""')}"`,
      `"${(l.budget || "").replace(/"/g, '""')}"`,
      `"${l.status}"`,
      `"${l.createdAt}"`,
      `"${(l.message || "").replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `flash_ai_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper: WhatsApp URL for any lead/booking
  const getWhatsAppUrl = (name: string, phone: string, service?: string) => {
    const cleanPhone = phone.replace(/[^\d]/g, "");
    const target = cleanPhone.length >= 10 ? cleanPhone : "919398421460";
    const text = `Hi ${name}, this is FLASH.Ai Agency regarding your inquiry for ${service || "AI Automation"}. We reviewed your brief and would love to schedule a technical discovery call!`;
    return `https://wa.me/${target}?text=${encodeURIComponent(text)}`;
  };

  if (isAuthenticated === null) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#3B563D] animate-spin" />
          <p className="text-sm font-mono text-[#6E685F]">Authenticating staff session...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] pb-24 text-[#1C1917]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#E7E2DA]">
        <Container className="py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="font-serif font-black text-xl text-[#1C1917] tracking-tight">
                FLASH<span className="text-[#3B563D]">.Ai</span>
              </span>
              <div className="h-4 w-px bg-[#E7E2DA]" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#6E685F] font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#3B563D]" />
                Private Admin Console
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Storage Info Badge */}
              <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E7E2DA] bg-white text-xs font-mono text-[#6E685F]">
                <div
                  className={`w-2 h-2 rounded-full ${
                    dbInfo?.configured ? "bg-emerald-500" : "bg-amber-500"
                  }`}
                />
                <span>Storage: {dbInfo?.type || "Local Persistent"}</span>
              </div>

              {/* Password change button */}
              <button
                onClick={() => setShowPasswordModal(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  adminUser?.mustChangePassword
                    ? "bg-amber-100 border-amber-300 text-amber-900 animate-pulse font-bold"
                    : "border-[#E7E2DA] text-[#1C1917] hover:bg-[#E7E2DA]/40"
                }`}
                title="Change admin password"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden md:inline">
                  {adminUser?.mustChangePassword ? "Change Initial Password" : "Password"}
                </span>
              </button>

              {/* Refresh button */}
              <button
                onClick={fetchAllData}
                disabled={loadingData}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E7E2DA] bg-white text-xs font-medium text-[#1C1917] hover:bg-[#E7E2DA]/40 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mandatory Password Change Warning Banner */}
      {adminUser?.mustChangePassword && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-3 text-amber-900">
          <Container>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="font-semibold">Security Action Required:</span>
                <span>
                  You are currently logged in with the initial setup password. Please update your administrative password to proceed safely.
                </span>
              </div>
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium shrink-0 transition-colors"
              >
                Update Password Now
              </button>
            </div>
          </Container>
        </div>
      )}

      {/* Action Notification Toast */}
      {actionMessage && (
        <div
          className={`py-2 px-4 text-xs font-medium text-center border-b ${
            actionMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <Container className="flex items-center justify-between">
            <span>{actionMessage.text}</span>
            <button
              onClick={() => setActionMessage(null)}
              className="text-xs opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </Container>
        </div>
      )}

      <Container className="pt-8">
        {/* Navigation Tabs (4 Clear Polished Tabs) */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[#E7E2DA] pb-4">
          <button
            onClick={() => setActiveTab("leads")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "leads"
                ? "bg-[#3B563D] text-white shadow-sm"
                : "text-[#6E685F] hover:text-[#1C1917] hover:bg-[#E7E2DA]/30"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Leads CRM Pipeline</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === "leads" ? "bg-white/20 text-white" : "bg-stone-100 text-[#6E685F]"
              }`}
            >
              {leadTotalCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("bookings")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "bookings"
                ? "bg-[#3B563D] text-white shadow-sm"
                : "text-[#6E685F] hover:text-[#1C1917] hover:bg-[#E7E2DA]/30"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Bookings</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === "bookings" ? "bg-white/20 text-white" : "bg-stone-100 text-[#6E685F]"
              }`}
            >
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("contacts")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "contacts"
                ? "bg-[#3B563D] text-white shadow-sm"
                : "text-[#6E685F] hover:text-[#1C1917] hover:bg-[#E7E2DA]/30"
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Contact Enquiries</span>
            <span
              className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeTab === "contacts" ? "bg-white/20 text-white" : "bg-stone-100 text-[#6E685F]"
              }`}
            >
              {contacts.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === "settings"
                ? "bg-[#3B563D] text-white shadow-sm"
                : "text-[#6E685F] hover:text-[#1C1917] hover:bg-[#E7E2DA]/30"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Website Settings & System</span>
          </button>
        </div>

        {/* ======================================================== */}
        {/* TAB 1: LEADS CRM PIPELINE                                */}
        {/* ======================================================== */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#1C1917]">
                  Unified Leads Pipeline
                </h2>
                <p className="text-xs text-[#6E685F] mt-1">
                  Active customer inquiries aggregated from bookings and contact submissions.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportLeadsCSV}
                  disabled={leads.length === 0}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E7E2DA] bg-white text-xs font-medium text-[#1C1917] hover:bg-[#E7E2DA]/30 transition-colors disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-[#E7E2DA] p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2 relative">
                  <Search className="w-4 h-4 text-[#6E685F] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={leadSearch}
                    onChange={(e) => {
                      setLeadSearch(e.target.value);
                      setLeadPage(1);
                    }}
                    placeholder="Search by name, email, phone, company, or brief..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E7E2DA] bg-[#FDFBF7] text-[#1C1917] placeholder-[#6E685F]/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#3B563D]"
                  />
                </div>

                <div>
                  <select
                    value={leadStatusFilter}
                    onChange={(e) => {
                      setLeadStatusFilter(e.target.value);
                      setLeadPage(1);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7E2DA] bg-[#FDFBF7] text-[#1C1917] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#3B563D]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Converted">Converted</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div>
                  <select
                    value={leadServiceFilter}
                    onChange={(e) => {
                      setLeadServiceFilter(e.target.value);
                      setLeadPage(1);
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7E2DA] bg-[#FDFBF7] text-[#1C1917] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#3B563D]"
                  >
                    <option value="all">All Services</option>
                    <option value="workflow">AI Workflow</option>
                    <option value="agents">Custom Agents</option>
                    <option value="n8n">n8n Development</option>
                    <option value="booking">Appointment Systems</option>
                    <option value="instagram">Instagram / Social</option>
                    <option value="website">Website Design</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-3xl border border-[#E7E2DA] shadow-sm overflow-hidden">
              {leads.length === 0 ? (
                <div className="py-16 text-center px-6">
                  <p className="text-sm font-semibold text-[#1C1917]">No Leads Found</p>
                  <p className="text-xs text-[#6E685F] mt-1">
                    {leadSearch || leadStatusFilter !== "all"
                      ? "No submissions match your active filter criteria."
                      : "New leads submitted via booking or contact forms will appear here."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#FDFBF7] border-b border-[#E7E2DA] text-xs font-mono uppercase tracking-wider text-[#6E685F]">
                      <tr>
                        <th className="py-3.5 px-6 font-semibold">Customer</th>
                        <th className="py-3.5 px-6 font-semibold">Service</th>
                        <th className="py-3.5 px-6 font-semibold">Phone / WhatsApp</th>
                        <th className="py-3.5 px-6 font-semibold">Date</th>
                        <th className="py-3.5 px-6 font-semibold">Status</th>
                        <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E2DA]">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-[#FDFBF7]/60 transition-colors">
                          <td className="py-3.5 px-6">
                            <div className="font-medium text-[#1C1917]">{lead.name}</div>
                            {lead.company && (
                              <div className="text-xs text-[#6E685F] flex items-center gap-1 mt-0.5">
                                <Building className="w-3 h-3" />
                                <span>{lead.company}</span>
                              </div>
                            )}
                            <div className="text-xs text-[#6E685F] truncate max-w-xs">{lead.email}</div>
                          </td>

                          <td className="py-3.5 px-6">
                            <span className="font-mono text-xs bg-[#FDFBF7] px-2 py-0.5 rounded border border-[#E7E2DA] text-[#1C1917]">
                              {lead.service || "General"}
                            </span>
                            {lead.budget && (
                              <div className="text-xs text-[#3B563D] mt-1 font-medium">{lead.budget}</div>
                            )}
                          </td>

                          <td className="py-3.5 px-6">
                            {lead.phone ? (
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-[#1C1917]">{lead.phone}</span>
                                <a
                                  href={getWhatsAppUrl(lead.name, lead.phone, lead.service)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100"
                                  title="Open WhatsApp chat"
                                >
                                  <MessageSquare className="w-3 h-3" />
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                            ) : (
                              <span className="text-xs text-[#6E685F] italic">No phone</span>
                            )}
                            <a
                              href={`mailto:${lead.email}?subject=FLASH.Ai%20Agency%20Follow-Up`}
                              className="text-xs text-[#6E685F] hover:text-[#3B563D] flex items-center gap-1 mt-1"
                            >
                              <Mail className="w-3 h-3" />
                              <span>Email Lead</span>
                            </a>
                          </td>

                          <td className="py-3.5 px-6 font-mono text-xs text-[#6E685F] whitespace-nowrap">
                            {new Date(lead.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </td>

                          <td className="py-3.5 px-6">
                            <select
                              value={lead.status}
                              onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                              className="text-xs font-medium rounded-lg border border-[#E7E2DA] bg-white px-2 py-1 text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#3B563D]"
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Converted">Converted</option>
                              <option value="Archived">Archived</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setSelectedLead(lead)}
                                className="p-1.5 rounded-lg border border-[#E7E2DA] text-[#6E685F] hover:text-[#1C1917] hover:bg-[#E7E2DA]/40 transition-colors"
                                title="View full brief"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteLead(lead.id)}
                                className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                                title="Delete lead"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              <div className="border-t border-[#E7E2DA] px-6 py-3 flex items-center justify-between text-xs text-[#6E685F]">
                <div>
                  Showing {leads.length} of {leadTotalCount} total leads
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLeadPage((p) => Math.max(1, p - 1))}
                    disabled={leadPage <= 1}
                    className="p-1.5 rounded border border-[#E7E2DA] bg-white disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-mono">
                    Page {leadPage} of {leadTotalPages}
                  </span>
                  <button
                    onClick={() => setLeadPage((p) => Math.min(leadTotalPages, p + 1))}
                    disabled={leadPage >= leadTotalPages}
                    className="p-1.5 rounded border border-[#E7E2DA] bg-white disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: BOOKINGS                                          */}
        {/* ======================================================== */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#1C1917]">
                Discovery Call Bookings ({bookings.length})
              </h2>
              <p className="text-xs text-[#6E685F] mt-1">
                Technical scoping requests received via the client booking intake form.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-[#E7E2DA] shadow-sm overflow-hidden">
              {bookings.length === 0 ? (
                <div className="py-16 text-center px-6">
                  <p className="text-sm font-semibold text-[#1C1917]">No Bookings Yet</p>
                  <p className="text-xs text-[#6E685F] mt-1">Client booking submissions will appear here.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-[#FDFBF7] border-b border-[#E7E2DA] text-xs font-mono uppercase tracking-wider text-[#6E685F]">
                      <tr>
                        <th className="py-3.5 px-6 font-semibold">Client</th>
                        <th className="py-3.5 px-6 font-semibold">Company / Service</th>
                        <th className="py-3.5 px-6 font-semibold">Preferred Slot</th>
                        <th className="py-3.5 px-6 font-semibold">Budget</th>
                        <th className="py-3.5 px-6 font-semibold">Status</th>
                        <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E7E2DA]">
                      {bookings.map((b) => (
                        <tr key={b.id} className="hover:bg-[#FDFBF7]/60 transition-colors">
                          <td className="py-3.5 px-6">
                            <div className="font-medium text-[#1C1917]">{b.fullName}</div>
                            <div className="text-xs text-[#6E685F]">{b.email}</div>
                            {b.phone && <div className="text-xs font-mono text-[#3B563D]">{b.phone}</div>}
                          </td>

                          <td className="py-3.5 px-6">
                            <div className="font-medium text-[#1C1917]">{b.company}</div>
                            <span className="font-mono text-xs bg-[#FDFBF7] px-2 py-0.5 rounded border border-[#E7E2DA] text-[#6E685F] inline-block mt-0.5">
                              {b.serviceId}
                            </span>
                          </td>

                          <td className="py-3.5 px-6 font-mono text-xs">
                            <div className="text-[#1C1917]">{b.preferredDate}</div>
                            <div className="text-[#6E685F]">{b.preferredTime} ({b.timezone || "UTC"})</div>
                          </td>

                          <td className="py-3.5 px-6 font-mono text-xs font-semibold text-[#3B563D]">
                            {b.budgetRange}
                          </td>

                          <td className="py-3.5 px-6">
                            <select
                              value={b.status}
                              onChange={(e) => handleUpdateBookingStatus(b.id, e.target.value as BookingStatus)}
                              className="text-xs font-medium rounded-lg border border-[#E7E2DA] bg-white px-2 py-1 text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#3B563D]"
                            >
                              <option value="New">New</option>
                              <option value="Discovery Scheduled">Discovery Scheduled</option>
                              <option value="Proposal Sent">Proposal Sent</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Won">Won</option>
                              <option value="Lost">Lost</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-6 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              {b.phone && (
                                <a
                                  href={getWhatsAppUrl(b.fullName, b.phone, b.serviceId)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                                  title="WhatsApp Follow-up"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </a>
                              )}
                              <button
                                onClick={() => setSelectedBooking(b)}
                                className="p-1.5 rounded-lg border border-[#E7E2DA] text-[#6E685F] hover:text-[#1C1917] hover:bg-[#E7E2DA]/40 transition-colors"
                                title="View brief"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CONTACT ENQUIRIES                                 */}
        {/* ======================================================== */}
        {activeTab === "contacts" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#1C1917]">
                Contact Inquiries ({contacts.length})
              </h2>
              <p className="text-xs text-[#6E685F] mt-1">
                Direct messages submitted via the /contact form.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {contacts.length === 0 ? (
                <div className="col-span-2 py-16 text-center bg-white rounded-3xl border border-[#E7E2DA]">
                  <p className="text-sm font-semibold text-[#1C1917]">No Messages</p>
                  <p className="text-xs text-[#6E685F] mt-1">Submissions from /contact will appear here.</p>
                </div>
              ) : (
                contacts.map((c) => (
                  <div key={c.id} className="bg-white rounded-2xl border border-[#E7E2DA] p-6 shadow-sm flex flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h3 className="font-semibold text-[#1C1917] text-base">{c.name}</h3>
                          <a href={`mailto:${c.email}`} className="text-xs text-[#3B563D] hover:underline font-mono">
                            {c.email}
                          </a>
                          {c.phone && <div className="text-xs font-mono text-[#6E685F] mt-0.5">{c.phone}</div>}
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                            c.status === "unread"
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          }`}
                        >
                          {c.status}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-[#1C1917] mt-3">
                        Subject: {c.subject}
                      </div>
                      <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E7E2DA] text-xs text-[#1C1917] whitespace-pre-wrap mt-2 leading-relaxed">
                        {c.message}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#E7E2DA] flex items-center justify-between text-xs text-[#6E685F]">
                      <span className="font-mono text-[11px]">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        {c.phone && (
                          <a
                            href={getWhatsAppUrl(c.name, c.phone, c.subject)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium text-xs hover:bg-emerald-100 flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3" />
                            <span>WhatsApp</span>
                          </a>
                        )}
                        <a
                          href={`mailto:${c.email}?subject=Re:%20${encodeURIComponent(c.subject)}`}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 text-[#1C1917] border border-[#E7E2DA] font-medium text-xs hover:bg-stone-200 flex items-center gap-1"
                        >
                          <Mail className="w-3 h-3" />
                          <span>Reply</span>
                        </a>
                        {c.status !== "replied" && (
                          <button
                            onClick={() => handleUpdateContactStatus(c.id, "replied")}
                            className="px-2.5 py-1 rounded-lg bg-[#3B563D] text-white font-medium text-xs hover:bg-[#324933]"
                          >
                            Mark Replied
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: WEBSITE SETTINGS & SYSTEM HEALTH                  */}
        {/* ======================================================== */}
        {activeTab === "settings" && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#1C1917]">
                Website Settings & System Overview
              </h2>
              <p className="text-xs text-[#6E685F] mt-1">
                Official contact channels, database persistence status, and administrative credentials.
              </p>
            </div>

            {/* Official Agency Channels Card */}
            <div className="bg-white rounded-3xl border border-[#E7E2DA] p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-[#1C1917] mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#3B563D]" />
                Official Agency Contact Information
              </h3>
              <p className="text-xs text-[#6E685F] mb-6">
                These official contact channels are displayed across the public website footer, contact section, and emails.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E7E2DA]">
                  <span className="text-[10px] font-mono uppercase text-[#6E685F] font-semibold block mb-1">
                    Official Email
                  </span>
                  <a
                    href="mailto:flashai.digital@gmail.com"
                    className="text-sm font-semibold text-[#1C1917] hover:text-[#3B563D] flex items-center gap-1.5"
                  >
                    <Mail className="w-4 h-4 text-[#3B563D]" />
                    flashai.digital@gmail.com
                  </a>
                  <p className="text-[11px] text-[#6E685F] mt-1">
                    Opens mail composer directly on click.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E7E2DA]">
                  <span className="text-[10px] font-mono uppercase text-[#6E685F] font-semibold block mb-1">
                    Official Instagram
                  </span>
                  <a
                    href="https://www.instagram.com/flash__ai__digital/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#1C1917] hover:text-[#3B563D] flex items-center gap-1.5"
                  >
                    <Instagram className="w-4 h-4 text-[#E1306C]" />
                    @flash__ai__digital
                    <ExternalLink className="w-3 h-3 text-[#6E685F]" />
                  </a>
                  <p className="text-[11px] text-[#6E685F] mt-1">
                    https://www.instagram.com/flash__ai__digital/
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E7E2DA]">
                  <span className="text-[10px] font-mono uppercase text-[#6E685F] font-semibold block mb-1">
                    WhatsApp Line 1 (Support)
                  </span>
                  <a
                    href="https://wa.me/919398421460"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#1C1917] hover:text-[#3B563D] flex items-center gap-1.5"
                  >
                    <Phone className="w-4 h-4 text-[#25D366]" />
                    +91 93984 21460
                    <ExternalLink className="w-3 h-3 text-[#6E685F]" />
                  </a>
                  <p className="text-[11px] text-[#6E685F] mt-1">
                    Primary 24/7 direct client line.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E7E2DA]">
                  <span className="text-[10px] font-mono uppercase text-[#6E685F] font-semibold block mb-1">
                    WhatsApp Line 2 (Engineering)
                  </span>
                  <a
                    href="https://wa.me/918523846914"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-[#1C1917] hover:text-[#3B563D] flex items-center gap-1.5"
                  >
                    <Phone className="w-4 h-4 text-[#25D366]" />
                    +91 85238 46914
                    <ExternalLink className="w-3 h-3 text-[#6E685F]" />
                  </a>
                  <p className="text-[11px] text-[#6E685F] mt-1">
                    Technical scoping and direct engineer chat.
                  </p>
                </div>
              </div>
            </div>

            {/* Database & Storage Engine Card */}
            <div className="bg-white rounded-3xl border border-[#E7E2DA] p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-[#1C1917] mb-2 flex items-center gap-2">
                <Database className="w-5 h-5 text-[#3B563D]" />
                Database & Cloud Storage Engine
              </h3>
              <p className="text-xs text-[#6E685F] mb-6">
                Active lead persistence backend for production and local environments.
              </p>

              <div className="p-5 rounded-2xl bg-[#FDFBF7] border border-[#E7E2DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-mono uppercase text-[#6E685F] font-semibold">Active Backend Engine</div>
                  <div className="text-base font-bold text-[#1C1917] mt-0.5 flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        dbInfo?.configured ? "bg-emerald-500" : "bg-amber-500"
                      }`}
                    />
                    <span>{dbInfo?.type || "Local Persistent Engine"}</span>
                  </div>
                  <p className="text-xs text-[#6E685F] mt-1">
                    {dbInfo?.provider === "postgres"
                      ? `Neon Serverless PostgreSQL active${dbInfo?.host ? ` (${dbInfo.host})` : ""}. All leads, bookings, contact inquiries, and credentials persist in relational tables.`
                      : dbInfo?.configured
                      ? "Cloud persistence active via Upstash Redis REST API. All leads and bookings persist across serverless instances."
                      : "Using local filesystem JSON storage. Survives restarts locally. For production, configure DATABASE_URL in Vercel environment variables."}
                  </p>
                </div>

                <div className="shrink-0 font-mono text-xs bg-white px-3 py-1.5 rounded-xl border border-[#E7E2DA] text-[#6E685F]">
                  Provider: {dbInfo?.provider || "local"}
                </div>
              </div>
            </div>

            {/* Security & Admin Credentials Card */}
            <div className="bg-white rounded-3xl border border-[#E7E2DA] p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-serif font-bold text-[#1C1917] mb-2 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#3B563D]" />
                Security & Administrative Credentials
              </h3>
              <p className="text-xs text-[#6E685F] mb-6">
                Admin session cookies are signed with HMAC-SHA256 and stored in HttpOnly cookies with 7-day expiration.
              </p>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E7E2DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-[#1C1917] block">Admin Account Username:</span>
                    <span className="font-mono text-[#6E685F]">{adminUser?.username || "admin"}</span>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#3B563D] text-white font-medium hover:bg-[#324933] transition-colors"
                  >
                    Change Admin Password
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E7E2DA] space-y-1.5 text-[#6E685F]">
                  <strong className="text-[#1C1917] block font-semibold">How to update setup credentials:</strong>
                  <p>
                    1. Run <code className="bg-white px-1.5 py-0.5 rounded border border-[#E7E2DA] text-[#1C1917]">node scripts/setup_admin.js [user] [pass]</code> locally to rehash credentials.
                  </p>
                  <p>
                    2. In Vercel Project Settings, add <code className="bg-white px-1.5 py-0.5 rounded border border-[#E7E2DA] text-[#1C1917]">ADMIN_USERNAME</code>, <code className="bg-white px-1.5 py-0.5 rounded border border-[#E7E2DA] text-[#1C1917]">ADMIN_PASSWORD_HASH</code>, and <code className="bg-white px-1.5 py-0.5 rounded border border-[#E7E2DA] text-[#1C1917]">ADMIN_SESSION_SECRET</code>.
                  </p>
                  <p>
                    3. Credentials are NEVER committed to Git or exposed client-side.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>

      {/* LEAD DETAIL MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E7E2DA] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#6E685F] block mb-1">
                  {selectedLead.type.toUpperCase()} INTAKE • STATUS: {selectedLead.status}
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#1C1917]">{selectedLead.name}</h3>
                {selectedLead.company && <p className="text-xs text-[#6E685F]">{selectedLead.company}</p>}
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-1.5 rounded-lg border border-[#E7E2DA] text-[#6E685F] hover:text-[#1C1917]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#FDFBF7] border border-[#E7E2DA]">
                <div>
                  <span className="text-[10px] font-mono text-[#6E685F] block">EMAIL</span>
                  <a href={`mailto:${selectedLead.email}`} className="font-semibold text-[#1C1917] hover:underline">
                    {selectedLead.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#6E685F] block">PHONE</span>
                  <span className="font-mono text-[#1C1917]">{selectedLead.phone || "Not provided"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#6E685F] block">SERVICE</span>
                  <span className="font-semibold text-[#1C1917]">{selectedLead.service}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#6E685F] block">BUDGET</span>
                  <span className="font-semibold text-[#3B563D]">{selectedLead.budget || "Standard"}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#6E685F] block mb-1 font-semibold">
                  Project Brief / Inquiry Message
                </span>
                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E7E2DA] text-[#1C1917] whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                  {selectedLead.message}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#6E685F] block mb-1 font-semibold">
                  Agency Internal Notes
                </span>
                <textarea
                  id="leadNotesInput"
                  rows={3}
                  defaultValue={selectedLead.notes || ""}
                  placeholder="Add private staff notes on qualification, discovery calls, or deal stages..."
                  className="w-full p-3 rounded-xl border border-[#E7E2DA] bg-[#FDFBF7] text-[#1C1917] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#3B563D]"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => {
                      const input = document.getElementById("leadNotesInput") as HTMLTextAreaElement;
                      if (input) handleSaveLeadNotes(selectedLead.id, input.value);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#3B563D] text-white text-xs font-medium hover:bg-[#324933]"
                  >
                    Save Notes
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E7E2DA] flex items-center justify-between gap-3">
                <span className="text-xs font-mono text-[#6E685F]">
                  Created: {new Date(selectedLead.createdAt).toLocaleString()}
                </span>
                {selectedLead.phone && (
                  <a
                    href={getWhatsAppUrl(selectedLead.name, selectedLead.phone, selectedLead.service)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Follow-up</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOOKING DETAIL MODAL */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E7E2DA] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#6E685F] block mb-1">
                  BOOKING REQUEST • STATUS: {selectedBooking.status}
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#1C1917]">{selectedBooking.fullName}</h3>
                <p className="text-xs text-[#6E685F]">{selectedBooking.company}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-lg border border-[#E7E2DA] text-[#6E685F] hover:text-[#1C1917]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[#FDFBF7] border border-[#E7E2DA]">
                <div>
                  <span className="text-[10px] font-mono text-[#6E685F] block">EMAIL</span>
                  <a href={`mailto:${selectedBooking.email}`} className="font-semibold text-[#1C1917] hover:underline">
                    {selectedBooking.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#6E685F] block">PHONE</span>
                  <span className="font-mono text-[#1C1917]">{selectedBooking.phone || "Not provided"}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#6E685F] block">SERVICE</span>
                  <span className="font-semibold text-[#1C1917]">{selectedBooking.serviceId}</span>
                </div>
                <div>
                  <span className="text-[10px] font-mono text-[#6E685F] block">SLOT & TIMEZONE</span>
                  <span className="font-mono text-[#1C1917]">
                    {selectedBooking.preferredDate} ({selectedBooking.preferredTime}) [{selectedBooking.timezone || "UTC"}]
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-[#6E685F] block mb-1 font-semibold">
                  Technical Project Brief
                </span>
                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E7E2DA] text-[#1C1917] whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">
                  {selectedBooking.projectBrief}
                </div>
              </div>

              {selectedBooking.referenceLinks && (
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#6E685F] block mb-1 font-semibold">
                    Reference Links
                  </span>
                  <div className="p-3 rounded-xl bg-[#FDFBF7] border border-[#E7E2DA] text-xs font-mono text-[#3B563D] break-all">
                    {selectedBooking.referenceLinks}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-[#E7E2DA] flex items-center justify-between gap-3">
                <span className="text-xs font-mono text-[#6E685F]">
                  Received: {new Date(selectedBooking.createdAt).toLocaleString()}
                </span>
                {selectedBooking.phone && (
                  <a
                    href={getWhatsAppUrl(selectedBooking.fullName, selectedBooking.phone, selectedBooking.serviceId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp Chat</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E7E2DA] max-w-md w-full p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#3B563D]" />
                <h3 className="text-xl font-serif font-bold text-[#1C1917]">
                  Change Admin Password
                </h3>
              </div>
              {!adminUser?.mustChangePassword && (
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="p-1 rounded-lg text-[#6E685F] hover:text-[#1C1917]"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            <p className="text-xs text-[#6E685F] mb-6">
              {adminUser?.mustChangePassword
                ? "First login detected. For security, you must update the initial password before proceeding."
                : "Update your administrative password. Password must be at least 8 characters long."}
            </p>

            {passwordError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#6E685F] mb-1 font-semibold">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] bg-[#FDFBF7] text-[#1C1917] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B563D] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#6E685F] mb-1 font-semibold">
                  New Password (min. 8 characters)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] bg-[#FDFBF7] text-[#1C1917] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B563D] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#6E685F] mb-1 font-semibold">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] bg-[#FDFBF7] text-[#1C1917] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B563D] font-mono"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                {!adminUser?.mustChangePassword && (
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#E7E2DA] text-xs font-medium text-[#6E685F] hover:bg-[#FDFBF7]"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#3B563D] hover:bg-[#324933] text-[#FDFBF7] text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {passwordLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save New Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6 text-xs text-[#6E685F]">Loading admin console...</div>}>
      <AdminDashboardContent />
    </Suspense>
  );
}
