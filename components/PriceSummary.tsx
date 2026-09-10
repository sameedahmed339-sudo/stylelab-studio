"use client";

import { motion } from "framer-motion";
import { calculatePricing, formatPKR, KARACHI_DELIVERY_FEE } from "@/lib/pricing";
import { PrintType } from "@/lib/types";

interface PriceSummaryProps {
  printType: PrintType;
}

export default function PriceSummary({ printType }: PriceSummaryProps) {
  const pricing = calculatePricing(printType);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#12141C] p-5">
      <h3 className="mb-4 text-sm font-medium text-[#E7E5E0]">Order summary</h3>

      <div className="space-y-2 text-sm text-[#B8BBC2]">
        <Row label="Base tee (240 GSM)" value={formatPKR(pricing.basePrice)} />
        <Row label="Print" value={pricing.printPrice === 0 ? "—" : formatPKR(pricing.printPrice)} />
        <Row label="Karachi delivery" value={formatPKR(KARACHI_DELIVERY_FEE)} />
      </div>

      <div className="my-4 h-px bg-white/10" />

      <div className="flex items-baseline justify-between">
        <span className="text-sm text-[#B8BBC2]">Total price</span>
        <motion.span
          key={pricing.total}
          initial={{ opacity: 0.4, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="text-2xl font-semibold text-[#F2EFE9]"
        >
          {formatPKR(pricing.total)}
        </motion.span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-[#00F0FF]/30 bg-[#00F0FF]/5 px-3 py-3">
          <div className="text-[11px] uppercase tracking-wide text-[#00F0FF]/80">Advance (50% + delivery)</div>
          <div className="mt-1 text-base font-semibold text-[#00F0FF]">{formatPKR(pricing.advance)}</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-[#0C0E14] px-3 py-3">
          <div className="text-[11px] uppercase tracking-wide text-[#7A7E86]">COD on delivery</div>
          <div className="mt-1 text-base font-semibold text-[#E7E5E0]">{formatPKR(pricing.codBalance)}</div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="text-[#E7E5E0]">{value}</span>
    </div>
  );
}
