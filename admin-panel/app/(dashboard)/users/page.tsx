"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MoreVertical, Search } from "lucide-react";
import { UsersApis } from "@/lib/api/users.api";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roleFilter, setRoleFilter] = useState<string>("all");

  useEffect(() => {
    const params = roleFilter === "all" ? {} : { role: roleFilter };
    UsersApis.getUsers(params, true).then((res) => {
      if (res?.success && Array.isArray(res.data)) {
        setUsers(res.data);
      }
    });
  }, [roleFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Manage Users</h2>
          <p className="text-text-muted mt-1">View and manage customers and service providers.</p>
        </div>
        <Link href="/users/new">
          <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors">
            Add User
          </button>
        </Link>
      </div>

      <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm transition-all"
            />
          </div>
          <div className="flex gap-2">
            {["all", "customer", "provider"].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1 text-sm font-medium rounded-md capitalize ${
                  roleFilter === role
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:bg-surface-hover"
                }`}
              >
                {role === "all" ? "All" : `${role}s`}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-background text-text-muted">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface-hover transition-colors group">
                  <td className="px-6 py-4">
                    <Link href={`/users/${user.id}`} className="flex items-center gap-3 cursor-pointer">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">{user.name}</div>
                        <div className="text-xs text-text-muted">{user.email}</div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium capitalize ${
                      user.role === "provider" ? "bg-primary/10 text-primary" : "bg-border text-foreground"
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${
                      user.isActive ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${user.isActive ? "bg-success" : "bg-danger"}`} />
                      {user.isActive ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-text-muted">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/users/${user.id}`}>
                      <button className="p-2 text-text-muted hover:text-foreground hover:bg-background rounded-lg transition-colors">
                        <MoreVertical className="h-4 w-4" />
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
