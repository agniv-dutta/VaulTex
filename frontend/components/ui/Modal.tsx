"use client";

import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Close modal"
            className="fixed inset-0 z-[90] bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={cn(
              "fixed left-1/2 top-1/2 z-[100] w-[min(720px,calc(100vw-32px))]",
              "-translate-x-1/2 -translate-y-1/2",
              "bg-surface border-2 border-border rounded-card p-5"
            )}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {title ? (
              <div className="font-display text-[14px] tracking-[0.15em] uppercase text-accent">
                {title}
              </div>
            ) : null}
            <div className={cn(title ? "mt-3" : "")}>{children}</div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}

