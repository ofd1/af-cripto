import { Router, Request, Response } from 'express';
import { randomBytes } from 'crypto';
import pool from '../db/index';
import {
  buildNewsletterHTML,
  getLatestEdition,
  getStaticNewsletterContent,
  NewsletterFrequency,
  sendNewsletter,
} from '../services/newsletterService';

const router = Router();

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidFrequency(value: string): value is NewsletterFrequency {
  return value === 'daily' || value === 'weekly';
}

router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const frequency = String(req.body?.frequency || 'weekly').trim().toLowerCase();

    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Valid email is required' });
      return;
    }

    if (!isValidFrequency(frequency)) {
      res.status(400).json({ error: 'frequency must be "daily" or "weekly"' });
      return;
    }

    const unsubscribeToken = randomBytes(32).toString('hex');

    await pool.query(
      `INSERT INTO newsletter_subscribers (email, frequency, unsubscribe_token, is_active, confirmed_at)
       VALUES ($1, $2, $3, true, NOW())
       ON CONFLICT (email)
       DO UPDATE SET
         frequency = EXCLUDED.frequency,
         unsubscribe_token = EXCLUDED.unsubscribe_token,
         is_active = true,
         confirmed_at = COALESCE(newsletter_subscribers.confirmed_at, NOW())`,
      [email, frequency, unsubscribeToken]
    );

    res.status(201).json({ message: 'Inscrição realizada com sucesso' });
  } catch (err) {
    console.error('[NEWSLETTER] Subscribe error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/unsubscribe', async (req: Request, res: Response) => {
  try {
    const token = String(req.query.token || '').trim();

    if (!token) {
      res.status(400).send(renderUnsubscribePage(false, 'Token inválido.'));
      return;
    }

    const result = await pool.query(
      `UPDATE newsletter_subscribers
       SET is_active = false
       WHERE unsubscribe_token = $1
       RETURNING email`,
      [token]
    );

    if (result.rowCount === 0) {
      res.status(404).send(renderUnsubscribePage(false, 'Assinatura não encontrada ou já cancelada.'));
      return;
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(renderUnsubscribePage(true, `O email ${result.rows[0].email} foi removido da newsletter.`));
  } catch (err) {
    console.error('[NEWSLETTER] Unsubscribe error:', err);
    res.status(500).send(renderUnsubscribePage(false, 'Erro ao processar cancelamento.'));
  }
});

router.get('/latest', async (_req: Request, res: Response) => {
  try {
    const edition = await getLatestEdition();

    if (edition) {
      res.json({ edition });
      return;
    }

    const staticContent = getStaticNewsletterContent();
    res.json({
      edition: null,
      static_content: staticContent,
      static_html: buildNewsletterHTML(staticContent, ''),
    });
  } catch (err) {
    console.error('[NEWSLETTER] Latest error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/send', async (req: Request, res: Response) => {
  try {
    const frequencyRaw = req.body?.frequency;

    if (frequencyRaw !== undefined && !isValidFrequency(String(frequencyRaw))) {
      res.status(400).json({ error: 'frequency must be "daily" or "weekly"' });
      return;
    }

    const frequencies: NewsletterFrequency[] = frequencyRaw
      ? [String(frequencyRaw) as NewsletterFrequency]
      : ['daily', 'weekly'];

    const results = [];
    for (const frequency of frequencies) {
      results.push(await sendNewsletter(frequency));
    }

    const total = results.reduce((acc, item) => acc + item.total, 0);
    const sent = results.reduce((acc, item) => acc + item.sent, 0);
    const failed = results.reduce((acc, item) => acc + item.failed, 0);

    res.json({
      message: 'Newsletter enviada',
      total,
      sent,
      failed,
      results,
    });
  } catch (err) {
    console.error('[NEWSLETTER] Send error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT
         COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE is_active = true)::int AS active,
         COUNT(*) FILTER (WHERE is_active = true AND frequency = 'daily')::int AS daily,
         COUNT(*) FILTER (WHERE is_active = true AND frequency = 'weekly')::int AS weekly
       FROM newsletter_subscribers`
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error('[NEWSLETTER] Stats error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function renderUnsubscribePage(success: boolean, message: string): string {
  const title = success ? 'Inscrição cancelada' : 'Não foi possível cancelar';
  const subtitle = success ? 'Você não receberá novos envios.' : 'Tente novamente mais tarde.';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:24px;background:#020617;font-family:Arial,Helvetica,sans-serif;color:#e2e8f0;">
  <div style="max-width:560px;margin:0 auto;background:#1e293b;border:1px solid #334155;border-radius:14px;padding:24px;text-align:center;">
    <div style="font-size:42px;line-height:1;">${success ? '✅' : '⚠️'}</div>
    <h1 style="margin:12px 0 4px 0;color:#f8fafc;font-size:24px;">${title}</h1>
    <p style="margin:0;color:#94a3b8;font-size:14px;">${subtitle}</p>
    <p style="margin:14px 0 0 0;color:#e2e8f0;font-size:14px;line-height:1.6;">${message}</p>
    <p style="margin:20px 0 0 0;color:#64748b;font-size:12px;">CryptoHub — Cripto & Startups</p>
  </div>
</body>
</html>`;
}

export default router;
