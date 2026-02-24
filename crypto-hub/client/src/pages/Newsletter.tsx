import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CalendarDays, CheckCircle, Mail, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { newsletterApi } from '@/lib/api';

interface NewsletterEdition {
  title: string;
  content_markdown: string;
  content_html: string;
  edition_date: string;
}

export function Newsletter() {
  const [edition, setEdition] = useState<NewsletterEdition | null>(null);
  const [staticContent, setStaticContent] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(true);

  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('weekly');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const data = await newsletterApi.getLatest();
        setEdition(data.edition);
        setStaticContent(data.static_content || '');
      } catch (err) {
        console.error('Failed to fetch newsletter preview:', err);
      } finally {
        setLoadingPreview(false);
      }
    };

    fetchLatest();
  }, []);

  const previewTitle = useMemo(() => {
    return edition?.title || 'Executive Briefing - Tech & Digital Assets (17-24/02/2026)';
  }, [edition]);

  const previewContent = useMemo(() => {
    return edition?.content_markdown || staticContent;
  }, [edition, staticContent]);

  const previewDate = useMemo(() => {
    if (edition?.edition_date) {
      return new Date(edition.edition_date).toLocaleDateString('pt-BR');
    }
    return '24/02/2026';
  }, [edition]);

  const handleSubscribe = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Digite um email válido');
      return;
    }

    setSubmitting(true);
    try {
      const result = await newsletterApi.subscribe({ email, frequency });
      setSuccess(result.message);
      setEmail('');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Newsletter</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Acompanhe o Executive Briefing com os principais movimentos em Tech e Crypto.
        </p>
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <CardHeader className="space-y-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-base sm:text-lg">{previewTitle}</CardTitle>
            <Badge variant="outline" className="border-primary/40 text-primary">
              <CalendarDays className="w-3.5 h-3.5 mr-1" />
              {previewDate}
            </Badge>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary">📊 M&A</Badge>
            <Badge variant="secondary">🌐 Corporate</Badge>
            <Badge variant="secondary">₿ Crypto</Badge>
          </div>
        </CardHeader>
        <CardContent>
          {loadingPreview ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          ) : previewContent ? (
            <div className="rounded-xl border border-border bg-background/30 p-4">
              <MarkdownRenderer content={previewContent} />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma edição disponível.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Receba nossa Newsletter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Frequência</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFrequency('daily')}
                  className={`rounded-lg border p-3 text-sm font-medium transition-all ${
                    frequency === 'daily'
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-border/80'
                  }`}
                >
                  Diária
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('weekly')}
                  className={`rounded-lg border p-3 text-sm font-medium transition-all ${
                    frequency === 'weekly'
                      ? 'border-primary/50 bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-border/80'
                  }`}
                >
                  Semanal
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-md">
                {error}
              </p>
            )}

            {success && (
              <p className="text-sm text-green-400 bg-green-400/10 px-3 py-2 rounded-md flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {success}
              </p>
            )}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Inscrevendo...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Inscrever-se
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
