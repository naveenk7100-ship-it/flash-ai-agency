"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  Lock,
  Calendar,
  Mail,
  RefreshCw,
  CheckCircle,
  Clock,
  Archive,
  Database,
  Smartphone,
  Send,
  Zap
} from "lucide-react";
import { BookingSubmission, ContactSubmission } from "@/lib/types";

export default function AdminDashboardPage() {
  const [adminKey, setAdminKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<BookingSubmission[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [activeTab, setActiveTab] = useState<"bookings" | "contacts" | "system">("bookings");

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
    const saved = typeof window !== "undefined" ? sessionStorage.getItem("flash_admin_key") : null;
    if (saved) {
      setAdminKey(saved);
      // Auto fetch
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
          }
        })
        .catch(() => {});
    }
  }, []);

  const updateBookingStatus = async (id: string, newStatus: BookingSubmission["status"]) => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateBooking", id, status: newStatus, adminKey })
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateContactStatus = async (id: string, newStatus: ContactSubmission["status"]) => {
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateContact", id, status: newStatus, adminKey })
      });
      if (res.ok) {
        setContacts((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 relative">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl glow-border space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#863bff]/20 text-[#a855f7] flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">FLASH.Ai Portal</h1>
            <p className="text-xs text-zinc-400">
              Enter master administrative key to access client bookings, lead pipelines, and system storage.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                Administrative Secret Key
              </label>
              <input
                type="password"
                required
                placeholder="Enter secret key..."
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-[#863bff]"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Default development secret: <code className="text-[#a855f7]">flash-admin-2026</code> (configured via <code>ADMIN_SECRET_KEY</code>)
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#863bff] to-[#a855f7] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(134,59,255,0.4)] disabled:opacity-50"
            >
              {loading ? "Verifying Credentials..." : "Authenticate Session"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#a855f7]" />
            <h1 className="text-2xl font-black text-white">Agency Operations Dashboard</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time management for client inquiries, booking calendars, and API integrations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleLogin()}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 text-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              sessionStorage.removeItem("flash_admin_key");
            }}
            className="px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <span className="text-[11px] font-semibold uppercase text-zinc-400 block">Total Bookings</span>
          <span className="text-3xl font-black text-white mt-1 block">{stats?.totalBookings ?? 0}</span>
          <span className="text-[10px] text-emerald-400 mt-1 block">
            {stats?.newBookings ?? 0} requiring action
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <span className="text-[11px] font-semibold uppercase text-zinc-400 block">Contact Inquiries</span>
          <span className="text-3xl font-black text-white mt-1 block">{stats?.totalContacts ?? 0}</span>
          <span className="text-[10px] text-[#c084fc] mt-1 block">
            {stats?.unreadContacts ?? 0} unread
          </span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <span className="text-[11px] font-semibold uppercase text-zinc-400 block">Storage Engine</span>
          <span className="text-sm font-bold text-white mt-2 block truncate">
            {stats?.storageType ?? "Serverless"}
          </span>
          <span className="text-[10px] text-zinc-400 mt-1 block">Zero local disk loss</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10">
          <span className="text-[11px] font-semibold uppercase text-zinc-400 block">Notification APIs</span>
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                stats?.whatsappConfigured
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-amber-500/20 text-amber-300"
              }`}
            >
              WA: {stats?.whatsappConfigured ? "Live" : "Standby"}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                stats?.emailConfigured
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "bg-amber-500/20 text-amber-300"
              }`}
            >
              Email: {stats?.emailConfigured ? "Live" : "Standby"}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("bookings")}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === "bookings"
              ? "bg-[#863bff] text-white"
              : "bg-white/5 text-zinc-400 hover:text-white"
          }`}
        >
          Discovery Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setActiveTab("contacts")}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === "contacts"
              ? "bg-[#863bff] text-white"
              : "bg-white/5 text-zinc-400 hover:text-white"
          }`}
        >
          Contact Messages ({contacts.length})
        </button>
        <button
          onClick={() => setActiveTab("system")}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
            activeTab === "system"
              ? "bg-[#863bff] text-white"
              : "bg-white/5 text-zinc-400 hover:text-white"
          }`}
        >
          Infrastructure & Health
        </button>
      </div>

      {/* TAB CONTENT: Bookings */}
      {activeTab === "bookings" && (
        <div className="space-y-4">
          {bookings.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-2xl text-zinc-500 text-xs">
              No client bookings registered yet.
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{booking.fullName}</h3>
                      {booking.company && (
                        <span className="text-xs text-zinc-400 font-mono">({booking.company})</span>
                      )}
                    </div>
                    <span className="text-xs text-[#c084fc] font-mono">{booking.email}</span>
                    {booking.phone && (
                      <span className="text-xs text-zinc-400 ml-3">📞 {booking.phone}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        booking.status === "new"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : booking.status === "scheduled"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-zinc-700/40 text-zinc-300"
                      }`}
                    >
                      {booking.status}
                    </span>

                    <select
                      value={booking.status}
                      onChange={(e) =>
                        updateBookingStatus(booking.id, e.target.value as any)
                      }
                      className="px-2 py-1 rounded-lg bg-black/60 border border-white/10 text-xs text-zinc-200"
                    >
                      <option value="new">Mark New</option>
                      <option value="contacted">Mark Contacted</option>
                      <option value="scheduled">Mark Scheduled</option>
                      <option value="completed">Mark Completed</option>
                      <option value="archived">Mark Archived</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-400">
                  <div>
                    <strong className="text-zinc-300 block">Service:</strong>
                    {booking.serviceId}
                  </div>
                  <div>
                    <strong className="text-zinc-300 block">Requested Date / Time:</strong>
                    {booking.preferredDate} at {booking.preferredTime}
                  </div>
                  <div>
                    <strong className="text-zinc-300 block">Budget:</strong>
                    {booking.budgetRange}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-300">
                  <strong className="text-zinc-400 block mb-1">Project Brief:</strong>
                  {booking.projectBrief}
                </div>

                <div className="text-[10px] text-zinc-500 font-mono">
                  ID: {booking.id} • Received: {new Date(booking.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: Contacts */}
      {activeTab === "contacts" && (
        <div className="space-y-4">
          {contacts.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-2xl text-zinc-500 text-xs">
              No contact inquiries submitted yet.
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                  <div>
                    <h3 className="font-bold text-white text-base">{contact.name}</h3>
                    <span className="text-xs text-[#c084fc] font-mono">{contact.email}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase ${
                        contact.status === "unread"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}
                    >
                      {contact.status}
                    </span>

                    <button
                      onClick={() =>
                        updateContactStatus(
                          contact.id,
                          contact.status === "unread" ? "read" : "unread"
                        )
                      }
                      className="px-2.5 py-1 rounded bg-white/10 text-xs text-zinc-300 hover:text-white"
                    >
                      Toggle Read
                    </button>
                  </div>
                </div>

                <div className="text-xs font-semibold text-white">Subject: {contact.subject}</div>
                <div className="p-3 rounded-xl bg-black/40 text-xs text-zinc-300 border border-white/5">
                  {contact.message}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  ID: {contact.id} • Timestamp: {new Date(contact.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: System Infrastructure */}
      {activeTab === "system" && (
        <div className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
          <h2 className="text-xl font-bold text-white">System Environment & Integration Health</h2>
          <div className="space-y-4 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
              <span className="text-zinc-400 block font-bold text-sm">Serverless Storage Health</span>
              <p className="text-zinc-300">
                Current Storage Engine: <strong className="text-emerald-400">{stats?.storageType}</strong>
              </p>
              <p className="text-zinc-500">
                To connect durable Upstash Redis cloud across cold starts, supply <code>UPSTASH_REDIS_REST_URL</code> and <code>UPSTASH_REDIS_REST_TOKEN</code>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
              <span className="text-zinc-400 block font-bold text-sm">Meta WhatsApp Cloud API</span>
              <p className="text-zinc-300">
                Status:{" "}
                <span className={stats?.whatsappConfigured ? "text-emerald-400 font-bold" : "text-amber-400"}>
                  {stats?.whatsappConfigured ? "Configured & Active" : "Unconfigured / Standby"}
                </span>
              </p>
              <p className="text-zinc-500">
                Required keys: <code>WHATSAPP_PHONE_ID</code>, <code>WHATSAPP_ACCESS_TOKEN</code>, <code>WHATSAPP_RECIPIENT_PHONE</code>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-2">
              <span className="text-zinc-400 block font-bold text-sm">Resend Email Gateway</span>
              <p className="text-zinc-300">
                Status:{" "}
                <span className={stats?.emailConfigured ? "text-emerald-400 font-bold" : "text-amber-400"}>
                  {stats?.emailConfigured ? "Configured & Active" : "Unconfigured / Standby"}
                </span>
              </p>
              <p className="text-zinc-500">
                Required key: <code>RESEND_API_KEY</code>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
