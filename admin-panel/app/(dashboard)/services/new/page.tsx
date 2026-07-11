"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Briefcase, DollarSign, Clock } from "lucide-react";
import { ServicesApis } from "@/lib/api/services.api";

interface Category {
  id: number;
  name: string;
}

export default function CreateServicePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    ServicesApis.getServiceCategories(true).then((res) => {
      if (res?.success && Array.isArray(res.data)) {
        setCategories(res.data);
        if (res.data.length > 0) setCategoryId(String(res.data[0].id));
      }
    });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await ServicesApis.createService({
      name,
      description,
      categoryId: Number(categoryId),
      price: Number(price),
      durationMinutes: Number(durationMinutes),
      isActive,
    });

    if (res?.success) {
      router.push("/services");
    } else {
      setError(res?.message || "Failed to create service");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/services">
          <button className="p-2 rounded-lg border border-border bg-surface text-text-muted hover:text-foreground hover:bg-surface-hover transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Add New Service</h2>
          <p className="text-text-muted mt-1">Create a new service offering for customers.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-text-muted" /> Service Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <select
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-sm"
            >
              {categories.length === 0 ? (
                <option value="">No categories — create one first</option>
              ) : (
                categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))
              )}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-sm resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-text-muted" /> Price
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-text-muted" /> Duration (minutes)
              </label>
              <input
                type="number"
                required
                min="1"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Status</label>
            <select
              value={isActive ? "active" : "inactive"}
              onChange={(e) => setIsActive(e.target.value === "active")}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="border-t border-border pt-6 flex justify-end gap-4">
            <Link href="/services">
              <button type="button" className="px-6 py-2 rounded-lg border border-border bg-surface text-foreground font-medium hover:bg-surface-hover">
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={loading || categories.length === 0}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-hover disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {loading ? "Saving..." : "Save Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
