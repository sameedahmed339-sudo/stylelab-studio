"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import ModelStudio from "@/components/ModelStudio";
import ColorSwatches from "@/components/ColorSwatches";
import SizeChips from "@/components/SizeChips";
import PrintOptions from "@/components/PrintOptions";
import PrintsCatalog from "@/components/PrintsCatalog";
import PriceSummary from "@/components/PriceSummary";
import WhatsAppButton from "@/components/WhatsAppButton";
import VibeQuizModal from "@/components/VibeQuizModal";
import { TEE_COLORS } from "@/lib/pricing";
import { CustomizerState, PrintItem, PrintPosition, PrintType, Size, TeeColor } from "@/lib/types";
import { ZodiacMatchResult } from "@/lib/zodiac";

export default function Home() {
  const [selectedColor, setSelectedColor] = useState<TeeColor>(TEE_COLORS[0]);
  const [selectedSize, setSelectedSize] = useState<Size>("M");
  const [printSize, setPrintSize] = useState<PrintType>("none");
  const [printPosition, setPrintPosition] = useState<PrintPosition | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<PrintItem | null>(null);
  const [customTextOrLogo, setCustomTextOrLogo] = useState("");
  const [quizOpen, setQuizOpen] = useState(false);
  const [zodiacResult, setZodiacResult] = useState<ZodiacMatchResult | null>(null);

  function handlePrintTypeChange(type: PrintType) {
    setPrintSize(type);
    if (type === "none") {
      setPrintPosition(null);
      setSelectedDesign(null);
      setCustomTextOrLogo("");
    } else if (!printPosition) {
      setPrintPosition("front");
    }
  }

  /**
   * Picking a catalog design is the source of truth for print size: its
   * `price` (300/400) maps straight onto the A4/A3 tiers already defined
   * in lib/pricing.ts, so the charged amount can never drift from what
   * the catalog card advertises. Manually switching Print Type after
   * this still works — it just re-syncs which size box is drawn.
   */
  function handleSelectPrint(item: PrintItem) {
    setSelectedDesign(item);
    setPrintSize(item.price >= 400 ? "a3" : "a4");
    if (!printPosition) setPrintPosition("front");
  }

  function handleClearPrint() {
    setSelectedDesign(null);
  }

  /** Quiz result: turn print on (if it isn't) and pre-select the top match. */
  function handleApplyZodiacResult(result: ZodiacMatchResult) {
    setZodiacResult(result);
    const topPrint = result.scoredPrints.find((p) => p.score > 0)?.print;
    if (topPrint) handleSelectPrint(topPrint);
  }

  const customizerState: CustomizerState = {
    color: selectedColor,
    size: selectedSize,
    printType: printSize,
    printPosition,
    selectedDesign,
    customText: customTextOrLogo,
  };

  return (
    <main className="min-h-screen bg-[#090A0F] text-[#E7E5E0]">
      <header className="border-b border-white/5 px-6 py-5 sm:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <p className="text-[11px] tracking-wide text-[#7A7E86]">StyleLab Studio</p>
            <h1 className="text-lg font-semibold text-[#F2EFE9] sm:text-xl">
              Drop-Shoulder Boxy Silhouette Tee
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={() => setQuizOpen(true)}
              className="flex items-center gap-1.5 rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/5 px-3 py-1.5 text-[11px] font-medium text-[#00F0FF] transition-colors hover:bg-[#00F0FF]/10"
            >
              <Sparkles size={12} /> Vibe &amp; Zodiac Matcher
            </motion.button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-8 px-6 pb-28 pt-8 sm:px-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:pb-16">
        {/* Studio preview */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="sticky top-6 h-[480px] self-start overflow-hidden rounded-3xl border border-white/5 sm:h-[600px] lg:h-[680px]"
        >
          <ModelStudio
            color={selectedColor}
            printType={printSize}
            printPosition={printPosition}
            selectedDesign={selectedDesign}
            customText={customTextOrLogo}
          />
        </motion.section>

        {/* Controls */}
        <section className="space-y-8">
          <div>
            <p className="text-sm text-[#7A7E86]">Premium Heavyweight Cut &amp; Sew Boxy Silhouette Blank</p>
            <p className="mt-1 text-2xl font-semibold text-[#F2EFE9]">PKR 1,200</p>
          </div>

          <ColorSwatches selected={selectedColor} onSelect={setSelectedColor} />
          <SizeChips selected={selectedSize} onSelect={setSelectedSize} />
          <PrintOptions
            printType={printSize}
            printPosition={printPosition}
            customText={customTextOrLogo}
            onPrintTypeChange={handlePrintTypeChange}
            onPositionChange={setPrintPosition}
            onCustomTextChange={setCustomTextOrLogo}
          />

          {printSize !== "none" && (
            <PrintsCatalog
              selected={selectedDesign}
              onSelect={handleSelectPrint}
              onClear={handleClearPrint}
              zodiacResult={zodiacResult}
            />
          )}

          <PriceSummary printType={printSize} />

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <WhatsAppButton state={customizerState} />
          </div>
        </section>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 border-t border-white/10 bg-[#090A0F]/95 p-4 backdrop-blur lg:hidden">
        <WhatsAppButton state={customizerState} />
      </div>

      <VibeQuizModal
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onApplyResult={handleApplyZodiacResult}
      />
    </main>
  );
}
