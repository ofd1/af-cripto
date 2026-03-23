import { useState } from 'react';
import { IntroScreen } from '@/components/landing/IntroScreen';
import { ScrollProgress } from '@/components/landing/ScrollProgress';
import { HeroSection } from '@/components/landing/HeroSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { TimelineSection } from '@/components/landing/TimelineSection';
import { CTASection } from '@/components/landing/CTASection';

export function LandingPage() {
  const [showIntro, setShowIntro] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  const handleEnter = () => {
    setShowIntro(false);
    // Small delay so the exit animation finishes before content fades in
    setTimeout(() => setContentReady(true), 100);
  };

  return (
    <>
      {showIntro && <IntroScreen onEnter={handleEnter} />}

      <div className={`transition-opacity duration-700 ${contentReady ? 'opacity-100' : 'opacity-0'}`}>
        <ScrollProgress />
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <TimelineSection />
        <CTASection />

        {/* Footer */}
        <footer className="border-t border-border py-8 px-6 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} AF Cripto &middot; Inteligência para o mercado cripto
          </p>
        </footer>
      </div>
    </>
  );
}
