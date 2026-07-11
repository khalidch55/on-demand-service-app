"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Mail, Phone, Calendar, ShieldAlert } from "lucide-react";
import { UsersApis } from "@/lib/api/users.api";
import { BookingsApis } from "@/lib/api/bookings.api";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface Booking {
  id: number;
  status: string;
  dateTime: string;
  service?: { name: string };
}

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const loadUser = async () => {
    const res = await UsersApis.getUserById(id);
    if (res?.success) {
      setUser(res.data);
      setName(res.data.name);
      setPhone(res.data.phone ?? "");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUser();
    BookingsApis.getBookings({}, true).then((res) => {
      if (res?.success && Array.isArray(res.data)) {
        const userId = Number(id);
        setBookings(
          res.data.filter(
            (b: Booking & { userId?: number; providerId?: number }) =>
              b.userId === userId || (b as { providerId?: number }).providerId === userId,
          ).slice(0, 5),
        );
      }
    });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this user?")) return;
    const res = await UsersApis.deleteUser(id);
    if (res?.success !== false) router.push("/users");
  };

  const handleToggleStatus = async () => {
    if (!user) return;
    const status = user.isActive ? "blocked" : "active";
    const res = await UsersApis.toggleUserStatus(id, status);
    if (res?.success) loadUser();
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await UsersApis.updateUser(id, { name, phone });
    setSaving(false);
    if (res?.success) {
      setEditing(false);
      loadUser();
    }
  };

  if (loading) return <p className="text-text-muted">Loading user...</p>;
  if (!user) return <p className="text-text-muted">User not found.</p>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/users">
            <button className="p-2 rounded-lg border border-border bg-surface text-text-muted hover:text-foreground hover:bg-surface-hover transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">User Details</h2>
            <p className="text-text-muted mt-1">ID: {user.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditing(!editing)}
            className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-hover"
          >
            {editing ? "Cancel Edit" : "Edit User"}
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg bg-danger/10 text-danger px-4 py-2 text-sm font-medium hover:bg-danger/20 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-surface shadow-sm p-6 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary mb-4">
              {user.name.charAt(0)}
            </div>
            <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
            {editing ? (
              <div className="w-full mt-4 space-y-3 text-left">
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Name" />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Phone" />
                <button onClick={handleSave} disabled={saving} className="w-full rounded-lg bg-primary text-primary-foreground py-2 text-sm font-medium disabled:opacity-60">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            ) : null}
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                {user.role}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.isActive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
              }`}>
                {user.isActive ? "Active" : "Blocked"}
              </span>
            </div>

            <div className="w-full mt-6 space-y-4 text-left">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-text-muted shrink-0" />
                <div>
                  <div className="text-sm font-medium text-foreground">{user.email}</div>
                  <div className="text-xs text-text-muted">Email</div>
                </div>
              </div>
              {user.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-text-muted shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-foreground">{user.phone}</div>
                    <div className="text-xs text-text-muted">Phone</div>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-text-muted shrink-0" />
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-text-muted">Joined Date</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Recent Bookings</h3>
            </div>
            <div className="overflow-auto">
              {bookings.length === 0 ? (
                <p className="p-4 text-sm text-text-muted">No bookings found for this user.</p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-background text-text-muted">
                    <tr>
                      <th className="px-4 py-3 font-medium">ID</th>
                      <th className="px-4 py-3 font-medium">Service</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-surface-hover">
                        <td className="px-4 py-3">
                          <Link href={`/bookings/${booking.id}`} className="text-primary font-medium">
                            #{booking.id}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-text-muted">{booking.service?.name ?? "—"}</td>
                        <td className="px-4 py-3 text-text-muted">
                          {new Date(booking.dateTime).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 capitalize">{booking.status.replace("_", " ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-danger/20 bg-danger/5 p-4 flex items-start gap-4">
            <ShieldAlert className="h-6 w-6 text-danger shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-danger">
                {user.isActive ? "Block Account" : "Activate Account"}
              </h4>
              <p className="text-sm text-text-muted mt-1 mb-3">
                {user.isActive
                  ? "Blocking prevents this user from logging in."
                  : "Activate to restore access for this user."}
              </p>
              <button
                onClick={handleToggleStatus}
                className="rounded-lg border border-danger/30 bg-surface px-4 py-2 text-sm font-medium text-danger hover:bg-danger hover:text-white transition-colors"
              >
                {user.isActive ? "Block User" : "Activate User"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
