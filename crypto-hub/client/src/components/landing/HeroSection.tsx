import { useMousePosition } from '@/hooks/useMousePosition';
import { ParticleCanvas } from './ParticleCanvas';
import { AnimatedSection } from './AnimatedSection';

export function HeroSection() {
  const mouse = useMousePosition();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden landing-section">
      <ParticleCanvas className="opacity-40" particleCount={50} />

      {/* Gradient orbs that follow mouse subtly */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none will-change-transform"
        style={{
          transform: `translate(${mouse.normalizedX * 30}px, ${mouse.normalizedY * 30}px)`,
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none will-change-transform"
        style={{
          transform: `translate(${mouse.normalizedX * -20}px, ${mouse.normalizedY * -20}px)`,
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <AnimatedSection animation="fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Mercado ao vivo
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="text-foreground">O futuro do</span>
            <br />
            <span className="text-gradient">mercado cripto</span>
          </h1>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={200}>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Análises em tempo real com IA, alertas de preço, notícias curadas
            e insights exclusivos sobre cripto e startups
          </p>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={300}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/news"
              className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-lg hover:bg-primary/90 transition-all hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105 active:scale-95"
            >
              Ver Notícias
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
            </a>
            <a
              href="/chat"
              className="px-8 py-4 border border-border rounded-xl font-semibold text-lg hover:bg-secondary/50 transition-all hover:border-primary/30 hover:scale-105 active:scale-95"
            >
              Chat com IA
            </a>
          </div>
        </AnimatedSection>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-muted-foreground">
          <path d="M7 13L12 18L17 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <path d="M7 7L12 12L17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
        </svg>
      </div>
    </section>
  );
}
