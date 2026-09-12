"use client";

import { motion } from "framer-motion";
import { SIZES } from "@/lib/pricing";
import { Size } from "@/lib/types";

interface SizeChipsProps {
  selected: Size;
  onSelect: (size: Size) => void;
}

export default function SizeChips({ selected, onSelect }: SizeChipsProps) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-[#E7E5E0]">Size</h3>
      <div className="flex gap-2">
        {SIZES.map((size) => {
          const active = size === selected;
          return (
            <motion.button
              key={size}
              type="button"
              onClick={() => onSelect(size)}
              whileTap={{ scale: 0.92 }}
              className={`flex h-11 w-14 items-center justify-center rounded-xl border text-sm font-medium transition-colors duration-200 ${
                active
                  ? "border-[#00F0FF] bg-[#00F0FF]/10 text-[#00F0FF] shadow-[0_0_16px_rgba(0,240,255,0.35)]"
                  : "border-white/10 bg-[#12141C] text-[#B8BBC2] hover:border-white/25"
              }`}
              aria-pressed={active}
            >
              {size}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
