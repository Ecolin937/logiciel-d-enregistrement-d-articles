/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Delete, Check, ArrowRightLeft, ArrowUpRight, Coins, Percent } from "lucide-react";

interface CalculatorProps {
  onInjectPrice: (value: number) => void;
  currentTotal: number;
}

export default function Calculator({ onInjectPrice, currentTotal }: CalculatorProps) {
  const [display, setDisplay] = useState<string>("0");
  const [formula, setFormula] = useState<string>("");
  const [isDoneReset, setIsDoneReset] = useState<boolean>(false);

  const handleNum = (num: string) => {
    if (display === "0" || isDoneReset) {
      setDisplay(num);
      setIsDoneReset(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleDecimal = () => {
    if (isDoneReset) {
      setDisplay("0.");
      setIsDoneReset(false);
      return;
    }
    if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const handleOperator = (op: string) => {
    setIsDoneReset(false);
    // Replace any trailing operator if double-clicked
    if (/[+\-*/]\s*$/.test(formula) && display === "0") {
      setFormula(formula.slice(0, -3) + ` ${op} `);
      return;
    }
    setFormula(formula + " " + display + " " + op + " ");
    setDisplay("0");
  };

  const handleClear = () => {
    setDisplay("0");
    setFormula("");
    setIsDoneReset(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay("0");
    }
  };

  const handleEvaluate = () => {
    if (!formula) return;
    const fullExpression = formula + display;
    try {
      // Safe evaluation using standard JS math rules on sanitized inputs
      // We only allow numbers, spaces, and operators.
      const sanitized = fullExpression.replace(/[^0-9+\-*/. ]/g, "");
      // eslint-disable-next-line no-eval
      const result = eval(sanitized);
      if (result === undefined || isNaN(result)) {
        setDisplay("Erreur");
      } else {
        // Format to max 4 decimal digits
        const roundedResult = Math.round(result * 10000) / 10000;
        setDisplay(roundedResult.toString());
        setFormula(fullExpression + " =");
        setIsDoneReset(true);
      }
    } catch (e) {
      setDisplay("Erreur");
    }
  };

  const getCurrentNumericValue = (): number => {
    const val = parseFloat(display);
    return isNaN(val) ? 0 : val;
  };

  return (
    <div id="calculator-widget" className="bg-[#FAF9F6] text-[#141414] border-2 border-[#141414] p-4 shadow-[4px_4px_0px_#141414] flex flex-col h-full justify-between rounded-none">
      {/* Title & Stats */}
      <div>
        <div className="flex items-center justify-between mb-3 border-b-2 border-dotted border-[#141414]/30 pb-2">
          <span className="italic font-serif font-black text-xs tracking-tight uppercase">
            CALC_AUXILIAIRE_TACTILE
          </span>
          <span className="text-[10px] uppercase font-mono font-black bg-[#141414] text-amber-400 px-2 py-0.5 border border-[#141414]">
            PANIER : {currentTotal.toFixed(2)} €
          </span>
        </div>

        {/* Screen */}
        <div className="bg-[#D1CFC9] px-4 py-3 border-2 border-[#141414] rounded-none mb-4 text-right shadow-inner">
          <div className="text-[11px] font-mono font-bold text-neutral-700 min-h-[1.25rem] truncate">
            {formula || <span className="opacity-0">0</span>}
          </div>
          <div className="text-3xl font-mono tracking-tight font-black text-[#141414] truncate mt-0.5">
            {display}
          </div>
        </div>
      </div>

      {/* Grid Keyboard */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {/* Row 1 */}
        <button
          id="btn-calc-clear"
          onClick={handleClear}
          className="col-span-2 bg-red-100 hover:bg-red-200 text-red-950 font-mono font-black py-3 rounded-none border-2 border-[#141414]/90 cursor-pointer shadow-[2px_2px_0px_#141414] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-center text-sm"
        >
          AC
        </button>
        <button
          id="btn-calc-back"
          onClick={handleBackspace}
          className="bg-stone-100 hover:bg-stone-200 text-[#141414] flex items-center justify-center py-3 rounded-none border-2 border-[#141414]/90 cursor-pointer shadow-[2px_2px_0px_#141414] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          title="Retour"
        >
          <Delete className="w-4 h-4 text-slate-800" />
        </button>
        <button
          id="btn-calc-div"
          onClick={() => handleOperator("/")}
          className="bg-[#D1CFC9] hover:bg-[#C1BFA9] text-[#141414] font-mono font-black py-3 rounded-none border-2 border-[#141414] cursor-pointer shadow-[2px_2px_0px_#141414] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          id="btn-calc-7"
          onClick={() => handleNum("7")}
          className="bg-white hover:bg-stone-100 text-[#141414] font-mono font-black py-3 rounded-none border-2 border-[#141414]/80 cursor-pointer shadow-[2px_2px_0px_#141414] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          7
        </button>
        <button
          id="btn-calc-8"
          onClick={() => handleNum("8")}
          className="bg-white hover:bg-stone-100 text-[#141414] font-mono font-black py-3 rounded-none border-2 border-[#141414]/80 cursor-pointer shadow-[2px_2px_0px_#141414] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          8
        </button>
        <button
          id="btn-calc-9"
          onClick={() => handleNum("9")}
          className="bg-white hover:bg-stone-100 text-[#141414] font-mono font-black py-3 rounded-none border-2 border-[#141414]/80 cursor-pointer shadow-[2px_2px_0px_#141414] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          9
        </button>
        <button
          id="btn-calc-mul"
          onClick={() => handleOperator("*")}
          className="bg-[#D1CFC9] hover:bg-[#C1BFA9] text-[#141414] font-mono font-black py-3 rounded-none border-2 border-[#141414] cursor-pointer shadow-[2px_2px_0px_#141414] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          id="btn-calc-4"
          onClick={() => handleNum("4")}
          className="bg-white hover:bg-stone-100 text-[#141414] font-mono font-black py-3 rounded-none border-2 border-[#141414]/80 cursor-pointer shadow-[2px_2px_0px_#141414] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          4
        </button>
        <button
          id="btn-calc-5"
          onClick={() => handleNum("5")}
          className="bg-white hover:bg-stone-100 text-[#141414] font-mono font-black py-3 rounded-none border-2 border-[#141414]/80 cursor-pointer shadow-[2px_2px_0px_#141414] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          5
        </button>
        <button
          id="btn-calc-6"
          onClick={() => handleNum("6")}
          className="bg-white hover:bg-stone-100 text-[#141414] font-mono font-black py-3 rounded-none border-2 border-[#141414]/80 cursor-pointer shadow-[2px_2px_0px_#141414] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          6
        </button>
        <button
          id="btn-calc-sub"
          onClick={() => handleOperator("-")}
          className="bg-[#D1CFC9] hover:bg-[#C1BFA9] text-[#141414] font-mono font-black py-3 rounded-none border-2 border-[#141414] cursor-pointer shadow-[2px_2px_0px_#141414] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          -
        </button>

        {/* Row 4 */}
        <button
          id="btn-calc-1"
          onClick={() => handleNum("1")}
          className="bg-white hover:bg-stone-100 text-[#141414] font-mono font-black py-3 rounded-none border-2 border-[#141414]/80 cursor-pointer shadow-[2px_2px_0px_#141414] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          1
        </button>
        <button
          id="btn-calc-2"
          onClick={() => handleNum("2")}
          className="bg-white hover:bg-stone-100 text-[#141414] font-mono font-black py-3 rounded-none border-2 border-[#141414]/80 cursor-pointer shadow-[2px_2px_0px_#141414] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          2
        </button>
        <button
          id="btn-calc-3"
          onClick={() => handleNum("3")}
          className="bg-white hover:bg-stone-100 text-[#141414] font-mono font-black py-3 rounded-none border-2 border-[#141414]/80 cursor-pointer shadow-[2px_2px_0px_#141414] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          3
        </button>
        <button
          id="btn-calc-add"
          onClick={() => handleOperator("+")}
          className="bg-[#D1CFC9] hover:bg-[#C1BFA9] text-[#141414] font-mono font-black py-3 rounded-none border-2 border-[#141414] cursor-pointer shadow-[2px_2px_0px_#141414] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          id="btn-calc-0"
          onClick={() => handleNum("0")}
          className="bg-white hover:bg-stone-100 text-[#141414] font-mono font-black py-3 rounded-none border-2 border-[#141414]/80 cursor-pointer shadow-[2px_2px_0px_#141414] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          0
        </button>
        <button
          id="btn-calc-dot"
          onClick={handleDecimal}
          className="bg-white hover:bg-stone-100 text-[#141414] font-mono font-black py-3 rounded-none border-2 border-[#141414]/80 cursor-pointer shadow-[2px_2px_0px_#141414] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          .
        </button>
        <button
          id="btn-calc-eval"
          onClick={handleEvaluate}
          className="col-span-2 bg-[#141414] hover:bg-neutral-800 text-white font-mono font-black py-3 rounded-none border-2 border-[#141414] cursor-pointer shadow-[2px_2px_0px_#111] transition-all active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          =
        </button>
      </div>

      {/* Integration actions with Cashier fields */}
      <div className="space-y-2 pt-2.5 border-t-2 border-dotted border-[#141414]">
        <p className="text-[10px] font-mono uppercase text-[#141414]/70 font-black tracking-wide mb-1">
          Transférer le résultat ({display} €) :
        </p>
        <button
          id="btn-calc-inject-price"
          onClick={() => onInjectPrice(getCurrentNumericValue())}
          disabled={getCurrentNumericValue() <= 0}
          className="w-full flex items-center justify-center gap-1.5 py-3 bg-amber-400 text-slate-950 hover:bg-amber-500 disabled:opacity-40 disabled:pointer-events-none border-2 border-[#141414] rounded-none font-black text-xs font-mono transition-all cursor-pointer shadow-[2px_2px_0px_#141414] active:shadow-none"
        >
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[3px]" />
          <span>INJECTER DANS PRIX</span>
        </button>
      </div>
    </div>
  );
}
