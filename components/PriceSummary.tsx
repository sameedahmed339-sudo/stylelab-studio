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
    <div>
      <div className="space-y-1.5 text-sm text-graphite">
        <Row label="Base tee (240 GSM)" value={formatPKR(pricing.basePrice)} />
        <Row label="Print" value={pricing.printPrice === 0 ? "—" : formatPKR(pricing.printPrice)} />
        <Row label="Karachi delivery" value={formatPKR(KARACHI_DELIVERY_FEE)} />
      </div>

      <div className="my-5 h-px bg-line" />

      <div className="flex items-baseline justify-between">
        <span className="text-sm text-graphite">Total</span>
        <motion.span
          key={pricing.total}
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="text-3xl text-ink"
        >
          {formatPKR(pricing.total)}
        </motion.span>
      </div>

      <div className="mt-4 flex items-baseline justify-between text-sm">
        <span className="text-graphite">Advance now (50% + delivery)</span>
        <span className="text-brass">{formatPKR(pricing.advance)}</span>
      </div>
      <div className="mt-1 flex items-baseline justify-between text-sm">
        <span className="text-graphite">COD on delivery</span>
        <span className="text-ink">{formatPKR(pricing.codBalance)}</span>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}
