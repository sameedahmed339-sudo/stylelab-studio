"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PanelTop, PanelBottom } from "lucide-react";
import { PRINT_LABELS, PRINT_PRICES } from "@/lib/pricing";
import { PrintPosition, PrintType } from "@/lib/types";
import { sanitizeText } from "@/lib/sanitize";

interface PrintOptionsProps {
  printType: PrintType;
  printPosition: PrintPosition | null;
  customText: string;
  onPrintTypeChange: (type: PrintType) => void;
  onPositionChange: (position: PrintPosition) => void;
  onCustomTextChange: (text: string) => void;
}

const PRINT_TYPES: PrintType[] = ["none", "a4", "a3"];

export default function PrintOptions({
  printType,
  printPosition,
  customText,
  onPrintTypeChange,
  onPositionChange,
  onCustomTextChange,
}: PrintOptionsProps) {
  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-3 text-sm font-medium text-[#E7E5E0]">Print</h3>
        <div className="grid grid-cols-3 gap-2">
          {PRINT_TYPES.map((type) => {
            const active = type === printType;
            const price = PRINT_PRICES[type];
            return (
              <motion.button
                key={type}
                type="button"
                whileTap={{ scale: 0.94 }}
                onClick={() => onPrintTypeChange(type)}
                className={`rounded-xl border px-3 py-3 text-left transition-colors duration-200 ${
                  active
                    ? "border-[#00F0FF] bg-[#00F0FF]/10 shadow-[0_0_16px_rgba(0,240,255,0.3)]"
                    : "border-white/10 bg-[#12141C] hover:border-white/25"
                }`}
                aria-pressed={active}
              >
                <div className={`text-xs font-medium ${active ? "text-[#00F0FF]" : "text-[#E7E5E0]"}`}>
                  {type === "none" ? "Plain" : type.toUpperCase()}
                </div>
                <div className="mt-1 text-[11px] text-[#7A7E86]">
                  {price === 0 ? "+PKR 0" : `+PKR ${price}`}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {printType !== "none" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <h3 className="mb-3 text-sm font-medium text-[#E7E5E0]">Print position</h3>
            <div className="flex gap-2">
              {(["front", "back"] as PrintPosition[]).map((pos) => {
                const active = printPosition === pos;
                const Icon = pos === "front" ? PanelTop : PanelBottom;
                return (
                  <motion.button
                    key={pos}
                    type="button"
                    whileTap={{ scale: 0.94 }}
                    onClick={() => onPositionChange(pos)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors duration-200 ${
                      active
                        ? "border-[#00F0FF] bg-[#00F0FF]/10 text-[#00F0FF] shadow-[0_0_16px_rgba(0,240,255,0.3)]"
                        : "border-white/10 bg-[#12141C] text-[#B8BBC2] hover:border-white/25"
                    }`}
                    aria-pressed={active}
                  >
                    <Icon size={15} />
                    {pos === "front" ? "Front Chest" : "Back Panel"}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-4">
              <label htmlFor="customText" className="mb-2 block text-sm font-medium text-[#E7E5E0]">
                Custom text (optional)
              </label>
              <input
                id="customText"
                type="text"
                maxLength={120}
                value={customText}
                onChange={(e) => onCustomTextChange(sanitizeText(e.target.value))}
                placeholder="e.g. your name or a short line"
                className="w-full rounded-xl border border-white/10 bg-[#0C0E14] px-3 py-2.5 text-sm text-[#E7E5E0] placeholder:text-[#5B5F68] outline-none transition-colors duration-200 focus:border-[#00F0FF]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
