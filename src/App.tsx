/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect, useMemo } from "react";
import { CartItem, Transaction } from "./types";

import ManualEntry from "./components/ManualEntry";
import Calculator from "./components/Calculator";
import HistoryLog from "./components/HistoryLog";
import { Store, Clock, CheckCircle2, DollarSign, Calculator as CalcIcon, AlertTriangle } from "lucide-react";

export default function App() {
  // 1. Core Cash Register States
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem("caisse_transactions");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeView, setActiveView] = useState<'calculator' | 'register' | 'history'>('calculator');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // 2. Integration States (Bridge between Calculator and custom inputs)
  const [injectedPrice, setInjectedPrice] = useState<number | null>(null);
  const [injectedCash, setInjectedCash] = useState<number | null>(null);

  // 3. User Feedback & Loading States
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  const [isGlobalRegistered, setIsGlobalRegistered] = useState<boolean>(false);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Live timer state
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);
    
    // Set initial time
    setCurrentTime(
      new Date().toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    );

    return () => clearInterval(timer);
  }, []);

  // Save state continuously to LocalStorage
  useEffect(() => {
    localStorage.setItem("caisse_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // 4. Transaction & Sale Handlers with Full-Screen Sequential Loading Dialogs
  const handleRegisterSale = (sale: {
    name: string;
    price: number;
    cashReceived: number;
    changeReturned: number;
    tip: number;
  }) => {
    // Formulate transaction layout early to make sure timing works
    const itemWithId: CartItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: sale.name,
      price: sale.price,
      quantity: 1,
    };

    const computedTotal = sale.price;
    const change = sale.changeReturned;
    const tip = sale.tip;

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      receiptNumber: `${new Date().getFullYear().toString().slice(-2)}${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      items: [itemWithId],
      total: computedTotal,
      cashReceived: sale.cashReceived,
      changeReturned: change,
      tip: tip,
    };

    // First aspect: activate "CHARGEMENT" full screen for 2s
    setIsGlobalLoading(true);

    setTimeout(() => {
      // After 2s, close "CHARGEMENT", register to SQL/local-storage history, and open "ENREGISTRÉ"
      setIsGlobalLoading(false);
      setTransactions((prev) => [newTransaction, ...prev]);
      setIsGlobalRegistered(true);

      // After an additional 1.5s, close "ENREGISTRÉ"
      setTimeout(() => {
        setIsGlobalRegistered(false);
      }, 1500);
    }, 2000);
  };

  const handleClearHistory = () => {
    setShowResetConfirm(true);
  };

  const confirmClearHistory = () => {
    setTransactions([]);
    localStorage.removeItem("caisse_transactions");
    setShowResetConfirm(false);
  };

  // 5. Direct Inject callbacks from Calculator
  const handleInjectPrice = (val: number) => {
    setInjectedPrice(val);
    setActiveView('register');
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] flex flex-col font-sans border-4 border-[#141414] selection:bg-yellow-200 select-none">
      
      {/* HEADER BAR */}
      <header id="app-header" className="h-14 border-b-2 border-[#141414] px-4 md:px-6 flex items-center justify-between bg-[#D1CFC9] shrink-0">
        <div className="flex gap-4 sm:gap-8 items-center">
          <span className="font-black tracking-tighter text-base sm:text-lg text-[#141414] flex items-center gap-2">
            <Store className="w-5 h-5" />
            SYSTEME_CAISSE v4.02
          </span>
        </div>

        {/* NAVIGATION MENU TRIGGER */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="px-4 py-2 text-xs font-black font-mono border-2 border-[#141414] bg-[#141414] text-white uppercase tracking-wider"
        >
          MENU
        </button>

        <div className="flex items-center gap-4">
          <div className="text-right font-mono text-xs hidden sm:block">
            <div className="font-bold">12 JUN 2026</div>
            <div className="opacity-60">{currentTime || "12:00:00"}</div>
          </div>
        </div>
      </header>

      {/* FULL-SCREEN MENU OVERLAY */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[9999] bg-[#E4E3E0] flex flex-col items-center justify-center gap-6 p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-lg">
            <button
              onClick={() => { setActiveView('calculator'); setIsMenuOpen(false); }}
              className="w-32 h-32 flex flex-col items-center justify-center p-4 text-sm font-black font-mono border-4 border-[#141414] bg-yellow-300 hover:bg-yellow-400 uppercase transition-all"
            >
              Calculatrice
            </button>
            <button
              onClick={() => { setActiveView('register'); setIsMenuOpen(false); }}
              className="w-32 h-32 flex flex-col items-center justify-center p-4 text-sm font-black font-mono border-4 border-[#141414] bg-green-400 hover:bg-green-500 uppercase transition-all"
            >
              Enregistrer
            </button>
            <button
              onClick={() => { setActiveView('history'); setIsMenuOpen(false); }}
              className="w-32 h-32 flex flex-col items-center justify-center p-4 text-sm font-black font-mono border-4 border-[#141414] bg-pink-400 hover:bg-pink-500 uppercase transition-all"
            >
              Historique
            </button>
          </div>
        </div>
      )}

      {/* DASHBOARD CONTENT CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 md:p-6 space-y-6">

        {/* RESET CONFIRMATION DIALOG (IFRAME-FRIENDLY REPLACEMENT FOR WINDOW.CONFIRM) */}
        {showResetConfirm && (
          <div className="bg-red-50 border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#141414] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-slideDown">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-none bg-red-100 border-2 border-[#141414] flex items-center justify-center text-red-700 shrink-0 mt-0.5">
                <AlertTriangle className="w-5.5 h-5.5" />
              </div>
              <div>
                <h4 className="font-black text-[#141414] text-sm uppercase">Réinitialiser l'historique complet ?</h4>
                <p className="text-xs text-neutral-700 mt-0.5 font-medium">
                  Cette action supprimera toutes les ventes de la session, le chiffre d'affaires cumulé et l'historique d'audit.
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full md:w-auto shrink-0 mt-2 md:mt-0">
              <button
                id="btn-cancel-reset"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 md:flex-none text-xs font-bold px-4 py-2.5 border-2 border-[#141414] bg-white hover:bg-neutral-100 text-[#141414] cursor-pointer"
              >
                Annuler
              </button>
              <button
                id="btn-confirm-reset"
                onClick={confirmClearHistory}
                className="flex-1 md:flex-none text-xs font-black uppercase tracking-wider px-5 py-2.5 bg-red-650 hover:bg-red-700 text-white border-2 border-[#141414] cursor-pointer shadow-[2px_2px_0px_#111] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Oui, Vider la Caisse
              </button>
            </div>
          </div>
        )}

        {/* ACTIVE VIEW CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {activeView === 'calculator' && (
            <div className="lg:col-span-12">
              <Calculator
                onInjectPrice={handleInjectPrice}
                currentTotal={transactions[0]?.total || 0}
              />
            </div>
          )}

          {activeView === 'register' && (
            <div className="lg:col-span-12">
              <ManualEntry
                onRegisterSale={handleRegisterSale}
                injectedPrice={injectedPrice}
                injectedCash={injectedCash}
                onClearInjectedPrice={() => setInjectedPrice(null)}
                onClearInjectedCash={() => setInjectedCash(null)}
                isProcessing={isGlobalLoading || isGlobalRegistered}
              />
            </div>
          )}

          {activeView === 'history' && (
            <div className="lg:col-span-12">
              <HistoryLog
                transactions={transactions}
                onClearHistory={handleClearHistory}
              />
            </div>
          )}
        </div>

      </main>

      {/* FOOTER METADATA BAR */}
      <footer id="app-footer" className="bg-[#D1CFC9] border-t-2 border-[#141414] py-3 mt-auto shrink-0 select-none">
        <div className="w-full max-w-7xl mx-auto px-4 md:px-6 text-center text-[11px] text-[#141414] font-mono tracking-wider flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <span className="font-bold">SYSTEME_CAISSE ENREGISTREUSE © 2026</span>
          <span className="bg-[#141414] text-amber-400 px-3 py-1 font-bold tracking-tight text-[10px]">
            ALIMENTATION HORS-LIGNE ACTIVÉE (LOCALSTORAGE SYNC)
          </span>
        </div>
      </footer>

      {/* LOADER ON FOREGROUND (NO ANIMATION, NOT FULL SCREEN) */}
      {isGlobalLoading && (
        <div id="loader-overlay" className="fixed inset-0 z-[9999] flex items-center justify-center p-4 select-none font-sans">
          <div className="bg-yellow-100 text-[#141414] border-4 border-[#141414] p-8 text-center max-w-sm w-full shadow-[8px_8px_0px_#141414] rounded-none flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#141414] border-t-transparent rounded-full animate-spin mb-4"></div>
            <h1 className="font-serif italic font-black text-4xl tracking-tighter uppercase mb-2">
              CHARGEMENT
            </h1>
            <p className="font-mono text-[11px] text-neutral-800 uppercase tracking-widest font-black">
              Veuillez patienter deux secondes...
            </p>
          </div>
        </div>
      )}

      {/* SUCCESS STATE ON FOREGROUND (NO ANIMATION, NOT FULL SCREEN) */}
      {isGlobalRegistered && (
        <div id="success-overlay" className="fixed inset-0 z-[9999] flex items-center justify-center p-4 select-none font-sans">
          <div className="bg-emerald-500 text-white border-4 border-[#141414] p-8 text-center max-w-sm w-full shadow-[8px_8px_0px_#141414] rounded-none">
            <span className="text-4xl mb-3 block">✓</span>
            <h1 className="font-serif italic font-black text-4xl tracking-tighter uppercase mb-2 text-[#141414]">
              ENREGISTRÉ
            </h1>
            <p className="font-mono text-[11px] text-white uppercase tracking-widest font-black bg-[#141414] px-3 py-1.5 inline-block">
              TRANSACTION VALIDÉE !
            </p>
          </div>
        </div>
      )}

    </div>
  );
}
