"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useToastStore } from "@/store/toastStore";
import { cn } from "@/lib/cn";

export function ToastHost() {
  const open = useToastStore((s) => s.open);
  const message = useToastStore((s) => s.message);
  const tone = useToastStore((s) => s.tone);

  const toneClass =
    tone === "success"
      ? "border-mint text-mint shadow-glow-mint"
      : tone === "danger"
        ? "border-danger text-danger shadow-[0_0_12px_#FF2D5566]"
        : "border-border text-[#E8E8E0]";

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "fixed right-4 bottom-4 z-[100] max-w-[420px]",
            "bg-surface border-2 rounded-card px-4 py-3 font-mono text-[13px]",
            toneClass
          )}
        >
          <div className="font-display text-[12px] tracking-[0.15em] uppercase">
            SYSTEM MESSAGE
          </div>
          <div className="mt-1 text-[#E8E8E0]">{message}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

