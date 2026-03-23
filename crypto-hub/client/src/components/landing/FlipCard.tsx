import { cn } from '@/lib/utils';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}

export function FlipCard({ front, back, className }: FlipCardProps) {
  return (
    <div className={cn('group perspective-1000 h-64', className)}>
      <div className="relative w-full h-full transition-transform duration-500 transform-style-3d group-hover:rotate-y-180">
        {/* Front */}
        <div className="absolute inset-0 backface-hidden rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center">
          {front}
        </div>
        {/* Back */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl border border-primary/30 bg-gradient-to-br from-card to-primary/10 p-6 flex flex-col items-center justify-center">
          {back}
        </div>
      </div>
    </div>
  );
}
