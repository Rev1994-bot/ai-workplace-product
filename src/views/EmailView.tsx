import { useState } from 'react';
import { Mail, Sparkles, RotateCcw } from 'lucide-react';
import { PageHeader, Disclaimer, LoadingDots, ShimmerBlock, EmptyState, CopyButton } from '@/components/Shell';
import { ai, type Tone, type EmailOutput } from '@/lib/ai';

const TONES: { id: Tone; label: string }[] = [
  { id: 'professional', label: 'Professional' },
  { id: 'friendly', label: 'Friendly' },
  { id: 'persuasive', label: 'Persuasive' },
  { id: 'apologetic', label: 'Apologetic' },
  { id: 'urgent', label: 'Urgent' },
];

const PRESETS = [
  { topic: 'Project kickoff invitation', audience: 'Cross-functional team', tone: 'professional' as Tone, goal: 'Invite the team to a kickoff meeting next week' },
  { topic: 'Q3 budget approval request', audience: 'Finance director', tone: 'persuasive' as Tone, goal: 'Request approval for the Q3 marketing budget' },
  { topic: 'Delayed shipment notice', audience: 'Valued customer', tone: 'apologetic' as Tone, goal: 'Inform about a shipment delay and offer a resolution' },
];

export function EmailView() {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState<Tone>('professional');
  const [goal, setGoal] = useState('');
  const [senderName, setSenderName] = useState('Alex Kim');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<EmailOutput | null>(null);

  const canGenerate = topic.trim().length > 0 && audience.trim().length > 0;

  async function handleGenerate() {
    if (!canGenerate) return;
    setLoading(true);
    setOutput(null);
    const result = await ai.email({ topic, audience, tone, goal, senderName });
    setOutput(result);
    setLoading(false);
  }

  function applyPreset(p: (typeof PRESETS)[number]) {
    setTopic(p.topic);
    setAudience(p.audience);
    setTone(p.tone);
    setGoal(p.goal);
  }

  function reset() {
    setTopic('');
    setAudience('');
    setGoal('');
    setOutput(null);
  }

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Smart Email Generator"
        subtitle="Draft professional emails tuned by tone, audience, and goal."
        icon={Mail}
        accent="bg-brand-50 text-brand-600"
      >
        <button className="btn-outline text-sm px-3.5 py-2" onClick={reset}>
          <RotateCcw size={15} /> Reset
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5">
            <div className="space-y-4">
              <div>
                <label className="label">Topic or subject</label>
                <input
                  className="input"
                  placeholder="e.g. Product launch timeline update"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Audience</label>
                <input
                  className="input"
                  placeholder="e.g. Engineering team, Client, Director"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Tone</label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      className={`chip transition-all ${
                        tone === t.id
                          ? 'bg-ink-900 text-white'
                          : 'bg-ink-100 text-ink-600 hover:bg-ink-200'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Goal (optional)</label>
                <textarea
                  className="input min-h-[72px] resize-y"
                  placeholder="What should the email achieve?"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Your name</label>
                <input
                  className="input"
                  placeholder="Sign-off name"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                />
              </div>
              <button
                className="btn-accent w-full py-2.5"
                disabled={!canGenerate || loading}
                onClick={handleGenerate}
              >
                <Sparkles size={16} /> {loading ? 'Generating…' : 'Generate email'}
              </button>
              {!canGenerate && (
                <p className="text-xs text-ink-400 text-center">Add a topic and audience to begin.</p>
              )}
            </div>
          </div>

          <div className="card p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-3">
              Quick presets
            </div>
            <div className="space-y-2">
              {PRESETS.map((p) => (
                <button
                  key={p.topic}
                  onClick={() => applyPreset(p)}
                  className="w-full text-left px-3 py-2.5 rounded-xl border border-ink-100 hover:border-brand-300 hover:bg-brand-50/50 transition group"
                >
                  <div className="text-sm font-medium text-ink-800 group-hover:text-brand-700">{p.topic}</div>
                  <div className="text-xs text-ink-400 mt-0.5 capitalize">{p.tone} · {p.audience}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-3">
          <div className="card p-6 min-h-[420px]">
            {loading ? (
              <div className="space-y-4">
                <LoadingDots label="Crafting your email…" />
                <ShimmerBlock lines={6} />
              </div>
            ) : output ? (
              <div className="animate-fade-up space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="chip bg-brand-50 text-brand-700 capitalize">{tone}</span>
                    <span className="chip bg-ink-100 text-ink-500">{output.wordCount} words</span>
                  </div>
                  <CopyButton text={`${output.subject}\n\n${output.body}`} label="Copy email" />
                </div>
                <div className="border-b border-ink-100 pb-4">
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-1">Subject</div>
                  <div className="font-display font-semibold text-ink-900 text-lg">{output.subject}</div>
                  <div className="text-sm text-ink-500 mt-2">{output.preview}</div>
                </div>
                <pre className="whitespace-pre-wrap font-sans text-sm text-ink-700 leading-relaxed">
{output.body}
                </pre>
              </div>
            ) : (
              <EmptyState
                icon={Mail}
                title="Your email will appear here"
                desc="Fill in the topic, audience, and tone — then generate a polished draft ready to send."
              />
            )}
          </div>
          <Disclaimer className="mt-4" />
        </div>
      </div>
    </div>
  );
}
