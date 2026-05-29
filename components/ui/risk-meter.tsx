"use client";
import { motion } from "framer-motion";

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
  const heights: Record<string, string> = { sm: "h-1.5", md: "h-2.5", lg: "h-4" };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-gray-400">Risk</span>
        <span className="text-[10px] font-bold">{score}/100</span>
      </div>
      <div className={`w-full rounded-full bg-white/5 overflow-hidden ${heights[size]}`}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${gradeColors[grade] || gradeColors["?"]}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        />
      </div>
    </div>
  );
}
