"use client";
import { Users2 } from "lucide-react";
export default function HrmPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <Users2 className="text-brand-crimson" size={24} />
        <h1 className="text-2xl font-black text-main">HRM</h1>
      </div>
      <div className="bg-brand-surface border border-border p-8 rounded-xl">
        <p className="text-muted">Human Resource Management module.</p>
      </div>
    </div>
  );
}