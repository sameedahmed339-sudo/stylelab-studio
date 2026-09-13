"use client";

import { AnimatePresence, motion } from "framer-motion";
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
    <div className="relative h-[65vh] w-full bg-paper lg:h-screen">
      {/* angle toggle */}
      <div className="absolute right-6 top-6 z-10 flex gap-4 text-sm">
        {MODEL_ANGLES.map((a) => {
          const active = a === angle;
          return (
            <button
              key={a}
              type="button"
              onClick={() => setAngle(a)}
              className={`transition-colors duration-200 ${
                active ? "text-[#0C0B0A]" : "text-[#0C0B0A]/40 hover:text-[#0C0B0A]/70"
              }`}
              aria-pressed={active}
            >
              {ANGLE_LABEL[a]}
            </button>
          );
        })}
      </div>

      {angleIsPlaceholder && (
        <div className="absolute left-6 top-6 z-10 text-xs text-[#0C0B0A]/45">
          {ANGLE_LABEL[angle]} photo coming soon — showing Front
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={imageSrc}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="relative h-full w-full"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={`${color.name} tee, ${pantsInfo.label} pants — ${angle} view`}
            className="h-full w-full object-cover object-top"
          />

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
                  <div className="flex h-full w-full items-center justify-center border border-dashed border-[#0C0B0A]/25">
                    <span className="px-1 text-center text-[9px] font-medium text-[#0C0B0A]/50">
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

      <div className="absolute bottom-6 left-6 z-10 text-xs text-[#0C0B0A]/55">
        Pants auto-matched — <span className="text-[#0C0B0A]">{pantsInfo.label}</span>
      </div>
    </div>
  );
}
