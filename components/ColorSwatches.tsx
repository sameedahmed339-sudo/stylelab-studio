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
      <div className="mb-3 flex items-baseline justify-between text-sm">
        <span className="text-ink">Color</span>
        <span className="text-graphite">{selected.name}</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {TEE_COLORS.map((color) => {
          const active = color.id === selected.id;
          return (
            <motion.button
              key={color.id}
              type="button"
              onClick={() => onSelect(color)}
              whileTap={{ scale: 0.9 }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full transition-shadow duration-200"
              style={{
                backgroundColor: color.hex,
                boxShadow: active
                  ? "0 0 0 2px #0C0B0A, 0 0 0 3px #B08D57"
                  : "0 0 0 2px #0C0B0A, 0 0 0 3px rgba(237,234,227,0.15)",
              }}
              aria-pressed={active}
              aria-label={color.name}
            >
              {active && (
                <Check
                  size={14}
                  strokeWidth={3}
                  color={color.printTone === "dark" ? "#0C0B0A" : "#F3F0EA"}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
