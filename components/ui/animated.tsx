"use client";
// @ts-nocheck — framer-motion HTML element type conflicts with React 19 types
import { motion, AnimatePresence } from "framer-motion";
import { useState, type ReactNode, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ─── Animated Button ───────────────────────────────────────────────
interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  loading?: boolean;
  glow?: boolean;
}

export function AnimatedButton({
  variant = "primary",
  size = "md",
  children,
  loading,
  glow,
  className,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const base =
    "relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 overflow-hidden cursor-pointer select-none";
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };
  const variants = {
    primary:
      "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40",
    secondary:
      "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/20",
    ghost:
      "bg-transparent text-gray-300 hover:text-white hover:bg-white/5",
    danger:
      "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40",
  };

// @ts-nocheck — framer-motion HTML element types conflict with React 19 types
  return (
    <motion.button
      className={cn(base, sizes[size], variants[variant], disabled && "opacity-50 pointer-events-none", className)}
      whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -1 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: "spring" as const, stiffness: 400, damping: 17 }}
      disabled={disabled || loading}
      {...props}
    >
      {glow && (
        <motion.span
          className="absolute inset-0 bg-gradient-to-r from-violet-400/30 to-indigo-400/30 blur-xl"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center gap-2"
          >
            <motion.span
              className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
            Loading...
          </motion.span>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="relative z-10"
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ─── Glass Card ────────────────────────────────────────────────────
interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

export function GlassCard({ children, className, hover = true, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      className={cn(
        "relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl",
        "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
        "transition-shadow duration-300",
        hover && "hover:shadow-[0_8px_32px_rgba(139,92,246,0.15)] hover:border-violet-500/20",
        className
      )}
    >
      {/* Glow effect on hover */}
      {hover && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/5 to-indigo-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

// ─── Animated Number Counter ───────────────────────────────────────
interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  "className"?: string;
}

export function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0, className }: AnimatedNumberProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      key={value}
      transition={{ duration: 0.3 }}
    >
      {prefix}{value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </motion.span>
  );
}

// ─── Pulse Dot ─────────────────────────────────────────────────────
interface PulseDotProps {
  color?: "green" | "red" | "yellow" | "violet";
  size?: "sm" | "md";
  label?: string;
}

export function PulseDot({ color = "green", size = "sm", label }: PulseDotProps) {
  const colors = {
    green: "bg-emerald-400 shadow-emerald-400/50",
    red: "bg-red-400 shadow-red-400/50",
    yellow: "bg-yellow-400 shadow-yellow-400/50",
    violet: "bg-violet-400 shadow-violet-400/50",
  };
  const sizes = { sm: "w-2 h-2", md: "w-3 h-3" };

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex">
        <motion.span
          className={cn("rounded-full", sizes[size], colors[color])}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span className={cn("absolute inset-0 rounded-full animate-ping", colors[color].split(" ")[0], "opacity-30")} />
      </span>
      {label && <span className="text-xs text-gray-400">{label}</span>}
    </span>
  );
}

// ─── Shimmer Skeleton ──────────────────────────────────────────────
interface ShimmerProps {
  className?: string;
  rounded?: boolean;
}

export function Shimmer({ className, rounded = true }: ShimmerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-white/5",
        rounded ? "rounded-xl" : "rounded",
        className
      )}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

// ─── Stagger Container ─────────────────────────────────────────────
interface StaggerProps {
  children: ReactNode;
  className?: string;
  delayStep?: number;
}

export function Stagger({ children, className, delayStep = 0.08 }: StaggerProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: delayStep } },
      }}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// ─── Floating Orbs Background ──────────────────────────────────────
export function FloatingOrbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: `${200 + i * 100}px`,
            height: `${200 + i * 100}px`,
            background: i % 2 === 0
              ? "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)",
            left: `${10 + i * 20}%`,
            top: `${15 + i * 15}%`,
          }}
          animate={{
            x: [0, 30 + i * 10, -20, 0],
            y: [0, -20, 30 + i * 5, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}

// ─── Badge ─────────────────────────────────────────────────────────
interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  animate?: boolean;
}

export function Badge({ children, variant = "default", animate = true }: BadgeProps) {
  const variants = {
    default: "bg-white/10 text-gray-300 border-white/10",
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    warning: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    danger: "bg-red-500/15 text-red-400 border-red-500/20",
    info: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  };

  const Wrapper = animate ? motion.div : "div";
  const animateProps = animate
    ? { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, transition: { type: "spring" as const as const, stiffness: 500, damping: 20 } }
    : {};

  return (
    <Wrapper
      {...animateProps}
      className={cn("inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border", variants[variant])}
    >
      {children}
    </Wrapper>
  );
}

// ─── Meter / Progress Bar ──────────────────────────────────────────
interface RiskMeterProps {
  score: number;
  grade: string;
  size?: "sm" | "md" | "lg";
}

export function RiskMeter({ score, grade, size = "md" }: RiskMeterProps) {
  const gradeColors: Record<string, string> = {
    A: "from-emerald-500 to-emerald-400",
    B: "from-lime-500 to-lime-400",
    C: "from-yellow-500 to-yellow-400",
    D: "from-orange-500 to-orange-400",
    F: "from-red-500 to-red-400",
    "?": "from-gray-500 to-gray-400",
  };
  const gradeGlow: Record<string, string> = {
    A: "shadow-emerald-500/30",
    B: "shadow-lime-500/30",
    C: "shadow-yellow-500/30",
    D: "shadow-orange-500/30",
    F: "shadow-red-500/30",
    "?": "shadow-gray-500/30",
  };
  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">Risk Score</span>
        <span className="text-xs font-bold">{score}/100</span>
      </div>
      <div className={cn("w-full rounded-full bg-white/5 overflow-hidden", heights[size])}>
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r shadow-lg", gradeColors[grade] || gradeColors["?"], gradeGlow[grade] || gradeGlow["?"])}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}
