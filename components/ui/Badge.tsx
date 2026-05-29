// components/ui/Badge.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border',
  {
    variants: {
      variant: {
        default: 'bg-gray-800 text-gray-300 border-gray-700',
        success: 'bg-green-500/15 text-green-400 border-green-500/30',
        warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
        danger: 'bg-red-500/15 text-red-400 border-red-500/30',
        info: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
        purple: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export function Badge({ className, variant, ...props }: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
