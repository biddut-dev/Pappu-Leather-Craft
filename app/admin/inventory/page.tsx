"use client";

import React, { useEffect, useState } from "react";
import { Plus, Minus, Warehouse, History, ArrowDownUp, Check } from "lucide-react";
import { Product, InventoryLog } from "@/types";
import { formatDateTime } from "@/lib/formatters";
import { useToast } from "@/context/ToastContext";

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [logs, setLogs] = useState<InventoryLog[]>([]);
  const [activeTab, setActiveTab] = useState<"inventory" | "logs">("inventory");
  const [loading, setLoading] = useState(true);
  const { success, error } = useToast();

  // Adjustment Modal State
  const [adjustTarget, setAdjustTarget] = useState<{
    productId: string;
    productName: string;
    variantId: string;
    size: number | string;
    currentStock: number;
  } | null>(null);
  const [changeAmount, setChangeAmount] = useState<number>(5);
  const [reason, setReason] = useState("Workshop Restock Batch");
  const [adjusting, setAdjusting] = useState(false);

  const fetchData = async () => {
    try {
      const [prodRes, logRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/inventory"),
      ]);
      const prodData = await prodRes.json();
      const logData = await logRes.json();

      if (prodData.success) setProducts(prodData.products);
      if (logData.success) setLogs(logData.logs);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdjustStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTarget) return;

    setAdjusting(true);
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: adjustTarget.productId,
          variantId: adjustTarget.variantId,
          change: changeAmount,
          reason,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        success(`Stock updated for ${adjustTarget.productName} (Size ${adjustTarget.size})`);
        setAdjustTarget(null);
        fetchData();
      } else {
        error(data.message || "Stock update failed");
      }
    } catch {
      error("Network error");
    } finally {
      setAdjusting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#202020] gap-4">
        <div>
          <h1 className="editorial-heading text-2xl font-serif text-[#F3EDE3] font-bold">
            Warehouse Inventory & Stock Audit
          </h1>
          <p className="text-xs text-zinc-400">
            Real-time stock per variant size. Every transaction is logged with administrative audit trail.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#141414] border border-[#242424] rounded-lg p-1 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-4 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === "inventory"
                ? "bg-[#8B5E3C] text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Warehouse className="w-3.5 h-3.5" />
            <span>Variant Inventory</span>
          </button>
          <button
            onClick={() => setActiveTab("logs")}
            className={`px-4 py-1.5 rounded transition-colors flex items-center gap-1.5 ${
              activeTab === "logs"
                ? "bg-[#8B5E3C] text-white"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Logs ({logs.length})</span>
          </button>
        </div>
      </div>

      {/* Main Inventory View */}
      {activeTab === "inventory" && (
        <div className="space-y-4">
          <div className="bg-[#131313] border border-[#242424] rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#181818] text-white uppercase text-[10px] tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Footwear Model</th>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Size Variant</th>
                    <th className="p-3">Color</th>
                    <th className="p-3">Current Stock</th>
                    <th className="p-3 text-right">Adjust Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#202020]">
                  {products.flatMap((prod) =>
                    prod.variants.map((v) => (
                      <tr key={v.id} className="hover:bg-[#161616] transition-colors">
                        <td className="p-3 font-semibold text-white">{prod.name}</td>
                        <td className="p-3 font-mono text-zinc-400">{v.sku}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-white font-mono font-bold">
                            EU {v.size}
                          </span>
                        </td>
                        <td className="p-3 text-zinc-300">{v.color}</td>
                        <td className="p-3">
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded ${
                              v.stock === 0
                                ? "bg-red-950 text-red-300 border border-red-800"
                                : v.stock <= 3
                                ? "bg-amber-950 text-amber-300 border border-amber-800"
                                : "bg-[#1A1A1A] text-emerald-300 border border-emerald-900/40"
                            }`}
                          >
                            {v.stock} in stock
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() =>
                              setAdjustTarget({
                                productId: prod._id,
                                productName: prod.name,
                                variantId: v.id,
                                size: v.size,
                                currentStock: v.stock,
                              })
                            }
                            className="px-3 py-1 bg-[#1C1C1C] hover:bg-[#8B5E3C] text-zinc-300 hover:text-white border border-[#2A2A2A] rounded font-semibold transition-colors"
                          >
                            Adjust Stock
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Audit Logs View */}
      {activeTab === "logs" && (
        <div className="bg-[#131313] border border-[#242424] rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#181818] text-white uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Footwear</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Previous</th>
                  <th className="p-3">Change</th>
                  <th className="p-3">New Stock</th>
                  <th className="p-3">Reason / Context</th>
                  <th className="p-3">Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202020]">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-zinc-500">
                      No stock adjustments logged yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log._id} className="hover:bg-[#161616]">
                      <td className="p-3 font-mono text-zinc-400">
                        {formatDateTime(log.timestamp)}
                      </td>
                      <td className="p-3 font-semibold text-white">{log.productName}</td>
                      <td className="p-3 font-mono text-zinc-300">Size {log.size}</td>
                      <td className="p-3 font-mono text-zinc-400">{log.previousStock}</td>
                      <td className="p-3 font-mono font-bold">
                        <span
                          className={log.change >= 0 ? "text-emerald-400" : "text-red-400"}
                        >
                          {log.change >= 0 ? `+${log.change}` : log.change}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-white">{log.newStock}</td>
                      <td className="p-3 text-zinc-300">{log.reason}</td>
                      <td className="p-3 text-zinc-400">{log.admin}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {adjustTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <form
            onSubmit={handleAdjustStock}
            className="w-full max-w-md bg-[#141414] border border-[#2E2E2E] rounded-xl p-6 space-y-4 shadow-2xl text-xs text-zinc-300"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-white pb-2 border-b border-[#242424]">
              Adjust Inventory Stock
            </h3>

            <div className="p-3 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg space-y-1">
              <p className="font-semibold text-white text-sm">{adjustTarget.productName}</p>
              <p className="text-zinc-400">
                Shoe Size: <strong className="text-white">EU {adjustTarget.size}</strong> • Current Stock:{" "}
                <strong className="text-white font-mono">{adjustTarget.currentStock} pairs</strong>
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Quantity Change (+ to add, - to deduct)</label>
              <input
                type="number"
                required
                value={changeAmount}
                onChange={(e) => setChangeAmount(Number(e.target.value))}
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white font-mono font-bold"
              />
              <p className="text-[11px] text-zinc-500">
                Resulting stock will be:{" "}
                <strong className="text-white font-mono">
                  {Math.max(0, adjustTarget.currentStock + changeAmount)} pairs
                </strong>
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-zinc-400 font-medium">Audit Reason *</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#181818] border border-[#2E2E2E] rounded px-3 py-2 text-white"
              >
                <option value="Workshop Restock Batch">Workshop Restock Batch</option>
                <option value="Physical Inventory Recount">Physical Inventory Recount</option>
                <option value="Damaged / QC Rejection">Damaged / QC Rejection</option>
                <option value="Custom Size Exchange Reserve">Custom Size Exchange Reserve</option>
              </select>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAdjustTarget(null)}
                className="flex-1 py-2.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2A2A2A] text-zinc-300 rounded font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={adjusting}
                className="flex-1 py-2.5 bg-[#8B5E3C] hover:bg-[#A47551] text-white font-bold uppercase tracking-wider rounded transition-colors"
              >
                {adjusting ? "Updating..." : "Commit Update"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
