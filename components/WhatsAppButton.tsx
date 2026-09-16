"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { CustomizerState } from "@/lib/types";
import { buildWhatsAppOrderUrl } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  state: CustomizerState;
}

export default function WhatsAppButton({ state }: WhatsAppButtonProps) {
  function handleCheckout() {
    const url = buildWhatsAppOrderUrl(state);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <motion.button
      type="button"
      onClick={handleCheckout}
      whileTap={{ scale: 0.98 }}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
    >
      <MessageCircle size={17} />
      Confirm &amp; order via WhatsApp
    </motion.button>
  );
}
