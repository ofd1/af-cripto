import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-left' | 'fade-right' | 'scale';
  delay?: number;
}

export function AnimatedSection({
  children,
  className,
  animation = 'fade-up',
  delay = 0,
}: AnimatedSectionProps) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  const animationClasses: Record<string, string> = {
    'fade-up': 'translate-y-12 opacity-0',
    'fade-left': '-translate-x-12 opacity-0',
    'fade-right': 'translate-x-12 opacity-0',
    'scale': 'scale-90 opacity-0',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out will-change-transform',
        isVisible ? 'translate-y-0 translate-x-0 scale-100 opacity-100' : animationClasses[animation],
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
