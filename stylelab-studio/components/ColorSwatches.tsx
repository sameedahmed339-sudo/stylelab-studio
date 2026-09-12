"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { TEE_COLORS } from "@/lib/pricing";
import { TeeColor } from "@/lib/types";

interface ColorSwatchesProps {
  selected: TeeColor;
  onSelect: (color: TeeColor) => void;
}

export default function ColorSwatches({ selected, onSelect }: ColorSwatchesProps) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#E7E5E0]">Color</h3>
        <span className="text-xs text-[#7A7E86]">{selected.name}</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {TEE_COLORS.map((color) => {
          const active = color.id === selected.id;
          return (
            <motion.button
              key={color.id}
              type="button"
              onClick={() => onSelect(color)}
              whileTap={{ scale: 0.88 }}
              whileHover={{ scale: 1.06 }}
              className="relative flex h-11 w-11 items-center justify-center rounded-full ring-1 ring-white/10 transition-shadow duration-300"
              style={{
                backgroundColor: color.hex,
                boxShadow: active
                  ? "0 0 0 2px #090A0F, 0 0 0 4px #00F0FF, 0 0 18px rgba(0,240,255,0.55)"
                  : "0 0 0 2px #090A0F",
              }}
              aria-pressed={active}
              aria-label={color.name}
            >
              {active && (
                <Check
                  size={16}
                  strokeWidth={3}
                  color={color.printTone === "dark" ? "#090A0F" : "#F2EFE9"}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
