"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

  function handleSelectPrint(item: PrintItem) {
    setSelectedDesign(item);
    setPrintSize(item.price >= 400 ? "a3" : "a4");
    if (!printPosition) setPrintPosition("front");
  }

  function handleClearPrint() {
    setSelectedDesign(null);
  }

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
    <main className="min-h-screen bg-canvas text-ink">
      {/* slim nav — brand mark left, quiz entry right, no eyebrow chrome */}
      <nav className="flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="text-sm tracking-tight text-ink">StyleLab Studio</span>
        <button
          type="button"
          onClick={() => setQuizOpen(true)}
          className="text-sm text-graphite transition-colors hover:text-brass"
        >
          Vibe &amp; Zodiac Matcher
        </button>
      </nav>

      <div className="grid lg:grid-cols-2">
        {/* Photo stage — light paper panel, full bleed, sticky on desktop */}
        <div className="lg:sticky lg:top-0 lg:h-screen">
          <ModelStudio
            color={selectedColor}
            printType={printSize}
            printPosition={printPosition}
            selectedDesign={selectedDesign}
            customText={customTextOrLogo}
          />
        </div>

        {/* Product & controls — dark canvas panel */}
        <div className="px-6 pb-32 pt-10 sm:px-10 lg:px-16 lg:pb-16 lg:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <h1 className="max-w-md text-4xl leading-[1.05] text-ink sm:text-5xl">
              Drop-Shoulder Boxy Silhouette Tee
            </h1>
            <p className="mt-3 max-w-sm text-sm text-graphite">
              Premium heavyweight cut &amp; sew boxy silhouette blank, 240 GSM.
            </p>
            <p className="mt-6 text-4xl text-ink">PKR 1,200</p>
          </motion.div>

          <div className="my-8 h-px bg-line" />

          <div className="space-y-8">
            <ColorSwatches selected={selectedColor} onSelect={setSelectedColor} />
            <SizeChips selected={selectedSize} onSelect={setSelectedSize} />
          </div>

          <div className="my-8 h-px bg-line" />

          <PrintOptions
            printType={printSize}
            printPosition={printPosition}
            customText={customTextOrLogo}
            onPrintTypeChange={handlePrintTypeChange}
            onPositionChange={setPrintPosition}
            onCustomTextChange={setCustomTextOrLogo}
          />

          {printSize !== "none" && (
            <>
              <div className="my-8 h-px bg-line" />
              <PrintsCatalog
                selected={selectedDesign}
                onSelect={handleSelectPrint}
                onClear={handleClearPrint}
                zodiacResult={zodiacResult}
              />
            </>
          )}

          <div className="my-8 h-px bg-line" />

          <PriceSummary printType={printSize} />

          <div className="mt-8 hidden lg:block">
            <WhatsAppButton state={customizerState} />
          </div>
        </div>
      </div>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 border-t border-line bg-canvas/95 p-4 backdrop-blur lg:hidden">
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
