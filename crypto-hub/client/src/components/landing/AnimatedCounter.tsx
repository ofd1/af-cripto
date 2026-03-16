import { useCountUp } from '@/hooks/useCountUp';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface AnimatedCounterProps {
  end: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
  duration?: number;
  icon?: React.ReactNode;
}

export function AnimatedCounter({
  end,
  decimals = 0,
  prefix = '',
  suffix = '',
  label,
  duration = 2000,
  icon,
}: AnimatedCounterProps) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.3 });
  const { formatted } = useCountUp({
    end,
    decimals,
    prefix,
    suffix,
    duration,
    enabled: isVisible,
  });

  return (
    <div ref={ref} className="text-center">
      {icon && <div className="text-primary mb-3 flex justify-center">{icon}</div>}
      <div className="font-mono text-4xl md:text-5xl font-bold text-gradient mb-2">
        {formatted}
      </div>
      <div className="text-muted-foreground text-sm uppercase tracking-wider">{label}</div>
    </div>
  );
}
