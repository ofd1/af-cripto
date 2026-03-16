import { AnimatedSection } from './AnimatedSection';

const timelineItems = [
  {
    time: 'Manhã',
    title: 'Coleta de Dados',
    description: 'RSS feeds, newsletters e APIs de preço são processados automaticamente.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    time: 'Processamento',
    title: 'Análise por IA',
    description: 'Notícias são classificadas, tagueadas e resumidas por inteligência artificial.',
    color: 'from-primary to-yellow-400',
  },
  {
    time: 'Entrega',
    title: 'Dashboard & Alertas',
    description: 'Dados organizados no dashboard. Alertas de preço enviados por email.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    time: 'Noite',
    title: 'Newsletter & Resumo',
    description: 'Briefing executivo do dia enviado aos assinantes com análise completa.',
    color: 'from-purple-500 to-pink-500',
  },
];

export function TimelineSection() {
  return (
    <section className="relative min-h-screen flex items-center py-20 landing-section">
      <div className="max-w-4xl mx-auto px-6 w-full">
        <AnimatedSection className="text-center mb-16">
          <span className="text-primary text-sm font-mono uppercase tracking-widest">Capítulo 03</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
            Como <span className="text-gradient">funciona</span>
          </h2>
        </AnimatedSection>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

          {timelineItems.map((item, i) => (
            <AnimatedSection
              key={item.title}
              animation={i % 2 === 0 ? 'fade-right' : 'fade-left'}
              delay={i * 150}
            >
              <div className={`relative flex items-start gap-8 mb-12 ${
                i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              }`}>
                {/* Dot */}
                <div className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full bg-primary -translate-x-1.5 mt-2 shadow-[0_0_10px_rgba(245,158,11,0.5)] z-10" />

                {/* Content */}
                <div className={`ml-14 md:ml-0 md:w-1/2 ${i % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                  <span className={`inline-block text-xs font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r ${item.color} text-white mb-3`}>
                    {item.time}
                  </span>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
