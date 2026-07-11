"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Clock, DollarSign, Tag, Save } from "lucide-react";
import { ServicesApis } from "@/lib/api/services.api";

interface Category {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
  categoryId?: number;
  category?: { id: number; name: string };
}

export default function ServiceDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [service, setService] = useState<Service | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadService = async () => {
    const res = await ServicesApis.getServiceById(id);
    if (res?.success) {
      const s = res.data;
      setService(s);
      setName(s.name);
      setDescription(s.description ?? "");
      setCategoryId(String(s.category?.id ?? s.categoryId ?? ""));
      setPrice(String(s.price));
      setDurationMinutes(String(s.durationMinutes));
      setIsActive(s.isActive);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadService();
    ServicesApis.getServiceCategories(true).then((res) => {
      if (res?.success && Array.isArray(res.data)) setCategories(res.data);
    });
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this service?")) return;
    const res = await ServicesApis.deleteService(id);
    if (res?.success !== false) router.push("/services");
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await ServicesApis.updateService(id, {
      name,
      description,
      categoryId: Number(categoryId),
      price: Number(price),
      durationMinutes: Number(durationMinutes),
      isActive,
    });
    setSaving(false);
    if (res?.success) {
      setEditing(false);
      loadService();
    }
  };

  if (loading) return <p className="text-text-muted">Loading service...</p>;
  if (!service) return <p className="text-text-muted">Service not found.</p>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/services">
            <button className="p-2 rounded-lg border border-border bg-surface text-text-muted hover:text-foreground hover:bg-surface-hover transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Service Details</h2>
            <p className="text-text-muted mt-1">ID: {service.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setEditing(!editing)} className="rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium hover:bg-surface-hover">
            {editing ? "Cancel" : "Edit Service"}
          </button>
          <button onClick={handleDelete} className="flex items-center gap-2 rounded-lg bg-danger/10 text-danger px-4 py-2 text-sm font-medium hover:bg-danger/20 transition-colors">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="rounded-xl border border-border bg-surface shadow-sm p-6 space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Service name" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full px-4 py-2 rounded-lg border border-border bg-background text-sm resize-none" placeholder="Description" />
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-border bg-background text-sm">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Price" />
            <input type="number" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} required className="w-full px-4 py-2 rounded-lg border border-border bg-background text-sm" placeholder="Duration (min)" />
          </div>
          <select value={isActive ? "active" : "inactive"} onChange={(e) => setIsActive(e.target.value === "active")} className="w-full px-4 py-2 rounded-lg border border-border bg-background text-sm">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-6 py-2 text-sm font-medium disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      ) : (
        <div className="rounded-xl border border-border bg-surface shadow-sm p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground">{service.name}</h3>
              <div className="flex items-center gap-3 mt-2 text-sm text-text-muted">
                <span className="flex items-center gap-1.5"><Tag className="h-4 w-4" /> {service.category?.name ?? "Uncategorized"}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {service.durationMinutes} min</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary flex items-center gap-1 justify-end">
                <DollarSign className="h-5 w-5" />{Number(service.price).toFixed(2)}
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${service.isActive ? "bg-success/10 text-success" : "bg-text-muted/10 text-text-muted"}`}>
                {service.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <div className="border-t border-border pt-4 mt-4">
            <h4 className="font-semibold text-foreground mb-2">Description</h4>
            <p className="text-text-muted leading-relaxed">{service.description || "No description provided."}</p>
          </div>
        </div>
      )}
    </div>
  );
}
