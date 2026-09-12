"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X, ArrowRight, ArrowLeft } from "lucide-react";
import {
  ELEMENT_GROUPS,
  getSign,
  matchZodiacToPrints,
  ZodiacMatchResult,
} from "@/lib/zodiac";
import { PrintCategory, ZodiacSignId } from "@/lib/types";
import { printsCatalog } from "@/lib/prints-catalog";

interface VibeQuizModalProps {
  open: boolean;
  onClose: () => void;
  onApplyResult: (result: ZodiacMatchResult) => void;
}

const ENERGY_OPTIONS: { label: string; category: PrintCategory }[] = [
  { label: "Bold & intense", category: "Dark & Edgy" },
  { label: "Calm & disciplined", category: "Mindset & Stoic" },
  { label: "Witty & social", category: "Desi Humor" },
  { label: "Quiet & understated", category: "Minimalist" },
];

const FEEL_OPTIONS: { label: string; category: PrintCategory }[] = [
  { label: "Respected", category: "Mindset & Stoic" },
  { label: "A little intimidated", category: "Dark & Edgy" },
  { label: "Amused", category: "Desi Humor" },
  { label: "Effortlessly put-together", category: "Minimalist" },
];

type Step = 0 | 1 | 2 | 3;

export default function VibeQuizModal({ open, onClose, onApplyResult }: VibeQuizModalProps) {
  const [step, setStep] = useState<Step>(0);
  const [sign, setSign] = useState<ZodiacSignId | null>(null);
  const [energyCategory, setEnergyCategory] = useState<PrintCategory | null>(null);
  const [feelCategory, setFeelCategory] = useState<PrintCategory | null>(null);
  const [result, setResult] = useState<ZodiacMatchResult | null>(null);

  function reset() {
    setStep(0);
    setSign(null);
    setEnergyCategory(null);
    setFeelCategory(null);
    setResult(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  function computeResult(finalFeel: PrintCategory) {
    if (!sign || !energyCategory) return;
    const r = matchZodiacToPrints(
      { sign, energyCategory, feelCategory: finalFeel },
      printsCatalog
    );
    setResult(r);
    setStep(3);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#12141C] shadow-[0_0_60px_rgba(0,240,255,0.15)]"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#00F0FF]" />
                <h2 className="text-sm font-semibold text-[#F2EFE9]">Vibe &amp; Zodiac Matcher</h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-[#7A7E86] transition-colors hover:text-[#F2EFE9]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
              {step === 0 && (
                <div>
                  <p className="mb-4 text-sm text-[#B8BBC2]">Step 1 of 3 — what's your zodiac sign?</p>
                  <div className="space-y-4">
                    {ELEMENT_GROUPS.map((group) => (
                      <div key={group.element}>
                        <p className="mb-2 text-[11px] uppercase tracking-wide text-[#7A7E86]">
                          {group.element}
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {group.signs.map((signId) => {
                            const s = getSign(signId);
                            const active = sign === signId;
                            return (
                              <motion.button
                                key={signId}
                                type="button"
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSign(signId)}
                                className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 transition-colors duration-200 ${
                                  active
                                    ? "border-[#00F0FF] bg-[#00F0FF]/10 shadow-[0_0_14px_rgba(0,240,255,0.3)]"
                                    : "border-white/10 bg-[#0C0E14] hover:border-white/25"
                                }`}
                              >
                                <span className={`text-lg ${active ? "text-[#00F0FF]" : "text-[#E7E5E0]"}`}>
                                  {s.symbol}
                                </span>
                                <span className="text-[10px] text-[#B8BBC2]">{s.id}</span>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    disabled={!sign}
                    onClick={() => setStep(1)}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#00F0FF] px-4 py-3 text-sm font-semibold text-[#090A0F] transition-opacity disabled:opacity-30"
                  >
                    Next <ArrowRight size={15} />
                  </button>
                </div>
              )}

              {step === 1 && sign && (
                <div>
                  <p className="mb-1 text-sm text-[#B8BBC2]">Step 2 of 3</p>
                  <p className="mb-4 text-base font-medium text-[#F2EFE9]">
                    {getSign(sign).symbol} What's your everyday energy?
                  </p>
                  <div className="space-y-2">
                    {ENERGY_OPTIONS.map((opt) => (
                      <motion.button
                        key={opt.label}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setEnergyCategory(opt.category);
                          setStep(2);
                        }}
                        className="w-full rounded-xl border border-white/10 bg-[#0C0E14] px-4 py-3 text-left text-sm text-[#E7E5E0] transition-colors duration-200 hover:border-[#00F0FF] hover:bg-[#00F0FF]/5"
                      >
                        {opt.label}
                      </motion.button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(0)}
                    className="mt-4 flex items-center gap-1 text-xs text-[#7A7E86] hover:text-[#B8BBC2]"
                  >
                    <ArrowLeft size={13} /> Back
                  </button>
                </div>
              )}

              {step === 2 && sign && (
                <div>
                  <p className="mb-1 text-sm text-[#B8BBC2]">Step 3 of 3</p>
                  <p className="mb-4 text-base font-medium text-[#F2EFE9]">
                    How do you want people to feel when they see you?
                  </p>
                  <div className="space-y-2">
                    {FEEL_OPTIONS.map((opt) => (
                      <motion.button
                        key={opt.label}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setFeelCategory(opt.category);
                          computeResult(opt.category);
                        }}
                        className="w-full rounded-xl border border-white/10 bg-[#0C0E14] px-4 py-3 text-left text-sm text-[#E7E5E0] transition-colors duration-200 hover:border-[#00F0FF] hover:bg-[#00F0FF]/5"
                      >
                        {opt.label}
                      </motion.button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="mt-4 flex items-center gap-1 text-xs text-[#7A7E86] hover:text-[#B8BBC2]"
                  >
                    <ArrowLeft size={13} /> Back
                  </button>
                </div>
              )}

              {step === 3 && result && (
                <div>
                  <div className="mb-5 flex flex-col items-center text-center">
                    <span className="text-4xl">{result.sign.symbol}</span>
                    <h3 className="mt-2 text-lg font-semibold text-[#F2EFE9]">
                      {result.sign.id} · {result.sign.element}
                    </h3>
                    <p className="mt-1 text-xs text-[#7A7E86]">{result.sign.traits}</p>
                    <span className="mt-3 rounded-full border border-[#00F0FF]/40 bg-[#00F0FF]/10 px-3 py-1 text-[11px] text-[#00F0FF]">
                      Your vibe: {result.recommendedCategory}
                    </span>
                  </div>

                  <p className="mb-3 text-xs font-medium text-[#B8BBC2]">Recommended prints for you</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {result.scoredPrints.slice(0, 3).map(({ print }) => (
                      <div
                        key={print.id}
                        className="rounded-xl border border-[#00F0FF]/40 bg-[#00F0FF]/5 p-2 text-center"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={print.image}
                          alt={print.name}
                          className="mx-auto mb-1.5 aspect-square w-full rounded-lg bg-[#0C0E14] object-contain"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.visibility = "hidden";
                          }}
                        />
                        <span className="text-[10px] text-[#E7E5E0]">{print.name}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onApplyResult(result);
                      handleClose();
                    }}
                    className="mt-6 w-full rounded-xl bg-[#00F0FF] px-4 py-3 text-sm font-semibold text-[#090A0F]"
                  >
                    Show me these in the catalog
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-2 w-full rounded-xl border border-white/10 px-4 py-2.5 text-xs text-[#7A7E86] hover:text-[#B8BBC2]"
                  >
                    Retake quiz
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
