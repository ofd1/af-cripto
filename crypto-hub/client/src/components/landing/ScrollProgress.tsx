import { useScrollProgress } from '@/hooks/useScrollProgress';

export function ScrollProgress() {
  const progress = useScrollProgress();

  return (
    <>
      {/* Horizontal top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-secondary/30">
        <div
          className="h-full bg-gradient-to-r from-primary via-yellow-400 to-primary transition-[width] duration-150 will-change-[width]"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      {/* Vertical side indicator */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col items-center gap-2">
        {[0, 1, 2, 3, 4].map((i) => {
          const sectionProgress = i / 4;
          const isActive = progress >= sectionProgress - 0.05;
          return (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-primary scale-125 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                  : 'bg-muted-foreground/30'
              }`}
            />
          );
        })}
      </div>
    </>
  );
}
