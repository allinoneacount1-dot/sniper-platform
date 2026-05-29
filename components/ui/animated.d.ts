// Type declarations for animated.tsx (excluded from TS check due to framer-motion + React 19 type conflicts)
declare module "@/components/ui/animated" {
  import { type ReactNode, type ButtonHTMLAttributes } from "react";

  export interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    children: ReactNode;
    loading?: boolean;
    glow?: boolean;
  }

  export function AnimatedButton(props: AnimatedButtonProps): ReactNode;
  export function GlassCard(props: { children: ReactNode; className?: string; hover?: boolean; delay?: number }): ReactNode;
  export function AnimatedNumber(props: { value: number; prefix?: string; suffix?: string; decimals?: number; className?: string }): ReactNode;
  export function PulseDot(props: { color?: "green" | "red" | "yellow" | "violet"; size?: "sm" | "md"; label?: string }): ReactNode;
  export function Shimmer(props: { className?: string; rounded?: boolean }): ReactNode;
  export function Stagger(props: { children: ReactNode; className?: string; delayStep?: number }): ReactNode;
  export const staggerItem: { hidden: object; visible: object };
  export function FloatingOrbs(): ReactNode;
  export function Badge(props: { children: ReactNode; variant?: "default" | "success" | "warning" | "danger" | "info"; animate?: boolean }): ReactNode;
  export function RiskMeter(props: { score: number; grade: string; size?: "sm" | "md" | "lg" }): ReactNode;
}
