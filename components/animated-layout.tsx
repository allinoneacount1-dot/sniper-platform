"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    filter: "blur(8px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    filter: "blur(8px)",
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function AnimatedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="relative">
      {/* Global background glow orbs */}
      <div className="backdrop-glow">
        <div
          className="glow-orb violet"
          style={{
            width: 600,
            height: 600,
            top: "-10%",
            left: "-10%",
            animationDelay: "0s",
          }}
        />
        <div
          className="glow-orb indigo"
          style={{
            width: 500,
            height: 500,
            top: "30%",
            right: "-10%",
            animationDelay: "2s",
          }}
        />
        <div
          className="glow-orb cyan"
          style={{
            width: 400,
            height: 400,
            bottom: "10%",
            left: "30%",
            animationDelay: "4s",
          }}
        />
      </div>

      {/* Page transition wrapper */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative z-10"
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
