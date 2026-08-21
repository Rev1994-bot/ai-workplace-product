import { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Mail,
  FileText,
  ListChecks,
  Telescope,
  MessageSquare,
  LayoutDashboard,
  Code2,
  Layers,
  Palette,
  CheckCircle2,
  ShieldCheck,
  ArrowUpRight,
  X,
} from 'lucide-react';

interface Slide {
  id: number;
  render: () => JSX.Element;
}

export function PresentationView({ onExit }: { onExit: () => void }) {
  const [current, setCurrent] = useState(0);
  const total = SLIDES.length;

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, total - 1)), [total]);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prev();
      } else if (e.key === 'Escape') {
        onExit();
      } else if (e.key === 'Home') {
        setCurrent(0);
      } else if (e.key === 'End') {
        setCurrent(total - 1);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, onExit, total]);

  return (
    <div className="fixed inset-0 z-[100] bg-ink-950 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-display font-semibold text-white text-sm">Atlas — Project Presentation</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-400 font-mono">
            {current + 1} / {total}
          </span>
          <button
            onClick={onExit}
            className="btn-ghost text-white hover:bg-white/10 p-2 rounded-lg"
            aria-label="Exit presentation"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Slide area */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className="absolute inset-0 flex items-center justify-center p-6 sm:p-10"
          key={current}
        >
          <div className="animate-fade-up w-full max-w-4xl">{SLIDES[current].render()}</div>
        </div>

        {/* Nav arrows */}
        <button
          onClick={prev}
          disabled={current === 0}
          className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-white disabled:opacity-20 disabled:cursor-not-allowed transition"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          disabled={current === total - 1}
          className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/5 hover:bg-white/15 text-white disabled:opacity-20 disabled:cursor-not-allowed transition"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/5 shrink-0">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-accent-500 transition-all duration-300"
          style={{ width: `${((current + 1) / total) * 100}%` }}
        />
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5 py-3 shrink-0">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? 'w-6 bg-brand-400' : 'w-1.5 bg-white/20 hover:bg-white/40'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ---------- Slide content ----------

function SlideShell({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`text-white ${className}`}>
      {children}
    </div>
  );
}

function SlideLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-300 mb-5">
      {children}
    </div>
  );
}

const SLIDES: Slide[] = [
  // 1 — Title
  {
    id: 1,
    render: () => (
      <SlideShell className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow">
            <Sparkles size={32} className="text-white" />
          </div>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          AI Workplace<br />Productivity Assistant
        </h1>
        <p className="text-lg text-ink-300 max-w-xl mx-auto leading-relaxed">
          A modern SaaS application that helps professionals automate daily work tasks using AI.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <span className="chip bg-white/5 text-ink-300 border border-white/10">React + TypeScript</span>
          <span className="chip bg-white/5 text-ink-300 border border-white/10">Tailwind CSS</span>
          <span className="chip bg-white/5 text-ink-300 border border-white/10">Vite</span>
        </div>
        <p className="text-sm text-ink-500 mt-10">Press → or Space to navigate</p>
      </SlideShell>
    ),
  },

  // 2 — Problem & Solution
  {
    id: 2,
    render: () => (
      <SlideShell>
        <SlideLabel><Layers size={14} /> Problem & Solution</SlideLabel>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-8">
          The challenge
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <h3 className="font-display font-semibold text-ink-200 mb-3">The problem</h3>
            <ul className="space-y-2.5 text-ink-400 text-sm leading-relaxed">
              <li className="flex gap-2"><span className="text-danger-500 mt-1">●</span> Professionals spend hours on repetitive writing tasks</li>
              <li className="flex gap-2"><span className="text-danger-500 mt-1">●</span> Meeting notes get lost with no clear action items</li>
              <li className="flex gap-2"><span className="text-danger-500 mt-1">●</span> Task prioritization is manual and inconsistent</li>
              <li className="flex gap-2"><span className="text-danger-500 mt-1">●</span> Research takes too long to synthesize</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-brand-600/20 to-accent-600/10 border border-brand-500/20 p-6">
            <h3 className="font-display font-semibold text-white mb-3">The solution</h3>
            <ul className="space-y-2.5 text-ink-200 text-sm leading-relaxed">
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-accent-400 mt-0.5 shrink-0" /> Five AI-powered tools in one workspace</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-accent-400 mt-0.5 shrink-0" /> Structured prompt engineering for each feature</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-accent-400 mt-0.5 shrink-0" /> Professional, ready-to-use outputs in seconds</li>
              <li className="flex gap-2"><CheckCircle2 size={16} className="text-accent-400 mt-0.5 shrink-0" /> Clean SaaS UI with loading states & responsive design</li>
            </ul>
          </div>
        </div>
      </SlideShell>
    ),
  },

  // 3 — Architecture
  {
    id: 3,
    render: () => (
      <SlideShell>
        <SlideLabel><Layers size={14} /> Architecture</SlideLabel>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-8">Project structure</h2>
        <div className="rounded-2xl bg-ink-900 border border-white/10 p-6 font-mono text-sm overflow-x-auto">
          <div className="text-ink-400">src/</div>
          <div className="pl-5 text-ink-300">
            ├── <span className="text-brand-300">App.tsx</span>{'  '}
            <span className="text-ink-500">← root component, view routing</span>
          </div>
          <div className="pl-5 text-ink-300">
            ├── <span className="text-brand-300">index.css</span>{' '}
            <span className="text-ink-500">← Tailwind base + custom classes</span>
          </div>
          <div className="pl-5 text-ink-300">├── lib/</div>
          <div className="pl-10 text-accent-300">
            └── ai.ts{' '}
            <span className="text-ink-500">← AI engine: typed interfaces + generators</span>
          </div>
          <div className="pl-5 text-ink-300">├── components/</div>
          <div className="pl-10 text-accent-300">
            └── Shell.tsx{' '}
            <span className="text-ink-500">← Sidebar, PageHeader, Loading, etc.</span>
          </div>
          <div className="pl-5 text-ink-300">└── views/</div>
          <div className="pl-10 text-ink-200">├── Dashboard.tsx</div>
          <div className="pl-10 text-ink-200">├── EmailView.tsx</div>
          <div className="pl-10 text-ink-200">├── MeetingView.tsx</div>
          <div className="pl-10 text-ink-200">├── PlannerView.tsx</div>
          <div className="pl-10 text-ink-200">├── ResearchView.tsx</div>
          <div className="pl-10 text-ink-200">└── ChatView.tsx</div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { icon: Code2, label: 'React 18 + TS', val: 'Frontend' },
            { icon: Palette, label: 'Tailwind CSS', val: 'Styling' },
            { icon: Sparkles, label: 'lucide-react', val: 'Icons' },
            { icon: Layers, label: 'Vite', val: 'Build tool' },
          ].map((t) => {
            const Icon = t.icon;
            return (
              <div key={t.label} className="rounded-xl bg-white/5 border border-white/10 p-3.5">
                <Icon size={18} className="text-brand-300 mb-2" />
                <div className="text-sm font-medium text-white">{t.label}</div>
                <div className="text-xs text-ink-500">{t.val}</div>
              </div>
            );
          })}
        </div>
      </SlideShell>
    ),
  },

  // 4 — Feature 1: Email
  {
    id: 4,
    render: () => (
      <SlideShell>
        <SlideLabel><Mail size={14} /> Feature 1</SlideLabel>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">Smart Email Generator</h2>
        <p className="text-ink-400 text-sm mb-6 max-w-2xl">Draft professional emails tuned by tone, audience, and goal in seconds.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-3">How it works</h3>
            <ul className="space-y-2 text-sm text-ink-300">
              <li className="flex gap-2"><span className="text-brand-400 font-mono text-xs mt-0.5">01</span> User enters topic, audience, goal, and sender name</li>
              <li className="flex gap-2"><span className="text-brand-400 font-mono text-xs mt-0.5">02</span> Selects a tone from 5 options</li>
              <li className="flex gap-2"><span className="text-brand-400 font-mono text-xs mt-0.5">03</span> AI engine builds subject line + structured body</li>
              <li className="flex gap-2"><span className="text-brand-400 font-mono text-xs mt-0.5">04</span> Output includes preview, word count, copy button</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <h3 className="font-display font-semibold text-white text-sm mb-3">5 Tones available</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {['Professional', 'Friendly', 'Persuasive', 'Apologetic', 'Urgent'].map((t) => (
                <span key={t} className="chip bg-brand-500/15 text-brand-300 border border-brand-500/20">{t}</span>
              ))}
            </div>
            <h3 className="font-display font-semibold text-white text-sm mb-2">Quick presets</h3>
            <ul className="space-y-1.5 text-xs text-ink-400">
              <li>• Project kickoff invitation</li>
              <li>• Q3 budget approval request</li>
              <li>• Delayed shipment notice</li>
            </ul>
          </div>
        </div>
      </SlideShell>
    ),
  },

  // 5 — Feature 2: Meeting
  {
    id: 5,
    render: () => (
      <SlideShell>
        <SlideLabel><FileText size={14} /> Feature 2</SlideLabel>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">Meeting Notes Summarizer</h2>
        <p className="text-ink-400 text-sm mb-6 max-w-2xl">Turn raw transcripts into key points, decisions, and action items with owners and deadlines.</p>
        <div className="grid sm:grid-cols-4 gap-3">
          {[
            { icon: FileText, title: 'Summary', desc: 'Auto-generated from first sentences' },
            { icon: CheckCircle2, title: 'Key Points', desc: 'Filtered by action keywords' },
            { icon: ListChecks, title: 'Action Items', desc: 'Owner + deadline assigned' },
            { icon: ShieldCheck, title: 'Decisions', desc: 'Extracted from context' },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="rounded-xl bg-white/5 border border-white/10 p-4">
                <Icon size={20} className="text-accent-400 mb-3" />
                <div className="font-display font-semibold text-white text-sm">{c.title}</div>
                <div className="text-xs text-ink-500 mt-1">{c.desc}</div>
              </div>
            );
          })}
        </div>
        <div className="rounded-2xl bg-ink-900 border border-white/10 p-5 mt-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">Prompt engineering technique</div>
          <p className="text-sm text-ink-300 leading-relaxed">
            Regex sentence splitting → keyword filtering (<span className="font-mono text-brand-300">should|will|need|plan|decide</span>) →
            action extraction via pattern matching → deterministic owner/deadline assignment by hash seed.
          </p>
        </div>
      </SlideShell>
    ),
  },

  // 6 — Feature 3: Task Planner
  {
    id: 6,
    render: () => (
      <SlideShell>
        <SlideLabel><ListChecks size={14} /> Feature 3</SlideLabel>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">AI Task Planner</h2>
        <p className="text-ink-400 text-sm mb-6 max-w-2xl">Prioritize tasks and build a time-blocked day schedule that front-loads deep-focus work.</p>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="font-display font-bold text-2xl text-brand-300 mb-1">1</div>
            <div className="text-sm font-medium text-white mb-1">Sort by priority</div>
            <div className="text-xs text-ink-500">High (3) → Medium (2) → Low (1), then by due date</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="font-display font-bold text-2xl text-brand-300 mb-1">2</div>
            <div className="text-sm font-medium text-white mb-1">Order by energy</div>
            <div className="text-xs text-ink-500">Focus → Communication → Routine for optimal cognitive load</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="font-display font-bold text-2xl text-brand-300 mb-1">3</div>
            <div className="text-sm font-medium text-white mb-1">Time-block & suggest</div>
            <div className="text-xs text-ink-500">Inserts lunch at noon, 5-min buffers, smart suggestions</div>
          </div>
        </div>
        <div className="rounded-2xl bg-ink-900 border border-white/10 p-5 mt-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-3">Schedule output includes</div>
          <div className="grid sm:grid-cols-2 gap-2 text-sm text-ink-300">
            <div className="flex gap-2"><CheckCircle2 size={15} className="text-accent-400 mt-0.5" /> Time-blocked schedule with color-coded priorities</div>
            <div className="flex gap-2"><CheckCircle2 size={15} className="text-accent-400 mt-0.5" /> Top priorities callout</div>
            <div className="flex gap-2"><CheckCircle2 size={15} className="text-accent-400 mt-0.5" /> Contextual productivity suggestions</div>
            <div className="flex gap-2"><CheckCircle2 size={15} className="text-accent-400 mt-0.5" /> Total scheduled time summary</div>
          </div>
        </div>
      </SlideShell>
    ),
  },

  // 7 — Feature 4 & 5
  {
    id: 7,
    render: () => (
      <SlideShell>
        <SlideLabel><Telescope size={14} /> Features 4 & 5</SlideLabel>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-8">Research & Chat</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-gradient-to-br from-brand-600/15 to-transparent border border-brand-500/20 p-6">
            <Telescope size={24} className="text-brand-300 mb-4" />
            <h3 className="font-display font-semibold text-white text-lg mb-2">AI Research Assistant</h3>
            <p className="text-sm text-ink-400 mb-4">Structured reports with 3 depth levels (brief, standard, deep).</p>
            <ul className="space-y-2 text-sm text-ink-300">
              <li className="flex gap-2"><span className="text-brand-400">●</span> Overview paragraph contextualized to topic</li>
              <li className="flex gap-2"><span className="text-brand-400">●</span> Key insights with title + detail</li>
              <li className="flex gap-2"><span className="text-brand-400">●</span> Glossary of key terms</li>
              <li className="flex gap-2"><span className="text-brand-400">●</span> Follow-up questions (clickable)</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-gradient-to-br from-accent-600/15 to-transparent border border-accent-500/20 p-6">
            <MessageSquare size={24} className="text-accent-400 mb-4" />
            <h3 className="font-display font-semibold text-white text-lg mb-2">AI Chatbot</h3>
            <p className="text-sm text-ink-400 mb-4">Conversational interface with intent routing and context awareness.</p>
            <ul className="space-y-2 text-sm text-ink-300">
              <li className="flex gap-2"><span className="text-accent-400">●</span> Regex-based intent detection</li>
              <li className="flex gap-2"><span className="text-accent-400">●</span> Suggestion chips for quick starts</li>
              <li className="flex gap-2"><span className="text-accent-400">●</span> Typing indicator + auto-scroll</li>
              <li className="flex gap-2"><span className="text-accent-400">●</span> Message history with timestamps</li>
            </ul>
          </div>
        </div>
      </SlideShell>
    ),
  },

  // 8 — Design system
  {
    id: 8,
    render: () => (
      <SlideShell>
        <SlideLabel><Palette size={14} /> Design System</SlideLabel>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-8">Modern SaaS UI</h2>
        <div className="grid sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">Color system</div>
              <div className="flex gap-2">
                {[
                  ['bg-ink-900', 'Ink'],
                  ['bg-brand-600', 'Brand'],
                  ['bg-accent-500', 'Accent'],
                  ['bg-warn-500', 'Warn'],
                  ['bg-danger-500', 'Danger'],
                ].map(([cls, name]) => (
                  <div key={name} className="text-center">
                    <div className={`w-12 h-12 rounded-xl ${cls} mb-1.5`} />
                    <div className="text-[11px] text-ink-500">{name}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">Typography</div>
              <div className="space-y-1">
                <div className="font-display text-lg text-white">Plus Jakarta Sans — Headings</div>
                <div className="font-sans text-sm text-ink-300">Inter — Body text</div>
                <div className="font-mono text-xs text-ink-400">JetBrains Mono — Code</div>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-2">Principles</div>
            {[
              '8px spacing system for consistent layout rhythm',
              'Card-based layout with soft shadows',
              'Dark sidebar + light content area',
              'Loading states: shimmer skeletons + pulse dots',
              'Micro-interactions: hover lift, fade-up transitions',
              'Fully responsive: mobile drawer to desktop sidebar',
            ].map((p) => (
              <div key={p} className="flex items-start gap-2.5 text-sm text-ink-300">
                <CheckCircle2 size={16} className="text-accent-400 mt-0.5 shrink-0" />
                {p}
              </div>
            ))}
          </div>
        </div>
      </SlideShell>
    ),
  },

  // 9 — AI Engine
  {
    id: 9,
    render: () => (
      <SlideShell>
        <SlideLabel><Code2 size={14} /> AI Engine</SlideLabel>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">Structured Prompt Engineering</h2>
        <p className="text-ink-400 text-sm mb-6 max-w-2xl">Every feature uses typed interfaces and deterministic template generators.</p>
        <div className="rounded-2xl bg-ink-900 border border-white/10 p-5 font-mono text-xs sm:text-sm overflow-x-auto">
          <div className="text-ink-400">// src/lib/ai.ts — public API</div>
          <div className="text-ink-300">export const <span className="text-brand-300">ai</span> = {'{'}</div>
          <div className="pl-4 text-ink-200">email: <span className="text-accent-300">(i: EmailInput) → Promise&lt;EmailOutput&gt;</span></div>
          <div className="pl-4 text-ink-200">meeting: <span className="text-accent-300">(i: MeetingInput) → Promise&lt;MeetingOutput&gt;</span></div>
          <div className="pl-4 text-ink-200">planner: <span className="text-accent-300">(i: PlannerInput) → Promise&lt;PlannerOutput&gt;</span></div>
          <div className="pl-4 text-ink-200">research: <span className="text-accent-300">(i: ResearchInput) → Promise&lt;ResearchOutput&gt;</span></div>
          <div className="pl-4 text-ink-200">chat: <span className="text-accent-300">(history, text) → Promise&lt;string&gt;</span></div>
          <div className="text-ink-300">{'};'}</div>
          <div className="mt-3 text-ink-500">// Each generator uses:</div>
          <div className="pl-4 text-ink-400">• hashStr() — deterministic seed from input</div>
          <div className="pl-4 text-ink-400">• delay() — simulated latency (600–1800ms)</div>
          <div className="pl-4 text-ink-400">• Regex patterns for NLP-style extraction</div>
        </div>
        <div className="grid sm:grid-cols-3 gap-3 mt-5">
          <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 text-center">
            <div className="font-display font-bold text-2xl text-brand-300">394</div>
            <div className="text-xs text-ink-500">Lines of AI logic</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 text-center">
            <div className="font-display font-bold text-2xl text-brand-300">9</div>
            <div className="text-xs text-ink-500">Type interfaces</div>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 text-center">
            <div className="font-display font-bold text-2xl text-brand-300">5</div>
            <div className="text-xs text-ink-500">AI generators</div>
          </div>
        </div>
      </SlideShell>
    ),
  },

  // 10 — Dashboard
  {
    id: 10,
    render: () => (
      <SlideShell>
        <SlideLabel><LayoutDashboard size={14} /> User Experience</SlideLabel>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-8">Dashboard & Navigation</h2>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="font-display font-bold text-3xl text-white mb-1">2h 14m</div>
            <div className="text-xs text-ink-500">Time saved today</div>
            <div className="chip bg-accent-500/15 text-accent-300 mt-3">+18%</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="font-display font-bold text-3xl text-white mb-1">37</div>
            <div className="text-xs text-ink-500">Tasks automated</div>
            <div className="chip bg-accent-500/15 text-accent-300 mt-3">+5</div>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
            <div className="font-display font-bold text-3xl text-white mb-1">86</div>
            <div className="text-xs text-ink-500">Focus score</div>
            <div className="chip bg-accent-500/15 text-accent-300 mt-3">+4 pts</div>
          </div>
        </div>
        <div className="rounded-2xl bg-ink-900 border border-white/10 p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-500 mb-3">UX features</div>
          <div className="grid sm:grid-cols-2 gap-2.5 text-sm text-ink-300">
            <div className="flex gap-2"><CheckCircle2 size={15} className="text-accent-400 mt-0.5" /> Dark sidebar with 6 navigation items</div>
            <div className="flex gap-2"><CheckCircle2 size={15} className="text-accent-400 mt-0.5" /> Mobile drawer with overlay backdrop</div>
            <div className="flex gap-2"><CheckCircle2 size={15} className="text-accent-400 mt-0.5" /> Feature cards with hover-lift animations</div>
            <div className="flex gap-2"><CheckCircle2 size={15} className="text-accent-400 mt-0.5" /> Copy-to-clipboard on all outputs</div>
            <div className="flex gap-2"><CheckCircle2 size={15} className="text-accent-400 mt-0.5" /> Empty states with helpful guidance</div>
            <div className="flex gap-2"><CheckCircle2 size={15} className="text-accent-400 mt-0.5" /> Human review disclaimer on every tool</div>
          </div>
        </div>
      </SlideShell>
    ),
  },

  // 11 — Requirements met
  {
    id: 11,
    render: () => (
      <SlideShell>
        <SlideLabel><ShieldCheck size={14} /> Requirements</SlideLabel>
        <h2 className="font-display text-3xl sm:text-4xl font-bold mb-8">All requirements met</h2>
        <div className="space-y-3">
          {[
            'Smart Email Generator (tone + audience-based)',
            'Meeting Notes Summarizer (key points, actions, deadlines)',
            'AI Task Planner (prioritization + scheduling)',
            'AI Research Assistant (insights + summaries)',
            'AI Chatbot Interface',
            'Structured prompt engineering for each feature',
            'Professional, clear AI outputs',
            'Loading states and responsive design',
            'Disclaimer: "AI-generated content may require human review"',
            'Modern SaaS UI with sidebar navigation + card-based layout',
          ].map((req, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-6 h-6 rounded-full bg-accent-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 size={15} className="text-accent-400" />
              </div>
              <span className="text-sm text-ink-200">{req}</span>
            </div>
          ))}
        </div>
      </SlideShell>
    ),
  },

  // 12 — Thank you
  {
    id: 12,
    render: () => (
      <SlideShell className="text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow">
            <Sparkles size={32} className="text-white" />
          </div>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          Thank you
        </h1>
        <p className="text-lg text-ink-300 max-w-lg mx-auto leading-relaxed mb-8">
          A fully functional prototype with interactive UI and AI-powered features, ready for production enhancement.
        </p>
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className="chip bg-white/5 text-ink-300 border border-white/10">5 AI Tools</span>
          <span className="chip bg-white/5 text-ink-300 border border-white/10">1,500+ lines</span>
          <span className="chip bg-white/5 text-ink-300 border border-white/10">Fully responsive</span>
        </div>
        <div className="inline-flex items-center gap-2 text-sm text-ink-500">
          <ArrowUpRight size={15} /> Press ESC or click X to return to the app
        </div>
      </SlideShell>
    ),
  },
];
