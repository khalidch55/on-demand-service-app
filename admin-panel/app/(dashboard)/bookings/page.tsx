"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { BookingsApis } from "@/lib/api/bookings.api";

interface Booking {
  id: number;
  status: string;
  dateTime: string;
  customer?: { name: string };
  provider?: { name: string };
  service?: { name: string };
}

const statusStyles: Record<string, string> = {
  completed: "bg-success/10 text-success",
  accepted: "bg-primary/10 text-primary",
  pending: "bg-warning/10 text-warning",
  cancelled: "bg-danger/10 text-danger",
  rejected: "bg-danger/10 text-danger",
  in_progress: "bg-primary/10 text-primary",
  awaiting_payment: "bg-purple-500/10 text-purple-600",
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    BookingsApis.getBookings({}, true).then((res) => {
      if (res?.success && Array.isArray(res.data)) {
        setBookings(res.data);
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Bookings</h2>
        <p className="text-text-muted mt-1">Manage all service booking requests.</p>
      </div>

      <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-border">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search by ID, customer or provider..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
            />
          </div>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-background text-text-muted sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 font-medium">Booking ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Service</th>
                <th className="px-6 py-4 font-medium">Provider</th>
                <th className="px-6 py-4 font-medium">Date & Time</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-surface-hover transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/bookings/${booking.id}`}>
                      <span className="font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer">
                        #{booking.id}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">{booking.customer?.name ?? "—"}</td>
                  <td className="px-6 py-4 text-text-muted">{booking.service?.name ?? "—"}</td>
                  <td className="px-6 py-4">
                    <span className={booking.provider ? "text-foreground font-medium" : "text-text-muted italic"}>
                      {booking.provider?.name ?? "Not Assigned"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {new Date(booking.dateTime).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium capitalize ${
                      statusStyles[booking.status] ?? "bg-border text-text-muted"
                    }`}>
                      {booking.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/bookings/${booking.id}`}>
                      <button className="text-primary hover:text-primary-hover font-medium text-sm transition-colors">
                        View Details
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
