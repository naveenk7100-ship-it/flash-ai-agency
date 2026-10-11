"use client";

import React, { useState, useEffect, useCallback } from "react";
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
  X
} from "lucide-react";
import { Container } from "@/components/Container";
import { Lead, LeadStatus } from "@/lib/types";

export default function AdminLeadsPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminUser, setAdminUser] = useState<{ username: string; mustChangePassword: boolean } | null>(null);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Change Password state
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  const [changePasswordSuccess, setChangePasswordSuccess] = useState<string | null>(null);

  // Leads data state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [leadError, setLeadError] = useState<string | null>(null);
  const [dbInfo, setDbInfo] = useState<{ type: string; configured: boolean; provider: string } | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  // Modal / Detail state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingNotes, setEditingNotes] = useState<{ id: string; notes: string } | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  // 1. Check Authentication on Mount
  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/me");
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          setAdminUser(data.user);
          if (data.user?.mustChangePassword) {
            setShowChangePasswordModal(true);
          }
          return true;
        }
      }
      setIsAuthenticated(false);
      return false;
    } catch {
      setIsAuthenticated(false);
      return false;
    }
  }, []);

  // 2. Fetch Leads
  const fetchLeads = useCallback(async () => {
    setLoadingLeads(true);
    setLeadError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (serviceFilter !== "all") params.set("service", serviceFilter);
      params.set("page", String(page));
      params.set("limit", String(limit));

      const res = await fetch(`/api/leads?${params.toString()}`);
      if (res.status === 401) {
        setIsAuthenticated(false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalLeads(data.pagination?.total || 0);
        if (data.dbInfo) setDbInfo(data.dbInfo);
      } else {
        setLeadError(data.error || "Failed to load leads.");
      }
    } catch (err: any) {
      setLeadError(err.message || "Failed to connect to lead service.");
    } finally {
      setLoadingLeads(false);
    }
  }, [searchQuery, statusFilter, serviceFilter, page, limit]);

  useEffect(() => {
    checkAuth().then((authed) => {
      if (authed) {
        fetchLeads();
      }
    });
  }, [checkAuth, fetchLeads]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAdminUser(data.user);
        if (data.user?.mustChangePassword) {
          setShowChangePasswordModal(true);
        }
        fetchLeads();
      } else {
        setLoginError(data.error || "Invalid username or password.");
      }
    } catch (err: any) {
      setLoginError(err.message || "Login request failed.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } finally {
      setIsAuthenticated(false);
      setAdminUser(null);
      setLeads([]);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError(null);
    setChangePasswordSuccess(null);

    if (newPassword.length < 8) {
      setChangePasswordError("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setChangePasswordError("New password and confirmation do not match.");
      return;
    }

    setChangePasswordLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setChangePasswordSuccess(data.message || "Password updated successfully.");
        if (adminUser) {
          setAdminUser({ ...adminUser, mustChangePassword: false });
        }
        setTimeout(() => {
          setShowChangePasswordModal(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setChangePasswordSuccess(null);
        }, 1800);
      } else {
        setChangePasswordError(data.error || "Failed to update password.");
      }
    } catch (err: any) {
      setChangePasswordError(err.message || "Network error while updating password.");
    } finally {
      setChangePasswordLoading(false);
    }
  };

  // Handle Lead Status Update
  const handleUpdateStatus = async (id: string, newStatus: LeadStatus) => {
    setUpdatingStatusId(id);
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, status: newStatus } : l))
        );
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
      }
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // Handle Save Notes
  const handleSaveNotes = async (id: string, notes: string) => {
    try {
      const res = await fetch("/api/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notes })
      });
      if (res.ok) {
        setLeads((prev) =>
          prev.map((l) => (l.id === id ? { ...l, notes } : l))
        );
        if (selectedLead && selectedLead.id === id) {
          setSelectedLead({ ...selectedLead, notes });
        }
        setEditingNotes(null);
      }
    } catch {
      // ignore
    }
  };

  // Handle Delete Lead
  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this lead?")) return;
    try {
      const res = await fetch(`/api/leads?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setLeads((prev) => prev.filter((l) => l.id !== id));
        if (selectedLead?.id === id) setSelectedLead(null);
        setTotalLeads((prev) => Math.max(0, prev - 1));
      }
    } catch {
      // ignore
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
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

  // Helper: Format WhatsApp URL
  const getWhatsAppUrl = (lead: Lead) => {
    const rawPhone = lead.phone || "";
    const cleanPhone = rawPhone.replace(/[^\d]/g, "");
    const targetPhone = cleanPhone.length >= 10 ? cleanPhone : "919398421460";
    const text = `Hi ${lead.name}, this is FLASH.Ai Agency regarding your inquiry for ${lead.service || "AI Automation"}. We reviewed your brief and would love to schedule a discovery discussion!`;
    return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
  };

  // Render Status Badge
  const renderStatusBadge = (status: LeadStatus) => {
    const styles: Record<string, string> = {
      New: "bg-emerald-50 text-emerald-800 border-emerald-200",
      Contacted: "bg-blue-50 text-blue-800 border-blue-200",
      "In Progress": "bg-amber-50 text-amber-800 border-amber-200",
      Converted: "bg-purple-50 text-purple-800 border-purple-200",
      Archived: "bg-stone-100 text-stone-600 border-stone-200"
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          styles[status] || styles.New
        }`}
      >
        {status}
      </span>
    );
  };

  // If loading initial auth status
  if (isAuthenticated === null) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#3B563D] animate-spin" />
          <p className="text-sm font-mono text-[#6E685F]">Checking administrative credentials...</p>
        </div>
      </main>
    );
  }

  // 1. UN-AUTHENTICATED LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <Container className="max-w-md">
          <div className="bg-white rounded-3xl border border-[#E7E2DA] p-8 shadow-xl shadow-stone-200/50">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-[#3B563D]/10 border border-[#3B563D]/20 flex items-center justify-center text-[#3B563D] mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-serif font-bold text-[#1C1917] tracking-tight">
                FLASH.Ai CRM Portal
              </h1>
              <p className="text-sm text-[#6E685F] mt-1.5">
                Sign in with administrative credentials to access lead pipeline and client data.
              </p>
            </div>

            {loginError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#6E685F] mb-1.5">
                  Admin Username
                </label>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-4 py-3 rounded-xl border border-[#E7E2DA] bg-[#FDFBF7] text-[#1C1917] placeholder-[#6E685F]/50 focus:outline-none focus:ring-2 focus:ring-[#3B563D] focus:border-transparent transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#6E685F] mb-1.5">
                  Admin Password
                </label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-[#E7E2DA] bg-[#FDFBF7] text-[#1C1917] placeholder-[#6E685F]/50 focus:outline-none focus:ring-2 focus:ring-[#3B563D] focus:border-transparent transition-all text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 py-3.5 px-6 rounded-xl bg-[#3B563D] text-[#FDFBF7] font-medium text-sm hover:bg-[#324933] transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Access Lead Pipeline</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-[#E7E2DA] text-center">
              <Link
                href="/"
                className="text-xs font-mono text-[#6E685F] hover:text-[#3B563D] transition-colors"
              >
                &larr; Return to FLASH.Ai Agency Home
              </Link>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  // 2. AUTHENTICATED DASHBOARD
  return (
    <main className="min-h-screen bg-[#FDFBF7] pb-24 text-[#1C1917]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#E7E2DA]">
        <Container className="py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="font-serif font-black text-xl text-[#1C1917] tracking-tight">
                FLASH<span className="text-[#3B563D]">.Ai</span>
              </Link>
              <div className="h-4 w-px bg-[#E7E2DA]" />
              <span className="text-xs font-mono uppercase tracking-wider text-[#6E685F] font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#3B563D]" />
                Lead Pipeline CRM
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E7E2DA] text-xs font-medium text-[#1C1917] hover:bg-[#E7E2DA]/40 transition-colors"
              >
                Full Admin CMS
              </Link>

              <button
                onClick={() => setShowChangePasswordModal(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                  adminUser?.mustChangePassword
                    ? "bg-amber-100 border-amber-300 text-amber-900 animate-pulse"
                    : "border-[#E7E2DA] text-[#1C1917] hover:bg-[#E7E2DA]/40"
                }`}
                title="Change admin password"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden md:inline">
                  {adminUser?.mustChangePassword ? "Change Initial Password" : "Password"}
                </span>
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
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
                <span className="font-semibold">Security Alert:</span>
                <span>
                  You are signed in with the initial setup password. Please update your administrative password now.
                </span>
              </div>
              <button
                onClick={() => setShowChangePasswordModal(true)}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-md font-medium shrink-0 transition-colors"
              >
                Update Password Now
              </button>
            </div>
          </Container>
        </div>
      )}

      {/* Dashboard Body */}
      <Container className="pt-8">
        {/* Header Stats & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#1C1917] tracking-tight">
              Customer Leads & Inquiries
            </h1>
            <p className="text-sm text-[#6E685F] mt-1">
              Active intake pipeline from bookings, contact forms, and client inquiries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Storage Info Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E7E2DA] bg-white text-xs font-mono text-[#6E685F]">
              <div
                className={`w-2 h-2 rounded-full ${
                  dbInfo?.configured ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              <span>Storage: {dbInfo?.type || "Local Persistent"}</span>
            </div>

            <button
              onClick={handleExportCSV}
              disabled={leads.length === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E7E2DA] bg-white text-xs font-medium text-[#1C1917] hover:bg-[#E7E2DA]/30 transition-colors disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={fetchLeads}
              disabled={loadingLeads}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3B563D] text-[#FDFBF7] text-xs font-medium hover:bg-[#324933] transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingLeads ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Agency Quick Reach WhatsApp numbers */}
        <div className="mb-6 p-4 rounded-2xl bg-white border border-[#E7E2DA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#3B563D]/10 flex items-center justify-center text-[#3B563D]">
              <Phone className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-[#6E685F]">
                FLASH.Ai Support & Follow-Up Lines
              </div>
              <div className="text-sm font-medium text-[#1C1917]">
                Official agency dispatch numbers for customer follow-up
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/919398421460"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <span>+91 93984 21460</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://wa.me/918523846914"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-mono text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              <span>+91 85238 46914</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="bg-white rounded-2xl border border-[#E7E2DA] p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2 relative">
              <Search className="w-4 h-4 text-[#6E685F] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search leads by name, email, phone, company, or brief..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E7E2DA] bg-[#FDFBF7] text-[#1C1917] placeholder-[#6E685F]/60 text-sm focus:outline-none focus:ring-2 focus:ring-[#3B563D] focus:border-transparent transition-all"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7E2DA] bg-[#FDFBF7] text-[#1C1917] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B563D] transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="In Progress">In Progress</option>
                <option value="Converted">Converted</option>
                <option value="Archived">Archived</option>
              </select>
            </div>

            {/* Service Filter */}
            <div>
              <select
                value={serviceFilter}
                onChange={(e) => {
                  setServiceFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E7E2DA] bg-[#FDFBF7] text-[#1C1917] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B563D] transition-all"
              >
                <option value="all">All Services</option>
                <option value="appointment">Appointment Systems</option>
                <option value="n8n">n8n Workflows</option>
                <option value="voice">AI Voice Agents</option>
                <option value="rag">Enterprise RAG</option>
                <option value="instagram">Instagram Automation</option>
                <option value="website">Custom Website</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lead Table / Content */}
        <div className="bg-white rounded-3xl border border-[#E7E2DA] shadow-sm overflow-hidden">
          {leadError && (
            <div className="p-4 bg-red-50 border-b border-red-200 text-red-800 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{leadError}</span>
            </div>
          )}

          {loadingLeads ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-[#3B563D] animate-spin" />
              <p className="text-sm font-mono text-[#6E685F]">Loading saved leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="py-20 text-center px-6">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-[#6E685F] mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-[#1C1917]">No Leads Found</h3>
              <p className="text-sm text-[#6E685F] mt-1 max-w-sm mx-auto">
                {searchQuery || statusFilter !== "all"
                  ? "No submissions match your active filter criteria. Try resetting filters."
                  : "No lead submissions recorded yet. Submissions to booking and contact forms will appear here."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FDFBF7] border-b border-[#E7E2DA] text-xs font-mono uppercase tracking-wider text-[#6E685F]">
                  <tr>
                    <th className="py-4 px-6 font-semibold">Customer</th>
                    <th className="py-4 px-6 font-semibold">Service</th>
                    <th className="py-4 px-6 font-semibold">Contact / Phone</th>
                    <th className="py-4 px-6 font-semibold">Submission Date</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E2DA]">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-[#FDFBF7]/60 transition-colors group"
                    >
                      {/* Customer Column */}
                      <td className="py-4 px-6">
                        <div className="font-medium text-[#1C1917]">{lead.name}</div>
                        {lead.company && (
                          <div className="text-xs text-[#6E685F] flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3" />
                            <span>{lead.company}</span>
                          </div>
                        )}
                        <div className="text-xs text-[#6E685F] mt-0.5 truncate max-w-xs">
                          {lead.email}
                        </div>
                      </td>

                      {/* Service Column */}
                      <td className="py-4 px-6">
                        <div className="font-mono text-xs text-[#1C1917] bg-[#FDFBF7] px-2.5 py-1 rounded-md border border-[#E7E2DA] inline-block max-w-[200px] truncate">
                          {lead.service || "General Inquiry"}
                        </div>
                        {lead.budget && (
                          <div className="text-xs text-[#6E685F] mt-1 flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-[#3B563D]" />
                            <span>{lead.budget}</span>
                          </div>
                        )}
                      </td>

                      {/* Phone & Follow-up Column */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1.5">
                          {lead.phone ? (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-[#1C1917]">{lead.phone}</span>
                              <a
                                href={getWhatsAppUrl(lead)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100 transition-colors"
                                title="Open WhatsApp chat with pre-filled follow-up"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          ) : (
                            <span className="text-xs text-[#6E685F] italic">No phone provided</span>
                          )}

                          <a
                            href={`mailto:${lead.email}?subject=FLASH.Ai%20Agency%20Follow-Up`}
                            className="text-xs text-[#6E685F] hover:text-[#3B563D] transition-colors flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Email Lead</span>
                          </a>
                        </div>
                      </td>

                      {/* Date Column */}
                      <td className="py-4 px-6 font-mono text-xs text-[#6E685F] whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {new Date(lead.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#6E685F]/75 mt-0.5">
                          {new Date(lead.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <select
                            value={lead.status}
                            disabled={updatingStatusId === lead.id}
                            onChange={(e) =>
                              handleUpdateStatus(lead.id, e.target.value as LeadStatus)
                            }
                            className="text-xs font-medium rounded-lg border border-[#E7E2DA] bg-white px-2.5 py-1 text-[#1C1917] focus:outline-none focus:ring-1 focus:ring-[#3B563D]"
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Converted">Converted</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </div>
                      </td>

                      {/* Action Column */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedLead(lead)}
                            className="p-1.5 rounded-lg border border-[#E7E2DA] text-[#6E685F] hover:text-[#1C1917] hover:bg-[#E7E2DA]/40 transition-colors"
                            title="View full lead brief"
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

          {/* Pagination Footer */}
          <div className="border-t border-[#E7E2DA] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6E685F]">
            <div>
              Showing <span className="font-semibold text-[#1C1917]">{leads.length}</span> of{" "}
              <span className="font-semibold text-[#1C1917]">{totalLeads}</span> total leads
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loadingLeads}
                className="p-2 rounded-lg border border-[#E7E2DA] bg-white hover:bg-[#FDFBF7] transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-mono px-2">
                Page {page} of {totalPages}
              </span>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loadingLeads}
                className="p-2 rounded-lg border border-[#E7E2DA] bg-white hover:bg-[#FDFBF7] transition-colors disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Container>

      {/* DETAIL MODAL */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[#E7E2DA] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#6E685F]">
                    {selectedLead.type.toUpperCase()} INTAKE
                  </span>
                  {renderStatusBadge(selectedLead.status)}
                </div>
                <h2 className="text-2xl font-serif font-bold text-[#1C1917]">
                  {selectedLead.name}
                </h2>
                {selectedLead.company && (
                  <p className="text-sm text-[#6E685F]">{selectedLead.company}</p>
                )}
              </div>

              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl border border-[#E7E2DA] text-[#6E685F] hover:text-[#1C1917] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-sm">
              {/* Contact info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FDFBF7] border border-[#E7E2DA]">
                <div>
                  <div className="text-xs font-mono text-[#6E685F] mb-1">EMAIL</div>
                  <a
                    href={`mailto:${selectedLead.email}`}
                    className="font-medium text-[#1C1917] hover:underline"
                  >
                    {selectedLead.email}
                  </a>
                </div>
                <div>
                  <div className="text-xs font-mono text-[#6E685F] mb-1">PHONE</div>
                  <div className="font-medium text-[#1C1917]">
                    {selectedLead.phone || "Not specified"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-[#6E685F] mb-1">REQUESTED SERVICE</div>
                  <div className="font-medium text-[#1C1917]">
                    {selectedLead.service || "General Inquiry"}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-mono text-[#6E685F] mb-1">BUDGET RANGE</div>
                  <div className="font-medium text-[#1C1917]">
                    {selectedLead.budget || "Standard Consultation"}
                  </div>
                </div>
              </div>

              {/* Message / Brief */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#6E685F] mb-2">
                  Client Project Brief / Inquiry
                </h4>
                <div className="p-4 rounded-2xl bg-[#FDFBF7] border border-[#E7E2DA] text-[#1C1917] whitespace-pre-wrap leading-relaxed text-sm">
                  {selectedLead.message || "No message body provided."}
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#6E685F] mb-2">
                  Agency Internal Notes
                </h4>
                <div className="flex gap-2">
                  <textarea
                    rows={3}
                    defaultValue={selectedLead.notes || ""}
                    placeholder="Add team notes on client qualification, discovery calls, or deal stages..."
                    id="internalNotesInput"
                    className="w-full p-3 rounded-xl border border-[#E7E2DA] bg-[#FDFBF7] text-[#1C1917] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B563D]"
                  />
                </div>
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => {
                      const input = document.getElementById("internalNotesInput") as HTMLTextAreaElement;
                      if (input) handleSaveNotes(selectedLead.id, input.value);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#3B563D] text-[#FDFBF7] text-xs font-medium hover:bg-[#324933] transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
              </div>

              {/* Follow-up CTA Button */}
              <div className="pt-4 border-t border-[#E7E2DA] flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs font-mono text-[#6E685F]">
                  Created: {new Date(selectedLead.createdAt).toLocaleString()}
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={getWhatsAppUrl(selectedLead)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center gap-2 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Follow Up on WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {showChangePasswordModal && (
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
                  onClick={() => setShowChangePasswordModal(false)}
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

            {changePasswordError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs">
                {changePasswordError}
              </div>
            )}

            {changePasswordSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{changePasswordSuccess}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#6E685F] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] bg-[#FDFBF7] text-[#1C1917] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B563D]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#6E685F] mb-1">
                  New Password (min. 8 characters)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] bg-[#FDFBF7] text-[#1C1917] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B563D]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#6E685F] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] bg-[#FDFBF7] text-[#1C1917] text-sm focus:outline-none focus:ring-2 focus:ring-[#3B563D]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                {!adminUser?.mustChangePassword && (
                  <button
                    type="button"
                    onClick={() => setShowChangePasswordModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-[#E7E2DA] text-xs font-medium text-[#6E685F] hover:bg-[#FDFBF7]"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={changePasswordLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#3B563D] hover:bg-[#324933] text-[#FDFBF7] text-xs font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {changePasswordLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
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
