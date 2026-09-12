"use client";

import { AnimatePresence, motion } from "framer-motion";
import { RotateCw } from "lucide-react";
import { useState } from "react";
import { PrintItem, PrintPosition, PrintType, TeeColor } from "@/lib/types";
import {
  AVAILABLE_ANGLES,
  getModelImage,
  getPrintBox,
  MODEL_ANGLES,
  ModelAngle,
  PANTS_COLOR_MAP,
} from "@/lib/model-config";

interface ModelStudioProps {
  color: TeeColor;
  printType: PrintType;
  printPosition: PrintPosition | null;
  selectedDesign: PrintItem | null;
  customText: string;
}

const ANGLE_LABEL: Record<ModelAngle, string> = {
  front: "Front",
  back: "Back",
  side: "Side",
};

export default function ModelStudio({
  color,
  printType,
  printPosition,
  selectedDesign,
  customText,
}: ModelStudioProps) {
  const [angle, setAngle] = useState<ModelAngle>("front");

  const printOn = printType !== "none";
  const showingBackPrint = printOn && printPosition === "back";
  const box = printOn ? getPrintBox(printType === "a3" ? "a3" : "a4", printPosition ?? "front") : null;
  const pantsInfo = PANTS_COLOR_MAP[color.id];
  const imageSrc = getModelImage(color.id, angle);
  const angleIsPlaceholder = !AVAILABLE_ANGLES[angle];

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-3xl bg-[#F4F3F1]">
      {/* studio backdrop gradient, like a real cyclorama sweep */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 15%, #FBFBFA 0%, #F1F0EE 55%, #E7E5E1 100%)",
        }}
        aria-hidden
      />

      {/* angle toggle */}
      <div className="absolute right-4 top-4 z-10 flex gap-1 rounded-full border border-black/10 bg-white/70 p-1 backdrop-blur">
        {MODEL_ANGLES.map((a) => {
          const active = a === angle;
          return (
            <button
              key={a}
              type="button"
              onClick={() => setAngle(a)}
              className={`rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors duration-200 ${
                active ? "bg-[#090A0F] text-[#00F0FF]" : "text-[#4A4E53] hover:text-[#090A0F]"
              }`}
              aria-pressed={active}
            >
              {ANGLE_LABEL[a]}
            </button>
          );
        })}
      </div>

      {angleIsPlaceholder && (
        <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-[10px] text-[#4A4E53] backdrop-blur">
          <RotateCw size={11} />
          {ANGLE_LABEL[angle]} photo coming soon — showing Front
        </div>
      )}

      <div className="relative h-full w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={imageSrc}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="relative h-full w-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={`${color.name} tee, ${pantsInfo.label} pants — ${angle} view`}
              className="h-full w-full object-cover object-top"
            />

            {/* print overlay, positioned as % of this image's own box */}
            <AnimatePresence>
              {printOn && box && (
                <motion.div
                  key={`${printType}-${printPosition}-${selectedDesign?.id ?? "none"}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: showingBackPrint ? 0.5 : 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute overflow-hidden rounded-sm"
                  style={{
                    left: `${box.leftPct}%`,
                    top: `${box.topPct}%`,
                    width: `${box.widthPct}%`,
                    height: `${box.heightPct}%`,
                    mixBlendMode: "multiply",
                  }}
                >
                  {selectedDesign ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedDesign.image}
                      alt={selectedDesign.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center border border-dashed border-[#00F0FF] bg-[#00F0FF]/10">
                      <span className="px-1 text-center text-[9px] font-medium text-[#0A6E76]">
                        Select a design
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {printOn && customText.trim() && box && (
              <div
                className="absolute text-center text-xs font-semibold text-[#12141C]"
                style={{
                  left: `${box.leftPct}%`,
                  top: `${box.topPct + box.heightPct + 1.5}%`,
                  width: `${box.widthPct}%`,
                }}
              >
                {customText.trim().slice(0, 24)}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* pants color readout */}
      <div className="absolute bottom-4 left-4 z-10 rounded-full border border-black/10 bg-white/80 px-3 py-1.5 text-[10px] text-[#4A4E53] backdrop-blur">
        Pants auto-matched: <span className="font-medium text-[#090A0F]">{pantsInfo.label}</span>
      </div>
    </div>
  );
}
