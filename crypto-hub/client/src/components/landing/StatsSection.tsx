import { TrendingUp, BarChart3, Zap, Globe } from 'lucide-react';
import { AnimatedCounter } from './AnimatedCounter';
import { AnimatedSection } from './AnimatedSection';

export function StatsSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 landing-section bg-gradient-section-1">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <AnimatedSection className="text-center mb-16">
          <span className="text-primary text-sm font-mono uppercase tracking-widest">Capítulo 01</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
            Números que <span className="text-gradient">importam</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Dados do mercado cripto atualizados em tempo real para suas decisões
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <AnimatedSection delay={0}>
            <AnimatedCounter
              end={24}
              suffix="h"
              label="Monitoramento"
              icon={<Zap className="w-8 h-8" />}
            />
          </AnimatedSection>
          <AnimatedSection delay={100}>
            <AnimatedCounter
              end={500}
              suffix="+"
              label="Fontes de dados"
              icon={<Globe className="w-8 h-8" />}
            />
          </AnimatedSection>
          <AnimatedSection delay={200}>
            <AnimatedCounter
              end={15}
              label="Tags rastreadas"
              icon={<BarChart3 className="w-8 h-8" />}
            />
          </AnimatedSection>
          <AnimatedSection delay={300}>
            <AnimatedCounter
              end={99.9}
              decimals={1}
              suffix="%"
              label="Uptime"
              icon={<TrendingUp className="w-8 h-8" />}
            />
          </AnimatedSection>
        </div>

        {/* Decorative line */}
        <AnimatedSection delay={400} className="mt-20">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </AnimatedSection>
      </div>
    </section>
  );
}
