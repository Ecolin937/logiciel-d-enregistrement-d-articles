/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { CartItem } from "../types";
import { ArrowRight, Coins, Gift, Landmark, Sparkles, Camera, X } from "lucide-react";
import CameraModal from "./CameraModal";
import VirtualKeyboard from "./VirtualKeyboard";

interface ManualEntryProps {
  onRegisterSale: (sale: {
    name: string;
    price: number;
    cashReceived: number;
    changeReturned: number;
    tip: number;
    images?: string[];
    comment?: string;
    condition?: string;
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
  const [itemCode, setItemCode] = useState<string>("");
  const [itemImages, setItemImages] = useState<string[]>([]);
  const [itemComment, setItemComment] = useState<string>("");
  const [itemCondition, setItemCondition] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  
  // Virtual Keyboard state
  const [activeInput, setActiveInput] = useState<"code" | "comment" | null>(null);

  // Consume/clear any calculator injected values silently
  useEffect(() => {
    if (injectedPrice !== null) {
      onClearInjectedPrice();
    }
  }, [injectedPrice, onClearInjectedPrice]);

  useEffect(() => {
    if (injectedCash !== null) {
      onClearInjectedCash();
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

    if (!itemCode.trim()) {
      setFormError("Veuillez saisir le code de l'article (chiffres).");
      return;
    }

    if (!/^\d+$/.test(itemCode.trim())) {
      setFormError("Le code de l'article doit contenir uniquement des chiffres.");
      return;
    }

    // Add directly to sales history via parent controller with default numeric stats
    onRegisterSale({
      name: `Code: ${itemCode.trim()}`,
      price: 0,
      cashReceived: 0,
      changeReturned: 0,
      tip: 0,
      images: itemImages.length > 0 ? itemImages : undefined,
      comment: itemComment.trim() || undefined,
      condition: itemCondition || undefined,
    });

    // Reset form elements
    setItemCode("");
    setItemImages([]);
    setItemComment("");
    setItemCondition("");
    setFormError("");
  };

  const getKeyboardValue = () => {
    switch (activeInput) {
      case "code": return itemCode;
      case "comment": return itemComment;
      default: return "";
    }
  };

  const setKeyboardValue = (val: string) => {
    switch (activeInput) {
      case "code":
        // Strip out non-digits to ensure it remains strictly numeric
        setItemCode(val.replace(/[^0-9]/g, ""));
        break;
      case "comment":
        setItemComment(val);
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Saisie Manuelle de l'Article */}
      <div id="manual-entry-form" className="relative bg-[#FAF9F6] border-2 border-[#141414] p-5 shadow-[4px_4px_0px_#141414] rounded-none">

        <h3 className="italic font-serif font-black text-slate-900 text-sm mb-4 uppercase tracking-tight flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-amber-500 border border-[#141414]/70"></span>
          Saisie et Enregistrement de Vente
        </h3>

        <form onSubmit={handleManualSubmit} className="space-y-5">
          {/* Main article code input */}
          <div className="grid grid-cols-1 gap-4">
            {/* Code de l'article */}
            <div>
              <label id="input-label-code" htmlFor="item-code" className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1.5">
                Code de l'Article (uniquement des chiffres) <span className="text-red-500">*</span>
              </label>
              <input
                id="item-code"
                type="text"
                readOnly
                inputMode="none"
                onClick={() => setActiveInput("code")}
                value={itemCode}
                placeholder="Saisissez un code numérique (ex: 847293)..."
                className="w-full text-base font-mono font-bold border-2 border-[#141414] rounded-none px-3 py-3 bg-white text-[#141414] focus:outline-none focus:bg-yellow-50 focus:ring-0 placeholder-neutral-400 transition-all cursor-pointer shadow-inner"
              />
            </div>
          </div>

          {/* Commentaire, État et Photo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3 border-t-2 border-dashed border-[#141414]/15">
            
            {/* Commentaire de l'article - Facultatif */}
            <div>
              <label id="input-label-comment" htmlFor="item-comment" className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-1.5">
                Commentaire supplémentaire (Facultatif)
              </label>
              <input
                id="item-comment"
                type="text"
                readOnly
                inputMode="none"
                onClick={() => setActiveInput("comment")}
                value={itemComment}
                placeholder="Ex. Emballage abîmé, client habituel..."
                className="w-full text-sm font-mono border-2 border-[#141414] rounded-none px-3 py-2 bg-white text-[#141414] focus:outline-none focus:bg-yellow-50 focus:ring-0 placeholder-neutral-400 font-medium transition-all cursor-pointer"
              />
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
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {itemImages.map((img, idx) => (
                      <div key={idx} className="relative group w-16 h-16 shrink-0 font-sans">
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
                    Ajouter une photo
                  </button>
                </div>
              )}
            </div>

            {/* État de l'article */}
            <div className="md:col-span-2 pb-2">
              <label className="block text-[10px] font-mono font-bold text-slate-500 uppercase mb-2">
                État de l'article (Facultatif)
              </label>
              <div className="flex flex-wrap gap-3">
                {['Très bon état', 'Moyen état', 'Mauvais état'].map((condition) => (
                  <label key={condition} className={`flex items-center gap-2 text-xs font-mono font-bold px-3 py-1.5 border-2 border-[#141414] cursor-pointer transition-all ${itemCondition === condition ? 'bg-[#141414] text-white' : 'bg-white text-[#141414] hover:bg-neutral-100'}`}>
                    <input
                      type="radio"
                      name="itemCondition"
                      value={condition}
                      checked={itemCondition === condition}
                      onChange={(e) => setItemCondition(e.target.value)}
                      className="hidden"
                    />
                    {condition}
                  </label>
                ))}
              </div>
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

      {activeInput && (
        <VirtualKeyboard
          type={activeInput === "code" ? "numeric" : "text"}
          value={getKeyboardValue()}
          onChange={setKeyboardValue}
          onClose={() => setActiveInput(null)}
          placeholder={
            activeInput === "code" ? "Ex. 847293..." :
            "Commentaire..."
          }
        />
      )}
    </div>
  );
}
