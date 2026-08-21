import { useState } from 'react';
import { Telescope, Sparkles, BookOpen, Lightbulb, MessageCircle, RotateCcw } from 'lucide-react';
import { PageHeader, Disclaimer, LoadingDots, ShimmerBlock, EmptyState, CopyButton } from '@/components/Shell';
import { ai, type ResearchOutput } from '@/lib/ai';

const DEPTHS = [
  { id: 'brief' as const, label: 'Brief', desc: 'Quick overview' },
  { id: 'standard' as const, label: 'Standard', desc: 'Balanced depth' },
  { id: 'deep' as const, label: 'Deep', desc: 'Comprehensive' },
];

const SUGGESTED = [
  'Remote work productivity trends',
  'Agile vs. Waterfall methodologies',
  'Generative AI in the workplace',
  'Employee retention strategies',
];

export function ResearchView() {
  const [topic, setTopic] = useState('');
  const [depth, setDepth] = useState<'brief' | 'standard' | 'deep'>('standard');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<ResearchOutput | null>(null);

  async function handleRun(t?: string) {
    const query = (t ?? topic).trim();
    if (!query) return;
    if (t) setTopic(t);
    setLoading(true);
    setOutput(null);
    const result = await ai.research({ topic: query, depth });
    setOutput(result);
    setLoading(false);
  }

  function reset() {
    setTopic('');
    setOutput(null);
  }

  const copyText = output
    ? `Overview\n${output.overview}\n\nInsights\n${output.insights.map((i) => `• ${i.title}: ${i.detail}`).join('\n')}\n\nKey Terms\n${output.keyTerms.map((k) => `• ${k.term}: ${k.definition}`).join('\n')}\n\nSummary\n${output.summary}\n\nFollow-up\n${output.followUp.map((f) => `• ${f}`).join('\n')}`
    : '';

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="AI Research Assistant"
        subtitle="Get structured overviews, insights, and key terms on any topic."
        icon={Telescope}
        accent="bg-ink-100 text-ink-700"
      >
        <button className="btn-outline text-sm px-3.5 py-2" onClick={reset}>
          <RotateCcw size={15} /> Reset
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Input */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5 space-y-4">
            <div>
              <label className="label">Research topic</label>
              <input
                className="input"
                placeholder="e.g. Async communication best practices"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRun()}
              />
            </div>
            <div>
              <label className="label">Depth</label>
              <div className="grid grid-cols-3 gap-2">
                {DEPTHS.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDepth(d.id)}
                    className={`px-3 py-2.5 rounded-xl border text-center transition ${
                      depth === d.id
                        ? 'border-ink-900 bg-ink-900 text-white'
                        : 'border-ink-200 text-ink-600 hover:border-ink-300'
                    }`}
                  >
                    <div className="text-sm font-medium">{d.label}</div>
                    <div className={`text-[11px] mt-0.5 ${depth === d.id ? 'text-ink-300' : 'text-ink-400'}`}>
                      {d.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <button
              className="btn-accent w-full py-2.5"
              disabled={!topic.trim() || loading}
              onClick={() => handleRun()}
            >
              <Sparkles size={16} /> {loading ? 'Researching…' : 'Research topic'}
            </button>
          </div>

          <div className="card p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-3">
              Suggested topics
            </div>
            <div className="space-y-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => handleRun(s)}
                  className="w-full text-left px-3 py-2.5 rounded-xl border border-ink-100 hover:border-brand-300 hover:bg-brand-50/50 transition text-sm font-medium text-ink-700 hover:text-brand-700"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-3">
          <div className="card p-6 min-h-[480px]">
            {loading ? (
              <div className="space-y-5">
                <LoadingDots label="Gathering insights…" />
                <ShimmerBlock lines={3} />
                <div className="h-px bg-ink-100" />
                <ShimmerBlock lines={4} />
              </div>
            ) : output ? (
              <div className="animate-fade-up space-y-6">
                <div className="flex items-center justify-between">
                  <span className="chip bg-ink-100 text-ink-600 capitalize">{depth} analysis</span>
                  <CopyButton text={copyText} label="Copy report" />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={15} className="text-ink-400" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">Overview</h3>
                  </div>
                  <p className="text-sm text-ink-700 leading-relaxed">{output.overview}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb size={15} className="text-warn-500" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">Key insights</h3>
                  </div>
                  <div className="space-y-3">
                    {output.insights.map((ins, i) => (
                      <div key={i} className="rounded-xl border border-ink-100 p-4">
                        <div className="text-sm font-semibold text-ink-900">{ins.title}</div>
                        <p className="text-sm text-ink-600 mt-1 leading-relaxed">{ins.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-3">Key terms</h3>
                  <div className="space-y-2">
                    {output.keyTerms.map((k) => (
                      <div key={k.term} className="flex gap-3 text-sm">
                        <span className="font-semibold text-brand-700 shrink-0">{k.term}</span>
                        <span className="text-ink-500">— {k.definition}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-ink-900 text-white p-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-300 mb-2">Summary</h3>
                  <p className="text-sm leading-relaxed">{output.summary}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle size={15} className="text-brand-500" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">Follow-up questions</h3>
                  </div>
                  <div className="space-y-2">
                    {output.followUp.map((f, i) => (
                      <button
                        key={i}
                        onClick={() => handleRun(f)}
                        className="block w-full text-left px-3 py-2 rounded-lg text-sm text-ink-600 hover:bg-brand-50 hover:text-brand-700 transition"
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                icon={Telescope}
                title="Your research report will appear here"
                desc="Enter a topic, choose a depth, and get a structured overview with insights, key terms, and follow-up questions."
              />
            )}
          </div>
          <Disclaimer className="mt-4" />
        </div>
      </div>
    </div>
  );
}
