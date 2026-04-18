"use client";
import { Package } from "lucide-react";

export default function VariationsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Package className="text-brand-crimson" size={24} />
        <h1 className="text-2xl font-black text-main">Variations</h1>
      </div>
      <div className="bg-brand-surface border border-border p-8 rounded-xl">
        <p className="text-muted">The Variations module has been initialized and is ready for data integration.</p>
      </div>
    </div>
  );
}
