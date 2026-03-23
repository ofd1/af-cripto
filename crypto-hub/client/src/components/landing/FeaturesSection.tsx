import { Bot, Bell, Newspaper, LineChart, Mail, Shield } from 'lucide-react';
import { FlipCard } from './FlipCard';
import { AnimatedSection } from './AnimatedSection';

const features = [
  {
    icon: <Bot className="w-10 h-10 text-primary" />,
    title: 'Chat com IA',
    description: 'Converse com IA treinada em dados do mercado cripto. Pergunte sobre tendências, análises e muito mais.',
  },
  {
    icon: <LineChart className="w-10 h-10 text-primary" />,
    title: 'Preço em Tempo Real',
    description: 'Acompanhe Bitcoin e altcoins com gráficos interativos e histórico detalhado de preços.',
  },
  {
    icon: <Newspaper className="w-10 h-10 text-primary" />,
    title: 'Notícias Curadas',
    description: 'Agregador inteligente com RSS e newsletters, organizado por tags e resumido por IA.',
  },
  {
    icon: <Bell className="w-10 h-10 text-primary" />,
    title: 'Alertas de Preço',
    description: 'Configure alertas por e-mail para quando o BTC atingir o preço desejado.',
  },
  {
    icon: <Mail className="w-10 h-10 text-primary" />,
    title: 'Newsletter',
    description: 'Receba um briefing executivo diário ou semanal sobre cripto e startups.',
  },
  {
    icon: <Shield className="w-10 h-10 text-primary" />,
    title: 'Resumo IA Diário',
    description: 'Análise automatizada das notícias do dia gerada por inteligência artificial.',
  },
];

export function FeaturesSection() {
  return (
    <section className="relative min-h-screen flex items-center py-20 landing-section bg-gradient-section-2">
      <div className="max-w-6xl mx-auto px-6 w-full">
        <AnimatedSection className="text-center mb-16">
          <span className="text-primary text-sm font-mono uppercase tracking-widest">Capítulo 02</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-4">
            Ferramentas <span className="text-gradient">poderosas</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Tudo que você precisa para se manter à frente no mercado
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <AnimatedSection key={feature.title} delay={i * 80}>
              <FlipCard
                front={
                  <>
                    {feature.icon}
                    <h3 className="text-lg font-semibold mt-4">{feature.title}</h3>
                  </>
                }
                back={
                  <>
                    {feature.icon}
                    <p className="text-sm text-muted-foreground mt-3 text-center leading-relaxed">
                      {feature.description}
                    </p>
                  </>
                }
              />
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
