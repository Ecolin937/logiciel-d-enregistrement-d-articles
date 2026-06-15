/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import { Transaction } from "../types";
import { History, TrendingUp, RefreshCw, BarChart3, AlertCircle, ShoppingBag, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";

interface HistoryLogProps {
  transactions: Transaction[];
  onClearHistory: () => void;
}

export default function HistoryLog({ transactions, onClearHistory }: HistoryLogProps) {
  const [selectedImages, setSelectedImages] = useState<string[] | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Compute daily / session statistics (with no VAT/tax whatsoever)
  const stats = useMemo(() => {
    const count = transactions.length;
    const totalRevenue = transactions.reduce((acc, t) => acc + t.total, 0);
    const totalTips = transactions.reduce((acc, t) => acc + (t.tip || 0), 0);
    const averageReceipt = count > 0 ? totalRevenue / count : 0;
    return {
      count,
      totalRevenue,
      totalTips,
      averageReceipt,
    };
  }, [transactions]);

  // Extract date / time helper for displaying only the time or complete string
  const formatTimeOnly = (timestampStr: string) => {
    // If our string is "12/06/2026 à 14:32:15" or similar, extract the time block
    const parts = timestampStr.split(" ");
    return parts[parts.length - 1] || timestampStr;
  };

  return (
    <div id="sales-history-panel" className="bg-white border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#141414] rounded-none text-[#141414]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b-2 border-dotted border-[#141414]">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-[#141414]" />
          <h3 className="italic font-serif font-black text-sm uppercase tracking-tight">
            Historique des articles enregistrés
          </h3>
        </div>
        {transactions.length > 0 && (
          <button
            id="btn-clear-history"
            onClick={onClearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-black text-red-950 bg-red-100 hover:bg-red-200 border-2 border-[#141414] rounded-none cursor-pointer shadow-[2px_2px_0px_#141414] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Vider l'historique</span>
          </button>
        )}
      </div>

      {transactions.length === 0 ? (
        /* Empty state */
        <div className="py-12 text-center text-neutral-500 font-mono border-2 border-dashed border-[#141414]/20 bg-[#FAF9F6]/50">
          <p className="text-xs font-black uppercase text-neutral-700">[HISTORIQUE DE VENTES ENCORE VIDE]</p>
          <p className="text-[11px] text-neutral-500 mt-2 max-w-sm mx-auto leading-relaxed">
            Dès que vous validez un article dans le formulaire de saisie manuelle ci-dessus, il apparaîtra ici instantanément avec l'heure précise.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Figures Widgets (Bento Stats) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Stat 1: Total Revenue */}
            <div className="bg-[#FAF9F6] p-4 border-2 border-[#141414] rounded-none shadow-[2px_2px_0px_#141414] flex flex-col justify-between">
              <span className="text-[10px] font-black text-[#141414]/70 uppercase tracking-wide flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                Recettes Totales Enregistrées
              </span>
              <p className="text-xl font-black font-mono text-emerald-800 mt-1">
                {stats.totalRevenue.toFixed(2)} €
              </p>
              <span className="text-[9px] font-bold text-neutral-600 mt-0.5 font-mono uppercase">
                {stats.totalTips > 0 ? `Dont ${stats.totalTips.toFixed(2)} € de pourboire client` : "Pris comptant en caisse"}
              </span>
            </div>

            {/* Stat 2: Sales Volume */}
            <div className="bg-[#FAF9F6] p-4 border-2 border-[#141414] rounded-none shadow-[2px_2px_0px_#141414] flex flex-col justify-between">
              <span className="text-[10px] font-black text-[#141414]/70 uppercase tracking-wide flex items-center gap-1">
                <ShoppingBag className="w-3.5 h-3.5 text-slate-800" />
                Nombre d'articles
              </span>
              <p className="text-xl font-black font-mono text-[#141414] mt-1">
                {stats.count} {stats.count > 1 ? "ARTICLES" : "ARTICLE"}
              </p>
              <span className="text-[9px] font-bold text-neutral-600 mt-0.5 font-mono uppercase">Enregistrés individuellement</span>
            </div>

            {/* Stat 3: Average Ticket */}
            <div className="bg-[#FAF9F6] p-4 border-2 border-[#141414] rounded-none shadow-[2px_2px_0px_#141414] flex flex-col justify-between">
              <span className="text-[10px] font-black text-[#141414]/70 uppercase tracking-wide flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-750" />
                Prix Moyen de l'Article
              </span>
              <p className="text-xl font-black font-mono text-[#141414] mt-1">
                {stats.averageReceipt.toFixed(2)} €
              </p>
              <span className="text-[9px] font-bold text-neutral-600 mt-0.5 font-mono uppercase">Moyenne par article saisi</span>
            </div>
          </div>

          {/* Simple flat registered article list design */}
          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            <h4 className="text-[11px] font-black text-[#141414] uppercase tracking-wider mb-2.5 font-mono flex items-center gap-1.5">
              <span>Flux chronologique d'articles enregistrés</span>
              <span className="text-[10px] bg-neutral-900 text-white px-2 py-0.5 rounded-none font-bold font-mono">
                LATEST FIRST
              </span>
            </h4>
            
            <div className="border-2 border-[#141414] bg-[#FAF9F6] divide-y-2 divide-[#141414]">
              <div className="hidden sm:grid grid-cols-12 gap-2 px-4 py-2 bg-[#D1CFC9] text-[10px] font-mono font-black border-b-2 border-[#141414] tracking-wide uppercase">
                <span className="col-span-2">Heure</span>
                <span className="col-span-2">Article</span>
                <span className="col-span-2 text-right">Prix</span>
                <span className="col-span-1 text-center">Reçu</span>
                <span className="col-span-1 text-center">Rendu</span>
                <span className="col-span-1 text-center">Tip</span>
                <span className="col-span-3 text-right">Photo</span>
              </div>

              {transactions.map((t) => {
                const mainItemName = t.items[0]?.name || "Article sans nom";
                const registerPrice = t.total;
                const timeStr = formatTimeOnly(t.timestamp);

                return (
                  <div key={t.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 px-4 py-3 items-center hover:bg-yellow-50/50 transition-colors font-mono text-xs">
                    
                    {/* Time of addition */}
                    <div className="col-span-2 flex items-center gap-1.5 font-mono text-[11px]">
                      <span className="bg-[#141414] text-white px-2 py-1 font-black leading-none text-[10px]">
                        {timeStr}
                      </span>
                    </div>

                    {/* Article designation */}
                    <div className="col-span-2 border-l-2 border-[#141414]/10 sm:border-l-0 pl-2 sm:pl-0 flex flex-col items-start gap-1">
                      <span className="font-serif italic font-black text-slate-900">{mainItemName}</span>
                      {t.condition && (
                        <span className="bg-[#141414] text-white px-1.5 py-0.5 text-[8px] uppercase tracking-wider whitespace-nowrap">
                          {t.condition}
                        </span>
                      )}
                      {t.comment && (
                        <span className="text-[9px] text-neutral-500 truncate w-full max-w-[120px]" title={t.comment}>
                          "{t.comment}"
                        </span>
                      )}
                    </div>

                    {/* Price in euros */}
                    <div className="col-span-2 sm:text-right font-black text-sm text-[#141414]">
                      {registerPrice.toFixed(2)} €
                    </div>

                    {/* Cash received (Reçu) */}
                    <div className="col-span-1 text-center font-bold text-[10px] text-slate-950">
                      {t.cashReceived.toFixed(2)}€
                    </div>

                    {/* Cash returned (Rendu) */}
                    <div className="col-span-1 text-center font-bold text-[10px] text-blue-900">
                      {t.changeReturned.toFixed(2)}€
                    </div>

                    {/* Tip (Pourboire) */}
                    <div className="col-span-1 text-center font-bold text-[10px] text-amber-800">
                      {t.tip && t.tip > 0 ? t.tip.toFixed(2) + "€" : "-"}
                    </div>

                    {/* Photo column */}
                    <div className="col-span-3 flex justify-end gap-1">
                      {t.images && t.images.length > 0 ? (
                        <>
                          <button onClick={() => { setSelectedImages(t.images!); setCurrentImageIndex(0); }} className="block focus:outline-none focus:ring-2 focus:ring-[#141414]">
                            <img src={t.images[0]} alt={mainItemName} className="w-12 h-12 object-cover border-2 border-[#141414] cursor-pointer hover:opacity-80 transition-opacity" />
                          </button>
                          {t.images.length > 1 && (
                            <button onClick={() => { setSelectedImages(t.images!); setCurrentImageIndex(1); }} className="w-12 h-12 flex items-center justify-center bg-[#D1CFC9] border-2 border-[#141414] text-[10px] font-black shrink-0 cursor-pointer hover:bg-[#C1BFB9]">
                              +{t.images.length - 1}
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="text-neutral-400 font-bold text-[10px]">-</span>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Full-screen Image Preview Modal */}
      {selectedImages && (
        <div className="fixed inset-0 z-[10001] bg-[#141414]/90 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setSelectedImages(null)}
            className="absolute top-6 right-6 p-2 bg-white text-[#141414] rounded-full shadow-lg hover:bg-neutral-200 transition-all z-50"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="relative w-full max-w-4xl flex items-center justify-center gap-4">
            {selectedImages.length > 1 && (
              <button 
                onClick={() => setCurrentImageIndex(prev => prev > 0 ? prev - 1 : selectedImages!.length - 1)}
                className="p-3 bg-white text-[#141414] rounded-full shadow-lg hover:bg-neutral-200 transition-all flex-shrink-0"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}
            
            <div className="flex-1 flex justify-center items-center h-[70vh]">
              <img src={selectedImages[currentImageIndex]} alt="Agrandissement" className="max-w-full max-h-full object-contain border-4 border-white shadow-2xl" />
            </div>
            
            {selectedImages.length > 1 && (
              <button 
                onClick={() => setCurrentImageIndex(prev => prev < selectedImages!.length - 1 ? prev + 1 : 0)}
                className="p-3 bg-white text-[#141414] rounded-full shadow-lg hover:bg-neutral-200 transition-all flex-shrink-0"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}
          </div>

          {selectedImages.length > 1 && (
            <div className="mt-8 flex gap-3 overflow-x-auto max-w-full pb-2 px-4 shadow-inner">
              {selectedImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`w-20 h-20 shrink-0 border-4 transition-all duration-200 ${idx === currentImageIndex ? 'border-white scale-110 z-10 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100 bg-[#141414] grayscale hover:grayscale-0'}`}
                >
                  <img src={img} alt={`Miniature ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
