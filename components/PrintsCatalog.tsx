"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X } from "lucide-react";
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

  const categories = useMemo(() => {
    const unique = Array.from(new Set(allPrints.map((p) => p.category))) as PrintCategory[];
    return ["All", ...unique];
  }, [allPrints]);

  useEffect(() => {
    if (zodiacResult) setActiveTab(zodiacResult.recommendedCategory);
  }, [zodiacResult]);

  const filteredPrints =
    activeTab === "All" ? allPrints : allPrints.filter((p) => p.category === activeTab);

  const recommendedIds = new Set(zodiacResult?.topPrintIds ?? []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!isSafeImageFile(file)) {
      setUploadError("Please upload a PNG, JPG, WEBP, or SVG under 8MB.");
      return;
    }
    setUploadError(null);

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
    <div>
      <div className="mb-4 flex items-baseline justify-between text-sm">
        <span className="text-ink">Design</span>
        {selected && (
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 text-graphite transition-colors hover:text-brass"
          >
            <X size={12} /> Clear
          </button>
        )}
      </div>

      {/* category tabs — plain text, underline for active, no pill/glow */}
      <div className="scrollbar-none mb-5 flex gap-5 overflow-x-auto text-sm">
        {categories.map((cat) => {
          const active = activeTab === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              className={`whitespace-nowrap border-b pb-1.5 transition-colors duration-200 ${
                active ? "border-brass text-brass" : "border-transparent text-graphite hover:text-ink"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* lookbook strip — horizontal scroll, large imagery, minimal chrome */}
      <div className="scrollbar-none -mx-6 flex gap-4 overflow-x-auto px-6 sm:-mx-10 sm:px-10 lg:mx-0 lg:px-0">
        <AnimatePresence mode="popLayout">
          {filteredPrints.map((print) => {
            const active = selected?.id === print.id;
            const recommended = recommendedIds.has(print.id);
            return (
              <motion.button
                key={print.id}
                type="button"
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => onSelect(print)}
                className="group relative w-36 shrink-0 text-left"
              >
                <div
                  className={`relative aspect-[4/5] overflow-hidden bg-paper transition-[outline] duration-200 ${
                    active ? "outline outline-2 outline-offset-2 outline-brass" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={print.image}
                    alt={print.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                    }}
                  />
                  {recommended && (
                    <span className="absolute left-2 top-2 bg-brass px-2 py-0.5 text-[10px] text-[#0C0B0A]">
                      For you
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-ink">{print.name}</p>
                <p className="text-xs text-graphite">+PKR {print.price}</p>
              </motion.button>
            );
          })}
        </AnimatePresence>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex aspect-[4/5] w-36 shrink-0 flex-col items-center justify-center gap-2 border border-dashed border-line text-graphite transition-colors duration-200 hover:border-brass hover:text-brass"
        >
          <Upload size={18} />
          <span className="text-xs">Upload your own</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />

      {uploadError && <p className="mt-2 text-xs text-red-400">{uploadError}</p>}
    </div>
  );
}
