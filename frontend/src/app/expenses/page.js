"use client";
import { DollarSign } from "lucide-react";
export default function ExpensesPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-8">
        <DollarSign className="text-brand-crimson" size={24} />
        <h1 className="text-2xl font-black text-main">Expenses</h1>
      </div>
      <div className="bg-brand-surface border border-border p-8 rounded-xl">
        <p className="text-muted">Track and manage all business expenses.</p>
      </div>
    </div>
  );
}