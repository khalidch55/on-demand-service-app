"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit2, Search, Trash2 } from "lucide-react";
import { ServicesApis } from "@/lib/api/services.api";

interface Category {
  id: number;
  name: string;
}

interface Service {
  id: number;
  name: string;
  price: number;
  isActive: boolean;
  category?: Category;
}

export default function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState("");

  const loadData = () => {
    ServicesApis.getServiceCategories(true).then((res) => {
      if (res?.success && Array.isArray(res.data)) setCategories(res.data);
    });
    ServicesApis.getServices({}, true).then((res) => {
      if (res?.success && Array.isArray(res.data)) setServices(res.data);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    const res = await ServicesApis.createCategory({ name: newCategory.trim() });
    if (res?.success) {
      setNewCategory("");
      loadData();
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Delete this category?")) return;
    const res = await ServicesApis.deleteCategory(id);
    if (res?.success !== false) loadData();
  };

  const handleRenameCategory = async (cat: Category) => {
    const newName = prompt("Rename category", cat.name);
    if (!newName?.trim() || newName.trim() === cat.name) return;
    const res = await ServicesApis.updateCategory(cat.id, { name: newName.trim() });
    if (res?.success) loadData();
  };

  const filteredServices = categoryFilter
    ? services.filter((s) => s.category?.id === categoryFilter)
    : services;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Services</h2>
          <p className="text-text-muted mt-1">Manage service categories and offerings.</p>
        </div>
        <Link href="/services/new">
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors">
            <Plus className="h-4 w-4" />
            Add Service
          </button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Categories</h3>
            <div className="flex gap-2 mb-4">
              <input
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New category"
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm"
              />
              <button onClick={handleAddCategory} className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
                Add
              </button>
            </div>
            <div className="space-y-1">
              <button
                onClick={() => setCategoryFilter(null)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                  categoryFilter === null ? "bg-primary/10 text-primary font-medium" : "text-text-muted hover:bg-surface-hover"
                }`}
              >
                <span>All Services</span>
                <span>{services.length}</span>
              </button>
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-1">
                  <button
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`flex-1 flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      categoryFilter === cat.id ? "bg-primary/10 text-primary font-medium" : "text-text-muted hover:bg-surface-hover"
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                  <button onClick={() => handleRenameCategory(cat)} className="p-2 text-text-muted hover:bg-surface-hover rounded-lg" title="Rename">
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-danger hover:bg-danger/10 rounded-lg">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 rounded-xl border border-border bg-surface shadow-sm overflow-hidden flex flex-col">
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 p-4 flex-1 bg-background/50">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="rounded-lg border border-border bg-surface p-4 hover:border-primary/50 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-background text-text-muted border border-border">
                      {service.category?.name ?? "Uncategorized"}
                    </span>
                    <Link href={`/services/${service.id}`}>
                      <button className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded transition-colors">
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                    </Link>
                  </div>
                  <Link href={`/services/${service.id}`}>
                    <h4 className="font-semibold text-foreground mb-1 hover:text-primary transition-colors cursor-pointer">
                      {service.name}
                    </h4>
                  </Link>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-bold text-primary">${Number(service.price).toFixed(2)}</span>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${
                    service.isActive ? "text-success" : "text-text-muted"
                  }`}>
                    {service.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
