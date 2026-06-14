/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { CartItem } from "../types";
import { ArrowRight, Coins, Gift, Landmark, Sparkles, Camera, X } from "lucide-react";
import CameraModal from "./CameraModal";

interface ManualEntryProps {
  onRegisterSale: (sale: {
    name: string;
    price: number;
    cashReceived: number;
    changeReturned: number;
    tip: number;
    images?: string[];
  }) => void;
  injectedPrice: number | null;
  injectedCash: number | null;
  onClearInjectedPrice: () => void;
  onClearInjectedCash: () => void;
  isProcessing: boolean;
}

export default function ManualEntry({
  onRegisterSale,
  injectedPrice,
  injectedCash,
  onClearInjectedPrice,
  onClearInjectedCash,
  isProcessing,
}: ManualEntryProps) {
  // Manual form states
  const [itemName, setItemName] = useState<string>("");
  const [itemPrice, setItemPrice] = useState<string>("");
  const [itemCash, setItemCash] = useState<string>("");
  const [itemChange, setItemChange] = useState<string>("");
  const [itemTip, setItemTip] = useState<string>("");
  const [itemImages, setItemImages] = useState<string[]>([]);
  const [formError, setFormError] = useState<string>("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Sync injected price from calculator
  useEffect(() => {
    if (injectedPrice !== null) {
      setItemPrice(injectedPrice.toFixed(2));
      onClearInjectedPrice(); // consume the value

      // If item name is empty, provide a default designation
      if (!itemName) {
        setItemName("Article Saisi");
      }
    }
  }, [injectedPrice, itemName, onClearInjectedPrice]);

  // Sync injected cash from calculator
  useEffect(() => {
    if (injectedCash !== null) {
      setItemCash(injectedCash.toFixed(2));
      onClearInjectedCash(); // consume the value
    }
  }, [injectedCash, onClearInjectedCash]);

  // Handle the captured photo from the camera modal
  const handlePhotoCaptured = (dataUrl: string) => {
    setItemImages(prev => [...prev, dataUrl]);
    setIsCameraOpen(false);
  };

  const removePhoto = (index: number) => {
    setItemImages(prev => prev.filter((_, i) => i !== index));
  };

  // Handle manual submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;
    setFormError("");

    if (!itemName.trim()) {
      setFormError("Veuillez saisir le nom de l'article.");
      return;
    }

    const parsedPrice = parseFloat(itemPrice);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setFormError("Veuillez saisir un prix valide (ex: 2.50).");
      return;
    }

    // Parsing new payment and tip values
    const parsedCash = parseFloat(itemCash);
    const finalCash = isNaN(parsedCash) ? parsedPrice : parsedCash;

    // Change returned parsing (optional)
    let finalChange = 0;
    if (itemChange.trim() !== "") {
      const parsedChange = parseFloat(itemChange);
      finalChange = isNaN(parsedChange) ? 0 : parsedChange;
    } else {
      // If kept blank, auto-compute change if more cash was received
      finalChange = Math.max(0, finalCash - parsedPrice);
    }

    // Tip parsing (optional)
    let finalTip = 0;
    if (itemTip.trim() !== "") {
      const parsedTip = parseFloat(itemTip);
      finalTip = isNaN(parsedTip) ? 0 : parsedTip;
    }

    // Validation: make sure client paid enough if they explicitly fill the cashReceived
    if (finalCash < parsedPrice) {
      setFormError(`Le client n'a pas donné assez d'espèces (${finalCash.toFixed(2)} € < ${parsedPrice.toFixed(2)} €).`);
      return;
    }

    // Add directly to sales history via parent controller
    onRegisterSale({
      name: itemName.trim(),
      price: parsedPrice,
      cashReceived: finalCash,
      changeReturned: finalChange,
      tip: finalTip,
      images: itemImages.length > 0 ? itemImages : undefined,
    });

    // Reset form elements
    setItemName("");
    setItemPrice("");
    setItemCash("");
    setItemChange("");
    setItemTip("");
    setItemImages([]);
    setFormError("");
  };

  // Live auto-change calculation for visual help
  const currentPriceNum = parseFloat(itemPrice) || 0;
  const currentCashNum = parseFloat(itemCash) || 0;
  const computedChange = Math.max(0, currentCashNum - currentPriceNum);

  return (
    <div className="space-y-6">
      {/* Saisie Manuelle de l'Article */}
      <div id="manual-entry-form" className="relative bg-[#FAF9F6] border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#141414] rounded-none">

        <h3 className="italic font-serif font-black text-slate-900 text-sm mb-4 uppercase tracking-tight flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-amber-500 border border-[#141414]/70"></span>
          Saisie et Enregistrement de Vente
        </h3>

        <form onSubmit={handleManualSubmit} className="space-y-5">
          {/* Main article inputs */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Nom de l'article */}
            <div className="md:col-span-8">
              <label id="input-label-name" htmlFor="item-name" className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1.5">
                Désignation de l'Article
              </label>
              <input
                id="item-name"
                type="text"
                value={itemName}
                placeholder="Ex. BAGUETTE CHAUDE, CAFE LONG, FORMULE MIDI..."
                onChange={(e) => setItemName(e.target.value)}
                className="w-full text-sm font-mono border-2 border-[#141414] rounded-none px-3 py-2 bg-white text-[#141414] focus:outline-none focus:bg-yellow-50 focus:ring-0 placeholder-neutral-400 font-medium transition-all"
              />
            </div>

            {/* Prix de l'article */}
            <div className="md:col-span-4">
              <label id="input-label-price" htmlFor="item-price" className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1.5">
                P.U. (€)
              </label>
              <div className="relative">
                <input
                  id="item-price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={itemPrice}
                  placeholder="0.00"
                  onChange={(e) => setItemPrice(e.target.value)}
                  className="w-full text-sm font-bold font-mono border-2 border-[#141414] rounded-none pl-3 pr-8 py-2 bg-white text-[#141414] focus:outline-none focus:bg-yellow-50 focus:ring-0 placeholder-neutral-400 transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 font-bold text-xs font-mono">€</span>
              </div>
            </div>
          </div>

          {/* New specific fields added per request */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t-2 border-dashed border-[#141414]/15">
            {/* Especes données par le client */}
            <div>
              <label id="input-label-cash" htmlFor="item-cash" className="block text-[10px] font-mono font-bold text-emerald-700 uppercase mb-1.5 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" />
                Espèces données par le client
              </label>
              <div className="relative">
                <input
                  id="item-cash"
                  type="number"
                  step="0.01"
                  min="0"
                  value={itemCash}
                  placeholder={itemPrice ? parseFloat(itemPrice).toFixed(2) : "0.00"}
                  onChange={(e) => setItemCash(e.target.value)}
                  className="w-full text-xs font-bold font-mono border-2 border-[#141414] rounded-none pl-3 pr-8 py-2 bg-white text-[#141414] focus:outline-none focus:bg-emerald-50 focus:ring-0 placeholder-neutral-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 font-bold text-xs font-mono">€</span>
              </div>
            </div>

            {/* Argent rendu (Rendu monnaie) - Facultatif */}
            <div>
              <label id="input-label-change" htmlFor="item-change" className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5" />
                Argent rendu (Facultatif)
              </label>
              <div className="relative">
                <input
                  id="item-change"
                  type="number"
                  step="0.01"
                  min="0"
                  value={itemChange}
                  placeholder={computedChange > 0 ? computedChange.toFixed(2) : "Automatique"}
                  onChange={(e) => setItemChange(e.target.value)}
                  className="w-full text-xs font-bold font-mono border-2 border-[#141414] rounded-none pl-3 pr-8 py-2 bg-white text-[#141414] focus:outline-none focus:bg-yellow-50 focus:ring-0 placeholder-slate-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 font-bold text-xs font-mono">€</span>
              </div>
              {computedChange > 0 && !itemChange && (
                <span className="text-[9px] text-emerald-700 font-mono font-bold mt-1 block">
                  Recommandé : {computedChange.toFixed(2)} €
                </span>
              )}
            </div>

            {/* Pourboire du client - Facultatif */}
            <div>
              <label id="input-label-tip" htmlFor="item-tip" className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                <Gift className="w-3.5 h-3.5 text-amber-600" />
                Pourboire (Facultatif)
              </label>
              <div className="relative">
                <input
                  id="item-tip"
                  type="number"
                  step="0.01"
                  min="0"
                  value={itemTip}
                  placeholder="0.00"
                  onChange={(e) => setItemTip(e.target.value)}
                  className="w-full text-xs font-bold font-mono border-2 border-[#141414] rounded-none pl-3 pr-8 py-2 bg-white text-[#141414] focus:outline-none focus:bg-yellow-50 focus:ring-0 placeholder-slate-400"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-700 font-bold text-xs font-mono">€</span>
              </div>
            </div>
            
            {/* Photo de l'article - Facultatif */}
            <div>
              <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1.5 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                Photo de l'article (Facultatif)
              </label>
              
              {!itemImages.length ? (
                <button
                  type="button"
                  onClick={() => setIsCameraOpen(true)}
                  className="w-full text-xs font-bold font-mono border-2 border-[#141414] rounded-none py-1.5 px-3 bg-white text-[#141414] focus:outline-none focus:bg-blue-50 cursor-pointer flex items-center justify-center gap-2 hover:bg-neutral-100 transition-all border-dashed"
                >
                  <Camera className="w-3.5 h-3.5" />
                  Prendre une photo
                </button>
              ) : (
                <div className="mt-2 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {itemImages.map((img, idx) => (
                      <div key={idx} className="relative group w-16 h-16 shrink-0">
                        <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover border-2 border-[#141414]" />
                        <button
                          type="button"
                          onClick={() => removePhoto(idx)}
                          className="absolute -top-1 -right-1 bg-red-600 text-white p-0.5 rounded-full hover:bg-red-700 transition z-10"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="w-full text-[10px] font-bold font-mono text-[#141414] bg-white border-2 border-[#141414] px-2 py-1.5 hover:bg-neutral-100 transition-all rounded-none flex items-center justify-center gap-1.5 border-dashed"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    Ajouter une autre photo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2 border-t-2 border-dotted border-[#141414]/15">
            <button
              id="btn-add-manual-item"
              type="submit"
              disabled={isProcessing}
              className={`w-full h-[46px] font-black border-2 border-[#141414] rounded-none py-2 px-4 text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[3px_3px_0px_#777] ${
                isProcessing 
                  ? "bg-neutral-500 text-neutral-300 cursor-not-allowed border-neutral-600" 
                  : "bg-[#141414] hover:bg-neutral-800 text-white cursor-pointer active:translate-x-0.5 active:translate-y-0.5"
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{isProcessing ? "EN COURS D'ENREGISTREMENT..." : "VALIDER ET ENREGISTRER LA VENTE DIRECTEMENT"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {formError && (
            <p className="text-xs font-mono font-bold text-red-700 bg-red-50 border-2 border-red-900/60 p-2.5 rounded-none animate-fadeIn">
              ⚠ ERREUR : {formError}
            </p>
          )}
        </form>
      </div>

      {isCameraOpen && (
        <CameraModal 
          onCapture={handlePhotoCaptured} 
          onClose={() => setIsCameraOpen(false)} 
        />
      )}
    </div>
  );
}
