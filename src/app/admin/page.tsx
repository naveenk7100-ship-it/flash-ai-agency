"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  Calendar,
  Mail,
  RefreshCw,
  CheckCircle2,
  Clock,
  Layers,
  Star,
  Download,
  Search,
  Filter,
  Trash2,
  Plus,
  AlertCircle,
  Smartphone,
  Send,
  Database,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import {
  BookingSubmission,
  BookingStatus,
  ContactSubmission,
  CustomerReview,
  Project,
  Service
} from "@/lib/types";
import { Container } from "@/components/Container";

export default function AdminDashboardPage() {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<BookingSubmission[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "bookings" | "contacts" | "projects" | "reviews" | "services" | "system"
  >("overview");

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Project editing state
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getStats", adminKey })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setStats(data.stats);
        setBookings(data.bookings);
        setContacts(data.contacts);
        setProjects(data.projects);
        setReviews(data.reviews);
        setServices(data.services);
        if (typeof window !== "undefined") {
          sessionStorage.setItem("flash_admin_key", adminKey);
        }
      } else {
        setError(data.error || "Authentication failed.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect to admin endpoint.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? sessionStorage.getItem("flash_admin_key") : null;
    if (saved) {
      setAdminKey(saved);
      fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "getStats", adminKey: saved })
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.success) {
            setIsAuthenticated(true);
            setStats(d.stats);
            setBookings(d.bookings);
            setContacts(d.contacts);
            setProjects(d.projects);
            setReviews(d.reviews);
            setServices(d.services);
          }
        })
        .catch(() => {});
    }
  }, []);

  const refreshData = () => {
    handleLogin();
  };

  // Booking updates
  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateBooking", id, status, adminKey })
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status } : b))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateBookingNotes = async (id: string, notes: string) => {
    try {
      await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateBooking", id, notes, adminKey })
      });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, notes } : b))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Contact updates
  const updateContactStatus = async (
    id: string,
    status: ContactSubmission["status"]
  ) => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateContact", id, status, adminKey })
      });
      if (res.ok) {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status } : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Review approval/rejection
  const updateReviewStatus = async (
    id: string,
    status: CustomerReview["status"]
  ) => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateReviewStatus", id, status, adminKey })
      });
      if (res.ok) {
        setReviews((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteReview", id, adminKey })
      });
      if (res.ok) {
        setReviews((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Project save / delete
  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "saveProject", project: editingProject, adminKey })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setShowProjectModal(false);
        setEditingProject(null);
        refreshData();
      } else {
        alert(data.error || "Failed to save project.");
      }
    } catch (err: any) {
      alert(err.message || "Error saving project.");
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete or archive this project?")) return;
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "deleteProject", id, adminKey })
      });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // CSV Export
  const exportBookingsCSV = () => {
    const headers = [
      "ID",
      "Full Name",
      "Email",
      "Company",
      "Service",
      "Date",
      "Time",
      "Timezone",
      "Budget",
      "Status",
      "Notes",
      "Created At"
    ];
    const rows = bookings.map((b) => [
      `"${b.id}"`,
      `"${b.fullName}"`,
      `"${b.email}"`,
      `"${b.company || ""}"`,
      `"${b.serviceId}"`,
      `"${b.preferredDate}"`,
      `"${b.preferredTime}"`,
      `"${b.timezone || ""}"`,
      `"${b.budgetRange}"`,
      `"${b.status}"`,
      `"${(b.notes || "").replace(/"/g, '""')}"`,
      `"${b.createdAt}"`
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `flash_ai_bookings_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.company && b.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.projectBrief.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  /* ========================================================= */
  /* LOGIN VIEW                                                */
  /* ========================================================= */
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#fdfbf7] px-4 py-16">
        <div className="natural-card w-full max-w-md p-8 sm:p-10 bg-[#ffffff] border-[#cbdccb]">
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#e5ede5] text-[#3b563d] flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-[#1c1917]">
              Flash.ai Staff Portal
            </h1>
            <p className="text-xs text-[#57534e] mt-1">
              Server-authorized client management and agency operations
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 text-xs mb-6 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-[#1c1917] mb-1.5">
                Administrative Secret Key
              </label>
              <input
                type="password"
                required
                placeholder="Enter ADMIN_SECRET_KEY..."
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
              />
              <p className="text-[11px] text-[#78716c] mt-1.5">
                Default local test key: <code className="font-mono text-[#3b563d]">flash-admin-2026</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-sage-primary w-full py-2.5 text-xs font-bold uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? "Verifying Credentials..." : "Authenticate Session"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  /* ========================================================= */
  /* AUTHENTICATED DASHBOARD VIEW                              */
  /* ========================================================= */
  return (
    <div className="bg-[#fdfbf7] min-h-screen py-10">
      <Container>
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 mb-8 border-b border-[#e7e2d8] gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="sage-badge text-[11px]">Authorized Staff</span>
              <span className="text-xs font-mono text-[#78716c]">
                Store: {stats?.storageType || "Serverless Memory"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1c1917] mt-1">
              Flash.ai Client Management Platform
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              className="btn-sage-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#5f8861]" /> Refresh
            </button>
            <button
              onClick={() => {
                sessionStorage.removeItem("flash_admin_key");
                setIsAuthenticated(false);
              }}
              className="text-xs font-semibold px-3 py-2 rounded-lg text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[#e7e2d8] pb-3">
          {[
            { id: "overview", label: "Overview & Analytics" },
            { id: "bookings", label: `Bookings (${bookings.length})` },
            { id: "contacts", label: `Inquiries (${contacts.length})` },
            { id: "projects", label: `Portfolio (${projects.length})` },
            { id: "reviews", label: `Reviews (${reviews.length})` },
            { id: "services", label: `Services (${services.length})` },
            { id: "system", label: "System & API Health" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`text-xs font-semibold px-4 py-2 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-[#3b563d] text-white"
                  : "text-[#57534e] hover:text-[#1c1917] hover:bg-[#f7f4ee]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & ANALYTICS                               */}
        {/* ========================================================= */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="natural-card p-6 bg-[#ffffff]">
                <div className="flex items-center justify-between text-xs text-[#78716c] mb-2">
                  <span>Total Bookings</span>
                  <Calendar className="w-4 h-4 text-[#5f8861]" />
                </div>
                <div className="text-3xl font-extrabold text-[#1c1917]">
                  {bookings.length}
                </div>
                <div className="text-xs text-[#5f8861] mt-2 font-medium">
                  {bookings.filter((b) => b.status === "New").length} Awaiting Review
                </div>
              </div>

              <div className="natural-card p-6 bg-[#ffffff]">
                <div className="flex items-center justify-between text-xs text-[#78716c] mb-2">
                  <span>Contact Leads</span>
                  <Mail className="w-4 h-4 text-[#5f8861]" />
                </div>
                <div className="text-3xl font-extrabold text-[#1c1917]">
                  {contacts.length}
                </div>
                <div className="text-xs text-[#5f8861] mt-2 font-medium">
                  {contacts.filter((c) => c.status === "unread").length} Unread Messages
                </div>
              </div>

              <div className="natural-card p-6 bg-[#ffffff]">
                <div className="flex items-center justify-between text-xs text-[#78716c] mb-2">
                  <span>Case Studies</span>
                  <Layers className="w-4 h-4 text-[#5f8861]" />
                </div>
                <div className="text-3xl font-extrabold text-[#1c1917]">
                  {projects.length}
                </div>
                <div className="text-xs text-[#78716c] mt-2 font-medium">
                  {projects.filter((p) => p.status === "published").length} Published
                </div>
              </div>

              <div className="natural-card p-6 bg-[#ffffff]">
                <div className="flex items-center justify-between text-xs text-[#78716c] mb-2">
                  <span>Reviews Queue</span>
                  <Star className="w-4 h-4 text-[#5f8861]" />
                </div>
                <div className="text-3xl font-extrabold text-[#1c1917]">
                  {reviews.length}
                </div>
                <div className="text-xs text-amber-700 mt-2 font-medium">
                  {reviews.filter((r) => r.status === "pending").length} Pending Authorization
                </div>
              </div>
            </div>

            {/* Pipeline Stage Breakdown */}
            <div className="natural-card p-6 sm:p-8 bg-[#ffffff]">
              <h2 className="text-base font-bold text-[#1c1917] mb-4">
                Booking Pipeline Distribution
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  "New",
                  "Contacted",
                  "Discovery Scheduled",
                  "Proposal Sent",
                  "Won",
                  "Lost"
                ].map((st) => {
                  const count = bookings.filter((b) => b.status === st).length;
                  return (
                    <div
                      key={st}
                      className="p-3 rounded-xl bg-[#f7f4ee] border border-[#e7e2d8] text-center"
                    >
                      <span className="text-[11px] text-[#78716c] block mb-1">{st}</span>
                      <span className="text-xl font-bold text-[#1c1917] font-mono">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: BOOKINGS MANAGEMENT                                */}
        {/* ========================================================= */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            {/* Search, Filter, Export Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-[#78716c] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by name, company, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-[#e7e2d8] text-xs bg-[#ffffff] focus:outline-none focus:border-[#5f8861]"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-[#e7e2d8] text-xs bg-[#ffffff] text-[#1c1917] focus:outline-none focus:border-[#5f8861]"
                >
                  <option value="all">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Discovery Scheduled">Discovery Scheduled</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              <button
                onClick={exportBookingsCSV}
                className="btn-sage-secondary text-xs py-2 px-4 flex items-center gap-1.5 self-end sm:self-auto"
              >
                <Download className="w-3.5 h-3.5 text-[#5f8861]" /> Export CSV
              </button>
            </div>

            {/* Bookings Table / Cards */}
            {filteredBookings.length === 0 ? (
              <div className="natural-card p-12 text-center bg-[#ffffff]">
                <Calendar className="w-8 h-8 text-[#cbdccb] mx-auto mb-3" />
                <h3 className="text-sm font-bold text-[#1c1917]">No booking requests found</h3>
                <p className="text-xs text-[#78716c] mt-1">
                  Try adjusting search queries or status filters.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((b) => (
                  <div key={b.id} className="natural-card p-6 bg-[#ffffff]">
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              b.status === "New"
                                ? "bg-amber-100 text-amber-900 border border-amber-200"
                                : b.status === "Discovery Scheduled"
                                ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                                : b.status === "Won"
                                ? "bg-green-100 text-green-900 border border-green-200"
                                : "bg-zinc-100 text-zinc-800 border border-zinc-200"
                            }`}
                          >
                            {b.status}
                          </span>
                          <span className="text-xs font-mono text-[#78716c]">
                            ID: {b.id}
                          </span>
                          <span className="text-xs text-[#78716c]">
                            • {new Date(b.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[#1c1917]">
                          {b.fullName}{" "}
                          {b.company && (
                            <span className="text-sm font-normal text-[#57534e]">
                              ({b.company})
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-[#57534e]">
                          Email: <a href={`mailto:${b.email}`} className="text-[#3b563d] underline">{b.email}</a>
                          {b.phone && ` • Phone: ${b.phone}`}
                          {b.website && (
                            <>
                              {" • "}
                              <a
                                href={b.website}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#3b563d] underline"
                              >
                                Website
                              </a>
                            </>
                          )}
                        </p>
                      </div>

                      {/* Status Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#78716c]">Update Status:</span>
                        <select
                          value={b.status}
                          onChange={(e) =>
                            updateBookingStatus(b.id, e.target.value as BookingStatus)
                          }
                          className="px-3 py-1.5 rounded-lg border border-[#e7e2d8] text-xs bg-[#fdfbf7] text-[#1c1917] focus:outline-none focus:border-[#5f8861]"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Discovery Scheduled">Discovery Scheduled</option>
                          <option value="Proposal Sent">Proposal Sent</option>
                          <option value="Won">Won</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-[#f7f4ee] border border-[#e7e2d8] mb-4 text-xs">
                      <div>
                        <span className="text-[11px] text-[#78716c] block">Requested Service:</span>
                        <span className="font-semibold text-[#1c1917]">{b.serviceId}</span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#78716c] block">Requested Time:</span>
                        <span className="font-semibold text-[#1c1917]">
                          {b.preferredDate} ({b.preferredTime}, {b.timezone || "UTC"})
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-[#78716c] block">Budget Range:</span>
                        <span className="font-semibold text-[#1c1917]">{b.budgetRange}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <strong className="text-xs uppercase font-bold tracking-wider text-[#78716c] block mb-1">
                        Project Brief:
                      </strong>
                      <p className="text-xs text-[#1c1917] bg-[#ffffff] p-3 rounded-lg border border-[#e7e2d8] leading-relaxed">
                        {b.projectBrief}
                      </p>
                    </div>

                    {/* Internal Notes */}
                    <div>
                      <label className="block text-xs font-semibold text-[#57534e] mb-1">
                        Internal Staff Notes:
                      </label>
                      <input
                        type="text"
                        defaultValue={b.notes || ""}
                        placeholder="Add internal notes, proposal link, or next action step..."
                        onBlur={(e) => updateBookingNotes(b.id, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-[#e7e2d8] text-xs text-[#1c1917] bg-[#fdfbf7] focus:outline-none focus:border-[#5f8861]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: CONTACT INQUIRIES                                  */}
        {/* ========================================================= */}
        {activeTab === "contacts" && (
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <div className="natural-card p-12 text-center bg-[#ffffff]">
                <Mail className="w-8 h-8 text-[#cbdccb] mx-auto mb-3" />
                <h3 className="text-sm font-bold text-[#1c1917]">No contact inquiries logged</h3>
              </div>
            ) : (
              contacts.map((c) => (
                <div key={c.id} className="natural-card p-6 bg-[#ffffff]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            c.status === "unread"
                              ? "bg-rose-100 text-rose-800"
                              : "bg-zinc-100 text-zinc-700"
                          }`}
                        >
                          {c.status.toUpperCase()}
                        </span>
                        <span className="text-xs text-[#78716c]">
                          {new Date(c.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-[#1c1917]">{c.name}</h3>
                      <p className="text-xs text-[#57534e]">
                        <a href={`mailto:${c.email}`} className="text-[#3b563d] underline">
                          {c.email}
                        </a>
                      </p>
                    </div>

                    <div className="flex gap-2">
                      {c.status === "unread" && (
                        <button
                          onClick={() => updateContactStatus(c.id, "read")}
                          className="btn-sage-secondary text-xs py-1.5 px-3"
                        >
                          Mark as Read
                        </button>
                      )}
                      {c.status !== "replied" && (
                        <button
                          onClick={() => updateContactStatus(c.id, "replied")}
                          className="btn-sage-primary text-xs py-1.5 px-3"
                        >
                          Mark Replied
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#f7f4ee] border border-[#e7e2d8] text-xs">
                    <strong className="block text-[#1c1917] mb-1 font-semibold">
                      Subject: {c.subject}
                    </strong>
                    <p className="text-[#57534e] leading-relaxed">{c.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: PORTFOLIO MANAGEMENT                               */}
        {/* ========================================================= */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-[#1c1917]">Case Studies & Concept Projects</h2>
                <p className="text-xs text-[#78716c]">
                  Manage showcase items. Concept projects and demos must be clearly labeled.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProject({
                    id: `project-${Date.now()}`,
                    name: "",
                    tagline: "",
                    category: "AI Workflow",
                    projectType: "Client System",
                    status: "published",
                    problem: "",
                    solution: "",
                    workflow: ["Step 1", "Step 2"],
                    techStack: ["Next.js", "TypeScript"],
                    outcome: "",
                    metrics: [{ label: "Metric", value: "Value" }],
                    featured: false
                  });
                  setShowProjectModal(true);
                }}
                className="btn-sage-primary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="natural-card p-6 bg-[#ffffff] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="sage-badge text-[11px]">{proj.category}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-[#f7f4ee] border border-[#e7e2d8] text-[#57534e]">
                        {proj.projectType}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#1c1917] mb-1">{proj.name}</h3>
                    <p className="text-xs text-[#5f8861] font-medium mb-3">{proj.tagline}</p>
                    <p className="text-xs text-[#57534e] line-clamp-3 mb-4 leading-relaxed">
                      {proj.problem}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#e7e2d8] flex items-center justify-between">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                        proj.status === "published"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-zinc-100 text-zinc-700"
                      }`}
                    >
                      {proj.status.toUpperCase()}
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingProject(proj);
                          setShowProjectModal(true);
                        }}
                        className="btn-sage-secondary text-xs py-1.5 px-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProject(proj.id)}
                        className="text-xs py-1.5 px-3 rounded-lg text-rose-700 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Project Edit Modal */}
            {showProjectModal && editingProject && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
                <div className="natural-card w-full max-w-2xl p-8 bg-[#ffffff] my-8 max-h-[90vh] overflow-y-auto">
                  <h3 className="text-lg font-bold text-[#1c1917] mb-4">
                    {editingProject.id ? "Edit Case Study" : "Add Case Study"}
                  </h3>

                  <form onSubmit={saveProject} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                          Project ID (Slug) *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProject.id || ""}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, id: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-[#e7e2d8] text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                          Project Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={editingProject.name || ""}
                          onChange={(e) =>
                            setEditingProject({ ...editingProject, name: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-[#e7e2d8] text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                        Tagline *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingProject.tagline || ""}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, tagline: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[#e7e2d8] text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                          Category
                        </label>
                        <select
                          value={editingProject.category || "AI Workflow"}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              category: e.target.value as any
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-[#e7e2d8] text-xs"
                        >
                          <option value="AI Workflow">AI Workflow</option>
                          <option value="AI Agents">AI Agents</option>
                          <option value="n8n Automation">n8n Automation</option>
                          <option value="Lead & CRM">Lead & CRM</option>
                          <option value="Vision & PDE">Vision & PDE</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                          Type Classification *
                        </label>
                        <select
                          value={editingProject.projectType || "Client System"}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              projectType: e.target.value as any
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-[#e7e2d8] text-xs"
                        >
                          <option value="Client System">Client System</option>
                          <option value="Concept Architecture">Concept Architecture</option>
                          <option value="Demo Prototype">Demo Prototype</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                          Publication Status
                        </label>
                        <select
                          value={editingProject.status || "published"}
                          onChange={(e) =>
                            setEditingProject({
                              ...editingProject,
                              status: e.target.value as any
                            })
                          }
                          className="w-full px-3 py-2 rounded-lg border border-[#e7e2d8] text-xs"
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                        Problem Statement *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={editingProject.problem || ""}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, problem: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[#e7e2d8] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                        Engineered Solution *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={editingProject.solution || ""}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, solution: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[#e7e2d8] text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#1c1917] mb-1">
                        Demonstrated Outcome *
                      </label>
                      <textarea
                        rows={2}
                        required
                        value={editingProject.outcome || ""}
                        onChange={(e) =>
                          setEditingProject({ ...editingProject, outcome: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-[#e7e2d8] text-xs"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-[#e7e2d8]">
                      <button
                        type="button"
                        onClick={() => setShowProjectModal(false)}
                        className="btn-sage-secondary text-xs py-2 px-4"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-sage-primary text-xs py-2 px-5"
                      >
                        Save Project
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: CUSTOMER REVIEW APPROVAL                           */}
        {/* ========================================================= */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#1c1917]">Review Verification Queue</h2>
              <p className="text-xs text-[#78716c]">
                Review authorization controls. Only authentic approved reviews appear on the public website.
              </p>
            </div>

            {reviews.length === 0 ? (
              <div className="natural-card p-12 text-center bg-[#ffffff]">
                <Star className="w-8 h-8 text-[#cbdccb] mx-auto mb-3" />
                <h3 className="text-sm font-bold text-[#1c1917]">No reviews in queue</h3>
                <p className="text-xs text-[#78716c] mt-1">
                  Submitted client reviews will appear here for review and verification.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="natural-card p-6 bg-[#ffffff]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                              rev.status === "approved"
                                ? "bg-emerald-100 text-emerald-800"
                                : rev.status === "pending"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                            }`}
                          >
                            {rev.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-[#78716c]">
                            {new Date(rev.date).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-[#1c1917]">
                          {rev.reviewerName} • {rev.company}
                        </h3>
                        <div className="text-amber-500 text-xs">
                          {"★".repeat(rev.rating)}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {rev.status !== "approved" && (
                          <button
                            onClick={() => updateReviewStatus(rev.id, "approved")}
                            className="btn-sage-primary text-xs py-1.5 px-3"
                          >
                            Approve & Publish
                          </button>
                        )}
                        {rev.status !== "rejected" && (
                          <button
                            onClick={() => updateReviewStatus(rev.id, "rejected")}
                            className="btn-sage-secondary text-xs py-1.5 px-3 text-amber-800"
                          >
                            Reject
                          </button>
                        )}
                        <button
                          onClick={() => deleteReview(rev.id)}
                          className="text-xs py-1.5 px-3 rounded-lg text-rose-700 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#57534e] bg-[#f7f4ee] p-3 rounded-lg border border-[#e7e2d8] leading-relaxed italic">
                      &ldquo;{rev.reviewText}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 6: SERVICES MANAGEMENT                                */}
        {/* ========================================================= */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#1c1917]">Configured Agency Offerings</h2>
              <p className="text-xs text-[#78716c]">
                Live service descriptions, scope minimums, and timelines served across the platform.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((srv) => (
                <div key={srv.id} className="natural-card p-5 bg-[#ffffff]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="sage-badge text-[10px]">{srv.badge}</span>
                    <span className="text-xs font-semibold text-[#1c1917]">
                      {srv.startingInvestment}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#1c1917] mb-1">{srv.title}</h3>
                  <p className="text-xs text-[#57534e] mb-3 line-clamp-2">
                    {srv.shortDescription}
                  </p>
                  <div className="text-[11px] text-[#78716c]">
                    Typical Timeline: <strong className="text-[#1c1917]">{srv.typicalTimeline}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 7: SYSTEM & INTEGRATION STATUS                        */}
        {/* ========================================================= */}
        {activeTab === "system" && (
          <div className="space-y-6">
            <div className="natural-card p-6 sm:p-8 bg-[#ffffff]">
              <h2 className="text-base font-bold text-[#1c1917] mb-4">
                Backend Services & Environment Audit
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#f7f4ee] border border-[#e7e2d8]">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-[#5f8861]" />
                    <div>
                      <strong className="text-xs font-bold text-[#1c1917] block">
                        Storage Layer
                      </strong>
                      <span className="text-[11px] text-[#57534e]">
                        {stats?.storageType || "Persistent Serverless Store"}
                      </span>
                    </div>
                  </div>
                  <span className="sage-badge text-xs">Active</span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#f7f4ee] border border-[#e7e2d8]">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#5f8861]" />
                    <div>
                      <strong className="text-xs font-bold text-[#1c1917] block">
                        Resend Email Dispatcher
                      </strong>
                      <span className="text-[11px] text-[#57534e]">
                        {stats?.emailConfigured
                          ? "Configured (RESEND_API_KEY detected)"
                          : "Unconfigured (Set RESEND_API_KEY for live emails)"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      stats?.emailConfigured
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {stats?.emailConfigured ? "Connected" : "Unconfigured"}
                  </span>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-[#f7f4ee] border border-[#e7e2d8]">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-[#5f8861]" />
                    <div>
                      <strong className="text-xs font-bold text-[#1c1917] block">
                        Meta WhatsApp Cloud API
                      </strong>
                      <span className="text-[11px] text-[#57534e]">
                        {stats?.whatsappConfigured
                          ? "Configured (Meta Credentials detected)"
                          : "Unconfigured (Set WHATSAPP_ACCESS_TOKEN for live alerts)"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      stats?.whatsappConfigured
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {stats?.whatsappConfigured ? "Connected" : "Unconfigured"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
