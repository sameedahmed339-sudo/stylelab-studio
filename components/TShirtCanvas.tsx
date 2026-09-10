"use client";

import { AnimatePresence, motion } from "framer-motion";
import { PrintDesign, PrintPosition, PrintType, TeeColor } from "@/lib/types";

interface TShirtCanvasProps {
  color: TeeColor;
  printType: PrintType;
  printPosition: PrintPosition | null;
  selectedDesign: PrintDesign | null;
  customText: string;
}

/**
 * Front/back placeholder silhouettes drawn as flat SVG paths. Swap the
 * `<path d="...">` with your real garment vector when you have one —
 * the color, print-overlay, and animation logic all key off the same
 * viewBox so nothing else needs to change.
 */
export default function TShirtCanvas({
  color,
  printType,
  printPosition,
  selectedDesign,
  customText,
}: TShirtCanvasProps) {
  const showingBack = printPosition === "back" && printType !== "none";
  const printOn = printType !== "none";

  // A4 ≈ portrait, A3 ≈ larger portrait — scaled for the print box on the tee
  const printBox =
    printType === "a3"
      ? { w: 130, h: 165 }
      : printType === "a4"
      ? { w: 105, h: 140 }
      : { w: 0, h: 0 };

  const printY = printPosition === "back" ? 128 : 118;

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {/* ambient glow */}
      <div
        className="pointer-events-none absolute h-[420px] w-[420px] rounded-full opacity-20 blur-3xl transition-colors duration-700"
        style={{ backgroundColor: "#00F0FF" }}
        aria-hidden
      />

      <div className="relative aspect-[3/4] w-full max-w-[420px]">
        <svg
          viewBox="0 0 360 460"
          className="h-full w-full drop-shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
        >
          <defs>
            <linearGradient id="fabricShade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.18" />
            </linearGradient>
          </defs>

          {/* Boxy drop-shoulder tee silhouette */}
          <motion.path
            d="M108 46 L60 78 L18 150 L54 182 L84 156 L84 420 L276 420 L276 156 L306 182 L342 150 L300 78 L252 46
               C252 46 234 74 180 74 C126 74 108 46 108 46 Z"
            animate={{ fill: color.hex }}
            transition={{ duration: 0.55, ease: "easeInOut" }}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
          {/* neckline */}
          <path
            d="M150 48 C150 74 210 74 210 48"
            fill="none"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth={3}
          />
          {/* fabric sheen overlay, sits above the color fill */}
          <path
            d="M108 46 L60 78 L18 150 L54 182 L84 156 L84 420 L276 420 L276 156 L306 182 L342 150 L300 78 L252 46
               C252 46 234 74 180 74 C126 74 108 46 108 46 Z"
            fill="url(#fabricShade)"
          />

          {/* Print placement overlay */}
          <AnimatePresence>
            {printOn && (
              <motion.g
                key={`${printType}-${printPosition}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: showingBack ? 0.45 : 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                <rect
                  x={180 - printBox.w / 2}
                  y={printY}
                  width={printBox.w}
                  height={printBox.h}
                  rx={6}
                  fill="rgba(0,240,255,0.08)"
                  stroke="#00F0FF"
                  strokeDasharray="4 5"
                  strokeWidth={1.5}
                />
                {selectedDesign ? (
                  <image
                    href={selectedDesign.thumbnail}
                    x={180 - printBox.w / 2 + 8}
                    y={printY + 8}
                    width={printBox.w - 16}
                    height={printBox.h - 16}
                    preserveAspectRatio="xMidYMid meet"
                  />
                ) : (
                  <text
                    x={180}
                    y={printY + printBox.h / 2}
                    textAnchor="middle"
                    fill="#00F0FF"
                    fontSize="11"
                    opacity={0.75}
                  >
                    Select a design
                  </text>
                )}
                {customText.trim() && (
                  <text
                    x={180}
                    y={printY + printBox.h + 20}
                    textAnchor="middle"
                    fill={color.printTone === "dark" ? "#12141C" : "#F2EFE9"}
                    fontSize="13"
                    fontWeight={600}
                  >
                    {customText.trim().slice(0, 24)}
                  </text>
                )}
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {showingBack && (
          <span className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full border border-[#00F0FF]/40 bg-[#0C0E14]/80 px-3 py-1 text-[11px] uppercase tracking-wide text-[#00F0FF]">
            Back view
          </span>
        )}
      </div>
    </div>
  );
}
