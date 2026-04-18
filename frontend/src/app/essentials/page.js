"use client";
import { Star } from "lucide-react";
export default function EssentialsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Star className="text-brand-crimson" size={24} />
        <h1 className="text-2xl font-black text-main">Essentials</h1>
      </div>
      <div className="bg-brand-surface border border-border p-8 rounded-xl">
        <p className="text-muted">Essential tools and configurations.</p>
      </div>
    </div>
  );
}