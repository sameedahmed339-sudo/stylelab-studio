"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PanelTop, PanelBottom } from "lucide-react";
import { PRINT_PRICES } from "@/lib/pricing";
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
    <div className="space-y-6">
      <div>
        <span className="mb-3 block text-sm text-ink">Print</span>
        <div className="grid grid-cols-3 gap-2">
          {PRINT_TYPES.map((type) => {
            const active = type === printType;
            const price = PRINT_PRICES[type];
            return (
              <motion.button
                key={type}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => onPrintTypeChange(type)}
                className={`rounded-xl border px-3 py-3 text-left transition-colors duration-200 ${
                  active ? "border-brass" : "border-line hover:border-ink/30"
                }`}
              >
                <div className={`text-sm ${active ? "text-brass" : "text-ink"}`}>
                  {type === "none" ? "Plain" : type.toUpperCase()}
                </div>
                <div className="mt-1 text-xs text-graphite">
                  {price === 0 ? "PKR 0" : `+PKR ${price}`}
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
            <span className="mb-3 block text-sm text-ink">Print position</span>
            <div className="flex gap-2">
              {(["front", "back"] as PrintPosition[]).map((pos) => {
                const active = printPosition === pos;
                const Icon = pos === "front" ? PanelTop : PanelBottom;
                return (
                  <motion.button
                    key={pos}
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => onPositionChange(pos)}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors duration-200 ${
                      active
                        ? "border-brass text-brass"
                        : "border-line text-graphite hover:border-ink/30 hover:text-ink"
                    }`}
                  >
                    <Icon size={15} />
                    {pos === "front" ? "Front Chest" : "Back Panel"}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-4">
              <label htmlFor="customText" className="mb-2 block text-sm text-ink">
                Custom text (optional)
              </label>
              <input
                id="customText"
                type="text"
                maxLength={120}
                value={customText}
                onChange={(e) => onCustomTextChange(sanitizeText(e.target.value))}
                placeholder="e.g. your name or a short line"
                className="w-full border-b border-line bg-transparent py-2 text-sm text-ink placeholder:text-graphite/60 outline-none transition-colors duration-200 focus:border-brass"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
