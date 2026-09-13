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
      <span className="mb-3 block text-sm text-ink">Size</span>
      <div className="flex gap-2">
        {SIZES.map((size) => {
          const active = size === selected;
          return (
            <motion.button
              key={size}
              type="button"
              onClick={() => onSelect(size)}
              whileTap={{ scale: 0.94 }}
              className={`flex h-11 w-14 items-center justify-center rounded-full border text-sm transition-colors duration-200 ${
                active
                  ? "border-brass text-brass"
                  : "border-line text-graphite hover:border-ink/40 hover:text-ink"
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
