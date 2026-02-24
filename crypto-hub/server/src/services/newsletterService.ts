import pool from '../db/index';
import { sendEmail } from './emailService';

export type NewsletterFrequency = 'daily' | 'weekly';

export interface NewsletterEdition {
  id: number;
  title: string;
  content_html: string;
  content_markdown: string;
  edition_date: string;
  sent_count: number;
  created_at: string;
}

interface SubscriberRow {
  id: number;
  email: string;
  unsubscribe_token: string;
}

interface ParsedSection {
  title: string;
  icon: string;
  items: ParsedItem[];
}

interface ParsedItem {
  date: string;
  title: string;
  details: Array<{ label: string; value: string }>;
  sources: string[];
}

const STATIC_NEWSLETTER_CONTENT = `Executive Briefing – Tech & Digital Assets (17-24/02/2026)

## 📊 SEÇÃO 1: M&A, ECM E CAPITAL DE RISCO EM TECH (Últimos 7 dias)
23/02/2026 | Real Asset Acquisition Corp (SPAC) anuncia acordo definitivo com IQM Quantum Computers
Deal Size & Valuation: Valuation pré-money ~US$1,8 bilhão
Strategic Rationale: Primeira listagem nos EUA de empresa europeia de quantum computing; capta capital para acelerar rota a fault-tolerance e escala comercial.
Fonte: Reuters

22/02/2026 | Khosla Ventures lidera Série A de US$17,5M (R$100M) na HRtech brasileira Comp
Deal Size & Valuation: US$17,5M; valuation ND
Strategic Rationale: Primeira entrada da Khosla no Brasil (via Keith Rabois); financia expansão EUA e transformação AI-native completa de RH (clientes Nubank/iFood, +400% growth 2025).
Fonte: Pipeline (Valor) / Brazil Journal

20/02/2026 | Brasil TecPar adquire operações de fibra da Ligga Telecom
Deal Size & Valuation: R$495M + assunção de dívida ~R$1,28B (EV total ~R$1,7B)
Strategic Rationale: Consolidação acelerada no broadband brasileiro; expansão de rede fibra e base de clientes no Sul.
Fonte: Pipeline (Valor)

20/02/2026 | Nvidia aproxima-se de aporte estratégico de US$30B na OpenAI
Deal Size & Valuation: US$30B (parte de rodada >US$100B a valuation ~US$830-850B post-money)
Strategic Rationale: Parceria profunda de infra IA para suportar escalada de demanda por chips Nvidia em meio à corrida frontier models.
Fonte: NeoFeed / Valor Econômico / FT

## 🌐 SEÇÃO 2: PANORAMA CORPORATIVO E ESTRATÉGICO TECH (Últimos 7 dias)
23/02/2026 | OpenAI estima queima extra de US$111B em capex, breakeven só em 2030
O Fato: Capex/training total US$665B nos próximos 5 anos (+111B vs plano anterior); receita 2025 US$13,1B (esperado dobrar em 2026); rodada em curso e possível IPO H2/26 a ~US$1T.
Impacto: Reforça intensidade extrema de capital na IA generativa; pressiona valuations de pure-plays AI e força mega-rounds/parcerias com Big Tech.

23/02/2026 | OpenAI forma "Frontier Alliance" com McKinsey, Accenture, BCG e Capgemini
O Fato: Parceria formal para ajudar clientes enterprise a implementar agentes IA na plataforma Frontier.
Impacto: Acelera GTM enterprise, fortalece moat B2B e consolida ecossistema em torno da stack OpenAI vs concorrentes.

23/02/2026 | Big Techs projetam US$650B coletivos em capex de IA para 2026
O Fato: Alphabet + Amazon + Meta + Microsoft somam ~US$650B em infraestrutura IA (vs US$410B em 2025).
Impacto: Sinaliza fase "mais perigosa" do ciclo com maior alavancagem externa; risco para buybacks, margens e valuations tech.

23/02/2026 | M&A em tecnologia cai 20% no início de 2026
O Fato: Fim do ciclo recorde por selloff em ações de software/tech e valuations instáveis.
Impacto: Reduz exits para VC, desacelera consolidação e contrai pipeline de deals.

24/02/2026 | Ações SaaS/software em forte selloff por disrupção IA
O Fato: Queda acentuada (ex.: Salesforce -30% YTD) com maior escrutínio de crédito e custos de dívida.
Impacto: Aumenta volatilidade de múltiplos; diferencia players com moats defensáveis vs aqueles expostos a agentes IA.

## ₿ SEÇÃO 3: CRYPTO E ATIVOS DIGITAIS — VISÃO INSTITUCIONAL (Últimos 7 dias)
23/02/2026 | Crypto.com recebe aprovação condicional OCC para national trust bank charter
O Fato: Charter federal permite custódia regulada e settlement de trades para clientes institucionais.
Impacto: Avanço concreto na ponte TradFi-crypto; atrai alocações institucionais maiores em ambiente regulado.

19/02/2026 | SEC atualiza haircut de stablecoins para 2% em capital de broker-dealers
O Fato: Stablecoins qualificadas passam a tratamento próximo ao caixa nas regras de net capital.
Impacto: Reduz barreira de capital; facilita holding e uso institucional de stablecoins como instrumento de tesouraria/liquidez.

19-23/02/2026 | Presidente da SEC Atkins sinaliza framework para tokenização e isenções de inovação
O Fato: Avanço em regras de custódia non-security crypto, trading on-chain de tokenized securities e modernização regulatória.
Impacto: Clareza regulatória acelera RWA tokenization e integração institucional de blockchain.

23/02/2026 | Bitwise adquire Chorus One (staking infrastructure)
O Fato: Bitwise ($15B AUM) compra plataforma com >US$2,2B staked em 30+ redes PoS.
Impacto: Expande oferta institucional de yield on-chain multichain; consolida liderança em soluções custody/yield para TradFi.

24/02/2026 | Coinbase lança trading 24/5 de ações e ETFs para todos usuários US
O Fato: Expansão além de crypto nativo via integração com plataformas tradicionais.
Impacto: Diversificação de receita e posicionamento como broker full-service para clientes institucionais.`;

const SOURCE_LINKS: Record<string, string> = {
  reuters: 'https://www.reuters.com',
  'pipeline (valor)': 'https://valor.globo.com/valor-pipeline/',
  'brazil journal': 'https://braziljournal.com',
  neofeed: 'https://neofeed.com.br',
  'valor economico': 'https://valor.globo.com',
  ft: 'https://www.ft.com',
  mckinsey: 'https://www.mckinsey.com',
  accenture: 'https://www.accenture.com',
  bcg: 'https://www.bcg.com',
  capgemini: 'https://www.capgemini.com',
  occ: 'https://www.occ.treas.gov',
  sec: 'https://www.sec.gov',
  coinbase: 'https://www.coinbase.com',
  bitwise: 'https://bitwiseinvestments.com',
};

export function getStaticNewsletterContent(): string {
  return STATIC_NEWSLETTER_CONTENT;
}

export async function getLatestEdition(): Promise<NewsletterEdition | null> {
  const result = await pool.query<NewsletterEdition>(
    `SELECT id, title, content_html, content_markdown, edition_date, sent_count, created_at
     FROM newsletter_editions
     ORDER BY edition_date DESC, created_at DESC
     LIMIT 1`
  );
  return result.rows[0] || null;
}

export async function sendNewsletter(frequency: NewsletterFrequency): Promise<{
  frequency: NewsletterFrequency;
  total: number;
  sent: number;
  failed: number;
}> {
  const subscribersResult = await pool.query<SubscriberRow>(
    `SELECT id, email, unsubscribe_token
     FROM newsletter_subscribers
     WHERE is_active = true
       AND frequency = $1`,
    [frequency]
  );

  const total = subscribersResult.rows.length;
  if (total === 0) {
    return { frequency, total: 0, sent: 0, failed: 0 };
  }

  const edition = await getLatestEdition();
  const markdown = edition?.content_markdown || getStaticNewsletterContent();
  const subject = `📬 ${edition?.title || 'CryptoHub Newsletter - Executive Briefing'}`;

  let sent = 0;
  let failed = 0;

  for (const subscriber of subscribersResult.rows) {
    try {
      const html = buildNewsletterHTML(markdown, subscriber.unsubscribe_token);
      await sendEmail({
        to: subscriber.email,
        subject,
        html,
      });
      sent++;
    } catch (err) {
      failed++;
      console.error(`[NEWSLETTER] Send error for ${subscriber.email}:`, err);
    }
  }

  if (edition?.id && sent > 0) {
    await pool.query(
      `UPDATE newsletter_editions
       SET sent_count = sent_count + $1
       WHERE id = $2`,
      [sent, edition.id]
    );
  }

  return { frequency, total, sent, failed };
}

export function buildNewsletterHTML(content: string, unsubscribeToken: string): string {
  const parsed = parseNewsletterContent(content);
  const appUrl = (process.env.APP_URL || 'https://cryptohub.app').replace(/\/+$/, '');
  const unsubscribeLink = unsubscribeToken
    ? `${appUrl}/api/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`
    : '#';
  const sentAt = new Date().toISOString().slice(0, 10);

  const sectionsHtml = parsed.sections.map((section) => {
    const itemsHtml = section.items.map((item) => {
      const details = item.details.map((detail) => (
        `<div style="margin-top:10px;padding:10px;border-radius:10px;background:#111827;border:1px solid #334155;">
          <div style="display:inline-block;padding:3px 8px;border-radius:999px;background:#f59e0b;color:#111827;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.3px;">${escapeHtml(detail.label)}</div>
          <p style="margin:8px 0 0 0;color:#e2e8f0;font-size:14px;line-height:1.6;">${escapeHtml(detail.value)}</p>
        </div>`
      )).join('');

      const sourceBadges = item.sources.map((source) => {
        const url = getSourceUrl(source);
        return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin:6px 6px 0 0;padding:5px 10px;border-radius:999px;background:#1f2937;border:1px solid #475569;color:#fbbf24;text-decoration:none;font-size:12px;font-weight:600;">📰 ${escapeHtml(source)}</a>`;
      }).join('');

      return `
        <div style="margin-top:14px;padding:16px;border-radius:14px;background:#0f172a;border:1px solid #334155;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
            <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:#f59e0b1a;border:1px solid #f59e0b55;color:#fbbf24;font-size:12px;font-weight:700;">📅 ${escapeHtml(item.date)}</span>
          </div>
          <h3 style="margin:12px 0 0 0;color:#f8fafc;font-size:18px;line-height:1.35;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(item.title)}</h3>
          ${details}
          ${sourceBadges ? `<div style="margin-top:10px;">${sourceBadges}</div>` : ''}
        </div>
      `;
    }).join('');

    return `
      <section style="margin-top:22px;">
        <div style="background:#1e293b;border:1px solid #334155;border-radius:16px;padding:18px;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
            <span style="font-size:20px;">${escapeHtml(section.icon)}</span>
            <h2 style="margin:0;color:#fbbf24;font-size:16px;line-height:1.4;text-transform:uppercase;letter-spacing:0.4px;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(section.title)}</h2>
          </div>
          <div style="height:2px;background:linear-gradient(90deg,#f59e0b,#fbbf24,#f59e0b);border-radius:999px;opacity:0.85;"></div>
          ${itemsHtml}
        </div>
      </section>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(parsed.title)}</title>
</head>
<body style="margin:0;padding:0;background:#020617;font-family:Arial,Helvetica,sans-serif;color:#e2e8f0;">
  <div style="width:100%;padding:24px 12px;box-sizing:border-box;background:#020617;">
    <div style="max-width:600px;margin:0 auto;">
      <header style="background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:18px;padding:22px 20px;text-align:center;box-shadow:0 14px 32px rgba(245,158,11,0.2);">
        <div style="display:inline-block;padding:6px 12px;border-radius:999px;background:#11182755;border:1px solid #1e293b;color:#fff;font-weight:700;font-size:12px;">₿ CryptoHub Newsletter</div>
        <h1 style="margin:12px 0 0 0;color:#fff;font-size:24px;line-height:1.25;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(parsed.title)}</h1>
        <p style="margin:8px 0 0 0;color:#fff;font-size:13px;opacity:0.95;">Briefing executivo com os principais movimentos em Tech e ativos digitais</p>
      </header>

      ${sectionsHtml}

      <footer style="margin-top:24px;background:#111827;border:1px solid #334155;border-radius:16px;padding:18px;text-align:center;">
        <p style="margin:0;color:#94a3b8;font-size:12px;">Edição enviada em <strong style="color:#fbbf24;">${escapeHtml(sentAt)}</strong></p>
        <a href="${unsubscribeLink}" style="display:inline-block;margin-top:12px;padding:10px 16px;border-radius:10px;background:#f59e0b;color:#111827;text-decoration:none;font-size:13px;font-weight:700;">
          Cancelar inscrição
        </a>
        <p style="margin:12px 0 0 0;color:#64748b;font-size:12px;">CryptoHub — Cripto & Startups</p>
      </footer>
    </div>
  </div>
</body>
</html>`;
}

function parseNewsletterContent(content: string): { title: string; sections: ParsedSection[] } {
  const normalized = content.replace(/\r\n/g, '\n');
  const lines = normalized.split('\n');
  const title = (lines.find((line) => line.trim()) || 'CryptoHub Newsletter').trim();
  const sections: ParsedSection[] = [];

  let i = 0;
  while (i < lines.length) {
    const match = lines[i].trim().match(/^##\s+(.+)$/);
    if (!match) {
      i++;
      continue;
    }

    const sectionTitle = match[1].trim();
    const sectionLines: string[] = [];
    i++;

    while (i < lines.length && !lines[i].trim().startsWith('## ')) {
      sectionLines.push(lines[i]);
      i++;
    }

    sections.push(parseSection(sectionTitle, sectionLines));
  }

  if (sections.length === 0) {
    return {
      title,
      sections: [
        {
          title: '📰 Destaques',
          icon: '📰',
          items: [
            {
              date: new Date().toISOString().slice(0, 10),
              title,
              details: [{ label: 'Resumo', value: normalized.trim() }],
              sources: [],
            },
          ],
        },
      ],
    };
  }

  return { title, sections };
}

function parseSection(sectionTitle: string, sectionLines: string[]): ParsedSection {
  const itemStartPattern = /^(\d{2}(?:-\d{2})?\/\d{2}\/\d{4})\s*\|\s*(.+)$/;
  const iconMatch = sectionTitle.match(/^([^\s]+)/);
  const icon = iconMatch ? iconMatch[1] : '📰';
  const items: ParsedItem[] = [];
  let current: ParsedItem | null = null;

  for (const rawLine of sectionLines) {
    const line = rawLine.trim();
    if (!line) continue;

    const itemMatch = line.match(itemStartPattern);
    if (itemMatch) {
      if (current) items.push(current);
      current = {
        date: itemMatch[1],
        title: itemMatch[2].trim(),
        details: [],
        sources: [],
      };
      continue;
    }

    if (!current) continue;

    const sourceMatch = line.match(/^Fonte:\s*(.+)$/i);
    if (sourceMatch) {
      current.sources = sourceMatch[1]
        .split('/')
        .map((source) => source.trim())
        .filter(Boolean);
      continue;
    }

    const detailMatch = line.match(/^([^:]+):\s*(.+)$/);
    if (detailMatch) {
      current.details.push({
        label: detailMatch[1].trim(),
        value: detailMatch[2].trim(),
      });
      continue;
    }

    if (current.details.length > 0) {
      const lastDetail = current.details[current.details.length - 1];
      lastDetail.value = `${lastDetail.value} ${line}`.trim();
    } else {
      current.details.push({ label: 'Resumo', value: line });
    }
  }

  if (current) items.push(current);

  return {
    title: sectionTitle,
    icon,
    items,
  };
}

function getSourceUrl(source: string): string {
  const normalized = source
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .trim();

  return SOURCE_LINKS[normalized] || `https://www.google.com/search?q=${encodeURIComponent(source)}`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
