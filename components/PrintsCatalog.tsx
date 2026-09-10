"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Upload, ImageOff } from "lucide-react";
import { printsCatalog } from "@/lib/prints-catalog";
import { PrintDesign } from "@/lib/types";
import { isSafeImageFile } from "@/lib/sanitize";

interface PrintsCatalogProps {
  selected: PrintDesign | null;
  onSelect: (design: PrintDesign | null) => void;
}

export default function PrintsCatalog({ selected, onSelect }: PrintsCatalogProps) {
  const [customDesigns, setCustomDesigns] = useState<PrintDesign[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allDesigns = [...printsCatalog, ...customDesigns];

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
    const design: PrintDesign = {
      id: `custom-${Date.now()}`,
      name: file.name.replace(/\.[^/.]+$/, "").slice(0, 40) || "Custom Upload",
      thumbnail: objectUrl,
      isCustom: true,
    };
    setCustomDesigns((prev) => [...prev, design]);
    onSelect(design);
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-[#E7E5E0]">Design catalog</h3>
        {selected && (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="flex items-center gap-1 text-xs text-[#7A7E86] transition-colors hover:text-[#00F0FF]"
          >
            <ImageOff size={12} /> Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-3">
        {allDesigns.map((design) => {
          const active = selected?.id === design.id;
          return (
            <motion.button
              key={design.id}
              type="button"
              whileTap={{ scale: 0.94 }}
              onClick={() => onSelect(design)}
              className={`group relative aspect-square overflow-hidden rounded-xl border bg-[#12141C] transition-colors duration-200 ${
                active
                  ? "border-[#00F0FF] shadow-[0_0_16px_rgba(0,240,255,0.3)]"
                  : "border-white/10 hover:border-white/25"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={design.thumbnail}
                alt={design.name}
                className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/80 to-transparent px-1.5 py-1.5 text-[10px] text-[#E7E5E0]">
                {design.name}
              </span>
            </motion.button>
          );
        })}

        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={() => fileInputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-white/20 bg-[#12141C] text-[#7A7E86] transition-colors duration-200 hover:border-[#00F0FF] hover:text-[#00F0FF]"
        >
          <Upload size={16} />
          <span className="text-[10px]">Upload</span>
        </motion.button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={handleFileChange}
      />

      {uploadError && <p className="mt-2 text-xs text-[#FF6B6B]">{uploadError}</p>}
    </div>
  );
}
