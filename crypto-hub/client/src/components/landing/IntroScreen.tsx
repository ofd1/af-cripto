import { useState } from 'react';
import { ParticleCanvas } from './ParticleCanvas';

interface IntroScreenProps {
  onEnter: () => void;
}

export function IntroScreen({ onEnter }: IntroScreenProps) {
  const [exiting, setExiting] = useState(false);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(onEnter, 800);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-all duration-700 ${
        exiting ? 'intro-exit' : ''
      }`}
    >
      <ParticleCanvas particleCount={80} />

      <div className={`relative z-10 text-center px-6 ${exiting ? 'animate-fade-up-out' : 'animate-fade-in'}`}>
        {/* Logo / Brand */}
        <div className="mb-8 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-yellow-400 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.3)] animate-float">
            <span className="text-4xl font-bold text-background">AF</span>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
          <span className="text-gradient">AF Cripto</span>
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto mb-10 animate-fade-in-delay">
          Inteligência em tempo real para o mercado cripto e startups
        </p>

        <button
          onClick={handleEnter}
          className="group relative px-8 py-4 rounded-xl font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 animate-fade-in-delay-2"
        >
          {/* Animated border */}
          <span className="absolute inset-0 rounded-xl border-2 border-primary/50 group-hover:border-primary transition-colors" />
          {/* Fill on hover */}
          <span className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 rounded-xl" />
          {/* Glow */}
          <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-[inset_0_0_20px_rgba(245,158,11,0.2)]" />
          <span className="relative text-foreground group-hover:text-primary transition-colors">
            Explorar
            <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
          </span>
        </button>

        {/* Scroll hint */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce-slow">
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-muted-foreground/50 animate-scroll-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}
