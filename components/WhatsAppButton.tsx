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
    // Rebuild the entire order + pricing payload right here, right now —
    // never reuse a URL or total computed earlier in the session.
    const url = buildWhatsAppOrderUrl(state);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <motion.button
      type="button"
      onClick={handleCheckout}
      whileTap={{ scale: 0.97 }}
      whileHover={{ boxShadow: "0 0 32px rgba(0,240,255,0.55)" }}
      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00F0FF] px-6 py-4 text-sm font-semibold text-[#090A0F] shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-shadow duration-300"
    >
      <MessageCircle size={18} strokeWidth={2.5} />
      Confirm &amp; order via WhatsApp
    </motion.button>
  );
}
