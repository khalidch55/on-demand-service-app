"use client";

import { useEffect, useState } from "react";
import { Users, CalendarCheck } from "lucide-react";
import { DashboardApis } from "@/lib/api/dashboard.api";
import { BookingsApis } from "@/lib/api/bookings.api";

interface DashboardStats {
  totalUsers: number;
  totalCustomers: number;
  totalProviders: number;
  totalBookings: number;
  pendingBookings: number;
  completedBookings: number;
  totalServices: number;
}

interface Booking {
  id: number;
  status: string;
  customer?: { name: string };
  service?: { name: string };
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  useEffect(() => {
    DashboardApis.getDashboard(true).then((res) => {
      if (res?.success) setStats(res.data);
    });
    BookingsApis.getBookings({}, true).then((res) => {
      if (res?.success && Array.isArray(res.data)) {
        setRecentBookings(res.data.slice(0, 5));
      }
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-text-muted mt-1">Overview of your On-Demand Service App.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-muted">Total Users</h3>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{stats?.totalUsers ?? "—"}</div>
          <p className="text-xs text-text-muted mt-1">{stats?.totalCustomers ?? 0} customers</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-muted">Service Providers</h3>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{stats?.totalProviders ?? "—"}</div>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-muted">Total Bookings</h3>
            <CalendarCheck className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{stats?.totalBookings ?? "—"}</div>
          <p className="text-xs text-warning mt-1">{stats?.pendingBookings ?? 0} pending</p>
        </div>

        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-text-muted">Services</h3>
            <CalendarCheck className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{stats?.totalServices ?? "—"}</div>
          <p className="text-xs text-success mt-1">{stats?.completedBookings ?? 0} completed bookings</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface shadow-sm flex flex-col p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-foreground">Recent Bookings</h3>
        </div>
        <div className="space-y-4">
          {recentBookings.length === 0 ? (
            <p className="text-sm text-text-muted">No bookings yet.</p>
          ) : (
            recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                    {booking.customer?.name?.charAt(0) ?? "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium leading-none text-foreground">
                      {booking.customer?.name ?? "Customer"}
                    </p>
                    <p className="text-xs text-text-muted">{booking.service?.name ?? "Service"}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-foreground capitalize">{booking.status.replace("_", " ")}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
