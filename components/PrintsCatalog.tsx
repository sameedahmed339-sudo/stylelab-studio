"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, ImageOff, Sparkles } from "lucide-react";
import { printsCatalog } from "@/lib/prints-catalog";
import { PrintCategory, PrintItem } from "@/lib/types";
import { isSafeImageFile } from "@/lib/sanitize";
import { ZodiacMatchResult } from "@/lib/zodiac";

interface PrintsCatalogProps {
  selected: PrintItem | null;
  onSelect: (print: PrintItem) => void;
  onClear: () => void;
  zodiacResult?: ZodiacMatchResult | null;
}

export default function PrintsCatalog({ selected, onSelect, onClear, zodiacResult }: PrintsCatalogProps) {
  const [customDesigns, setCustomDesigns] = useState<PrintItem[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("All");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allPrints = [...printsCatalog, ...customDesigns];

  // Tabs derive from whatever categories actually exist in the catalog,
  // so a newly added design/category shows up without touching this file.
  const categories = useMemo(() => {
    const unique = Array.from(new Set(allPrints.map((p) => p.category))) as PrintCategory[];
    return ["All", ...unique];
  }, [allPrints]);

  // When the Vibe & Zodiac quiz produces a result, jump the tab to the
  // matched category so the recommendation is immediately visible.
  useEffect(() => {
    if (zodiacResult) setActiveTab(zodiacResult.recommendedCategory);
  }, [zodiacResult]);

  const filteredPrints =
    activeTab === "All" ? allPrints : allPrints.filter((p) => p.category === activeTab);

  const recommendedIds = new Set(zodiacResult?.topPrintIds ?? []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    if (!isSafeImageFile(file)) {
      setUploadError("Please upload a PNG, JPG, WEBP, or SVG under 8MB.");
      return;
    }
    setUploadError(null);

    // Preview-only: object URL never leaves the browser / isn't persisted.
    const objectUrl = URL.createObjectURL(file);
    const design: PrintItem = {
      id: `custom-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, "").slice(0, 40) || "Custom Upload",
      category: "Custom",
      price: 300,
      image: objectUrl,
      description: "Your own upload, previewed on the tee.",
      isCustom: true,
    };
    setCustomDesigns((prev) => [...prev, design]);
    setActiveTab("Custom");
    onSelect(design);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#E7E5E0]">Design catalog</h3>
        {selected && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-[#7A7E86] transition-colors hover:text-[#00F0FF]"
          >
            <ImageOff size={12} /> Clear
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="scrollbar-none flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const active = activeTab === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium transition-colors duration-200 ${
                active
                  ? "border-[#00F0FF] bg-[#00F0FF]/10 text-[#00F0FF] shadow-[0_0_14px_rgba(0,240,255,0.3)]"
                  : "border-white/10 bg-[#12141C] text-[#7A7E86] hover:border-white/25 hover:text-[#B8BBC2]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Print grid */}
      <div className="grid grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredPrints.map((print) => {
            const active = selected?.id === print.id;
            const recommended = recommendedIds.has(print.id);
            return (
              <motion.button
                key={print.id}
                type="button"
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onSelect(print)}
                className={`group relative rounded-xl border p-3 text-left transition-colors duration-200 ${
                  active
                    ? "border-[#00F0FF] bg-[#00F0FF]/5 shadow-[0_0_16px_rgba(0,240,255,0.3)]"
                    : recommended
                    ? "border-[#00F0FF]/50 bg-[#00F0FF]/[0.03]"
                    : "border-white/10 bg-[#12141C] hover:border-white/25"
                }`}
              >
                {recommended && (
                  <span className="absolute -top-2 left-2 flex items-center gap-1 rounded-full bg-[#00F0FF] px-2 py-0.5 text-[9px] font-semibold text-[#090A0F]">
                    <Sparkles size={9} /> For you
                  </span>
                )}
                <div className="mb-2 flex aspect-square items-center justify-center overflow-hidden rounded-lg bg-[#0C0E14]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={print.image}
                    alt={print.name}
                    className="h-3/4 object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
                <h4 className="truncate text-xs font-medium text-[#E7E5E0]">{print.name}</h4>
                <p className="mt-0.5 truncate text-[10px] text-[#7A7E86]">{print.description}</p>
                <span className="mt-1 block text-[10px] text-[#00F0FF]">+PKR {print.price}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>

        {(activeTab === "All" || activeTab === "Custom") && (
          <motion.button
            type="button"
            layout
            whileTap={{ scale: 0.96 }}
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-auto flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/20 bg-[#12141C] p-6 text-[#7A7E86] transition-colors duration-200 hover:border-[#00F0FF] hover:text-[#00F0FF]"
          >
            <Upload size={18} />
            <span className="text-[11px]">Upload your own</span>
          </motion.button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />

      {uploadError && <p className="text-xs text-[#FF6B6B]">{uploadError}</p>}
    </div>
  );
}
