import { useMousePosition } from '@/hooks/useMousePosition';
import { AnimatedSection } from './AnimatedSection';

export function CTASection() {
  const mouse = useMousePosition();

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center py-20 landing-section overflow-hidden">
      {/* Animated gradient background */}
      <div
        className="absolute w-[800px] h-[800px] rounded-full bg-primary/10 blur-[150px] pointer-events-none will-change-transform"
        style={{
          transform: `translate(${mouse.normalizedX * 40}px, ${mouse.normalizedY * 40}px)`,
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <AnimatedSection>
          <span className="text-primary text-sm font-mono uppercase tracking-widest">Capítulo 04</span>
          <h2 className="text-4xl md:text-6xl font-bold mt-4 mb-6">
            Pronto para <span className="text-gradient">começar</span>?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
            Acesse o dashboard completo com dados em tempo real, análises de IA
            e todas as ferramentas que você precisa.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <a
            href="/"
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-primary to-yellow-500 text-primary-foreground rounded-2xl font-bold text-xl hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Acessar Dashboard
            <span className="inline-block transition-transform group-hover:translate-x-2">→</span>
          </a>
        </AnimatedSection>

        <AnimatedSection delay={400}>
          <p className="text-muted-foreground/50 text-sm mt-8">
            Dados atualizados 24/7 &middot; IA integrada &middot; Sem limites
          </p>
        </AnimatedSection>
      </div>
    </section>
  );
}
