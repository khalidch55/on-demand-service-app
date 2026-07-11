"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
  Briefcase,
  FileText,
} from "lucide-react";
import { BookingsApis } from "@/lib/api/bookings.api";
import { UsersApis } from "@/lib/api/users.api";

interface Booking {
  id: number;
  status: string;
  dateTime: string;
  notes?: string;
  providerWorkDone?: boolean;
  customerWorkDone?: boolean;
  amount?: number | string;
  paymentStatus?: string;
  paidAt?: string;
  mockTransactionId?: string;
  customer?: { id: number; name: string; email: string; phone?: string };
  provider?: { id: number; name: string; phone?: string };
  service?: {
    name: string;
    price: number;
    durationMinutes: number;
    category?: { name: string };
  };
}

interface Provider {
  id: number;
  name: string;
}

type BookingStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "in_progress"
  | "awaiting_payment"
  | "completed"
  | "cancelled";

const statusStyles: Record<string, string> = {
  completed: "bg-success/10 text-success",
  accepted: "bg-primary/10 text-primary",
  in_progress: "bg-primary/10 text-primary",
  awaiting_payment: "bg-purple-500/10 text-purple-600",
  pending: "bg-warning/10 text-warning",
  cancelled: "bg-danger/10 text-danger",
  rejected: "bg-danger/10 text-danger",
};

export default function BookingDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [loading, setLoading] = useState(true);

  const loadBooking = async () => {
    const res = await BookingsApis.getBookingById(id);
    if (res?.success) setBooking(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadBooking();
    UsersApis.getUsers({ role: "provider" }, true).then((res) => {
      if (res?.success && Array.isArray(res.data)) setProviders(res.data);
    });
  }, [id]);

  const updateStatus = async (status: BookingStatus) => {
    const res = await BookingsApis.updateBookingStatus(id, status);
    if (res?.success) loadBooking();
  };

  const assignProvider = async () => {
    if (!selectedProvider) return;
    const res = await BookingsApis.assignProvider(id, selectedProvider);
    if (res?.success) loadBooking();
  };

  if (loading) {
    return <p className="text-text-muted">Loading booking...</p>;
  }

  if (!booking) {
    return <p className="text-text-muted">Booking not found.</p>;
  }

  const statusClass = statusStyles[booking.status] ?? "bg-border text-text-muted";
  const amount = Number(booking.amount ?? booking.service?.price ?? 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/bookings">
            <button className="p-2 rounded-lg border border-border bg-surface text-text-muted hover:text-foreground hover:bg-surface-hover transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Booking Details</h2>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-text-muted font-medium">#{booking.id}</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusClass}`}>
                {booking.status.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {booking.status === "pending" && (
            <>
              <button onClick={() => updateStatus("cancelled")} className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors">
                <XCircle className="h-4 w-4" /> Cancel
              </button>
              <button onClick={() => updateStatus("accepted")} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors">
                <CheckCircle className="h-4 w-4" /> Accept
              </button>
            </>
          )}
          {booking.status === "accepted" && (
            <button onClick={() => updateStatus("in_progress")} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors">
              Start Job
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-surface shadow-sm p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-4">Schedule & Service</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-text-muted">Date</div>
                    <div className="text-foreground font-medium">{new Date(booking.dateTime).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-text-muted">Time</div>
                    <div className="text-foreground font-medium">{new Date(booking.dateTime).toLocaleTimeString()}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium text-text-muted">Service</div>
                  <div className="text-foreground font-bold text-lg">{booking.service?.name ?? "—"}</div>
                  <div className="text-sm text-text-muted">
                    {booking.service?.category?.name ?? "—"} · {booking.service?.durationMinutes ?? 0} min
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface shadow-sm p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-4">Service Progress</h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between p-3 rounded-lg bg-background border border-border">
                <span className="text-text-muted">Provider completed service</span>
                <span className={booking.providerWorkDone ? "text-success font-semibold" : "text-text-muted"}>
                  {booking.providerWorkDone ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-background border border-border">
                <span className="text-text-muted">Customer paid</span>
                <span className={booking.paymentStatus === "paid" ? "text-success font-semibold" : "text-text-muted"}>
                  {booking.paymentStatus === "paid" ? "Yes" : "No"}
                </span>
              </div>
            </div>
            {booking.status === "awaiting_payment" && (
              <p className="text-sm text-purple-600 mt-3">Waiting for customer to pay in the mobile app.</p>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-xl border border-border bg-surface shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-4 flex items-center justify-between">
                Customer
                {booking.customer && (
                  <Link href={`/users/${booking.customer.id}`} className="text-sm text-primary font-medium">View Profile</Link>
                )}
              </h3>
              {booking.customer ? (
                <>
                  <div className="font-bold text-foreground mb-2">{booking.customer.name}</div>
                  <div className="text-sm text-text-muted">{booking.customer.email}</div>
                  {booking.customer.phone && <div className="text-sm text-text-muted mt-1">{booking.customer.phone}</div>}
                </>
              ) : (
                <p className="text-text-muted">No customer data</p>
              )}
            </div>

            <div className="rounded-xl border border-border bg-surface shadow-sm p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-4">Provider</h3>
              {booking.provider ? (
                <>
                  <div className="font-bold text-foreground mb-2">{booking.provider.name}</div>
                  {booking.provider.phone && <div className="text-sm text-text-muted">{booking.provider.phone}</div>}
                  <Link href={`/users/${booking.provider.id}`} className="text-sm text-primary font-medium mt-2 inline-block">View Profile</Link>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex flex-col items-center text-center py-2">
                    <User className="h-10 w-10 text-border mb-2" />
                    <p className="text-text-muted text-sm">No provider assigned.</p>
                  </div>
                  <select value={selectedProvider} onChange={(e) => setSelectedProvider(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm">
                    <option value="">Select provider...</option>
                    {providers.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                  <button onClick={assignProvider} disabled={!selectedProvider} className="w-full rounded-lg bg-primary/10 text-primary px-4 py-2 text-sm font-medium hover:bg-primary/20 disabled:opacity-50">
                    Assign Provider
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-border bg-surface shadow-sm p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-4">Payment</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-text-muted">Amount</span>
                <span className="font-bold text-primary text-xl">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">Status</span>
                <span className={`font-medium capitalize ${booking.paymentStatus === "paid" ? "text-success" : "text-warning"}`}>
                  {booking.paymentStatus ?? "unpaid"}
                </span>
              </div>
              {booking.paidAt && (
                <div className="flex justify-between">
                  <span className="text-text-muted">Paid at</span>
                  <span>{new Date(booking.paidAt).toLocaleString()}</span>
                </div>
              )}
              {booking.mockTransactionId && (
                <div className="pt-2 border-t border-border">
                  <span className="text-text-muted block mb-1">Transaction ID</span>
                  <span className="font-mono text-xs break-all">{booking.mockTransactionId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface shadow-sm p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-text-muted" /> Notes
            </h3>
            <p className="text-sm text-text-muted bg-background p-4 rounded-lg border border-border">
              {booking.notes || "No notes provided."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
