import { useState } from 'react';
import { FileText, Sparkles, RotateCcw, CheckCircle2, Users, Gavel, ListTodo } from 'lucide-react';
import { PageHeader, Disclaimer, LoadingDots, ShimmerBlock, EmptyState, CopyButton } from '@/components/Shell';
import { ai, type MeetingOutput } from '@/lib/ai';

const SAMPLE = `The team met to discuss the Q3 product launch. Sarah updated that the beta is ready and we should schedule a rollout next week. Mark raised a concern about the onboarding flow being confusing for new users. We agreed to simplify the first-time experience before launch. David will prepare the marketing assets by Friday. The team decided to move the launch date to the 15th to allow time for fixes. We need to review the pricing page before sending the announcement. Action item: Sarah will send the beta feedback summary by Wednesday.`;

export function MeetingView() {
  const [title, setTitle] = useState('');
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<MeetingOutput | null>(null);

  const canRun = transcript.trim().length > 20;

  async function handleRun() {
    if (!canRun) return;
    setLoading(true);
    setOutput(null);
    const result = await ai.meeting({ transcript, meetingTitle: title });
    setOutput(result);
    setLoading(false);
  }

  function reset() {
    setTitle('');
    setTranscript('');
    setOutput(null);
  }

  function loadSample() {
    setTitle('Q3 Product Launch Sync');
    setTranscript(SAMPLE);
  }

  const copyText = output
    ? `Summary\n${output.summary}\n\nKey Points\n${output.keyPoints.map((p) => `• ${p}`).join('\n')}\n\nAction Items\n${output.actionItems.map((a) => `• ${a.task} — ${a.owner} (${a.deadline})`).join('\n')}\n\nDecisions\n${output.decisions.map((d) => `• ${d}`).join('\n')}`
    : '';

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Meeting Notes Summarizer"
        subtitle="Turn raw transcripts into key points, decisions, and action items."
        icon={FileText}
        accent="bg-accent-50 text-accent-600"
      >
        <button className="btn-outline text-sm px-3.5 py-2" onClick={loadSample}>
          Load sample
        </button>
        <button className="btn-outline text-sm px-3.5 py-2" onClick={reset}>
          <RotateCcw size={15} /> Reset
        </button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="card p-5 flex flex-col">
          <div className="space-y-4 mb-4">
            <div>
              <label className="label">Meeting title (optional)</label>
              <input
                className="input"
                placeholder="e.g. Weekly engineering sync"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Transcript or notes</label>
              <textarea
                className="input min-h-[280px] resize-y font-sans text-sm leading-relaxed"
                placeholder="Paste your meeting transcript, notes, or raw discussion text here…"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-auto">
            <button
              className="btn-accent w-full py-2.5"
              disabled={!canRun || loading}
              onClick={handleRun}
            >
              <Sparkles size={16} /> {loading ? 'Summarizing…' : 'Summarize meeting'}
            </button>
            {!canRun && <p className="text-xs text-ink-400 text-center mt-2">Paste at least a few sentences of notes.</p>}
          </div>
        </div>

        {/* Output */}
        <div className="card p-6 min-h-[420px]">
          {loading ? (
            <div className="space-y-5">
              <LoadingDots label="Extracting key points and actions…" />
              <ShimmerBlock lines={3} />
              <div className="h-px bg-ink-100" />
              <ShimmerBlock lines={4} />
            </div>
          ) : output ? (
            <div className="animate-fade-up space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {output.participants.map((p) => (
                    <span key={p} className="chip bg-ink-100 text-ink-600">
                      <Users size={12} /> {p}
                    </span>
                  ))}
                </div>
                <CopyButton text={copyText} label="Copy all" />
              </div>

              <Section title="Summary">
                <p className="text-sm text-ink-700 leading-relaxed">{output.summary}</p>
              </Section>

              <Section title="Key points" icon={CheckCircle2}>
                <ul className="space-y-2">
                  {output.keyPoints.map((p, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-2 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Section>

              <Section title="Action items" icon={ListTodo}>
                <div className="space-y-2">
                  {output.actionItems.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-accent-50/60 border border-accent-100"
                    >
                      <div className="text-sm text-ink-800 font-medium">{a.task}</div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="chip bg-white text-ink-600 border border-ink-200">{a.owner}</span>
                        <span className="chip bg-warn-50 text-warn-600">{a.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="Decisions" icon={Gavel}>
                <ul className="space-y-2">
                  {output.decisions.map((d, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-700">
                      <CheckCircle2 size={15} className="text-brand-500 mt-0.5 shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              </Section>
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="Your meeting summary will appear here"
              desc="Paste a transcript or raw notes, then run the summarizer to extract key points, decisions, and assigned actions."
            />
          )}
        </div>
      </div>
      <Disclaimer className="mt-4" />
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: typeof FileText;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2.5">
        {Icon && <Icon size={15} className="text-ink-400" />}
        <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-500">{title}</h3>
      </div>
      {children}
    </div>
  );
}
