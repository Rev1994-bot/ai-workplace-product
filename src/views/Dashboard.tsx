import {
  Mail,
  FileText,
  ListChecks,
  Telescope,
  MessageSquare,
  ArrowUpRight,
  Clock,
  TrendingUp,
  Zap,
  Presentation,
} from 'lucide-react';
import { PageHeader, Disclaimer } from '@/components/Shell';
import type { ViewId } from '@/components/Shell';

interface DashboardProps {
  onNavigate: (id: ViewId) => void;
  onPresent: () => void;
}

const FEATURES: {
  id: ViewId;
  icon: typeof Mail;
  title: string;
  desc: string;
  accent: string;
  stat: string;
}[] = [
  {
    id: 'email',
    icon: Mail,
    title: 'Smart Email Generator',
    desc: 'Draft professional emails tuned by tone, audience, and goal in seconds.',
    accent: 'bg-brand-50 text-brand-600',
    stat: '5 tones',
  },
  {
    id: 'meeting',
    icon: FileText,
    title: 'Meeting Notes Summarizer',
    desc: 'Turn raw transcripts into key points, decisions, and action items.',
    accent: 'bg-accent-50 text-accent-600',
    stat: 'Auto actions',
  },
  {
    id: 'planner',
    icon: ListChecks,
    title: 'AI Task Planner',
    desc: 'Prioritize your tasks and build a focused day schedule automatically.',
    accent: 'bg-warn-50 text-warn-600',
    stat: 'Smart scheduling',
  },
  {
    id: 'research',
    icon: Telescope,
    title: 'AI Research Assistant',
    desc: 'Get structured overviews, insights, and key terms on any topic.',
    accent: 'bg-ink-100 text-ink-700',
    stat: '3 depths',
  },
  {
    id: 'chat',
    icon: MessageSquare,
    title: 'AI Chatbot',
    desc: 'Ask anything and get structured, actionable guidance instantly.',
    accent: 'bg-brand-50 text-brand-600',
    stat: 'Always on',
  },
];

const STATS = [
  { icon: Clock, label: 'Time saved today', value: '2h 14m', trend: '+18%' },
  { icon: Zap, label: 'Tasks automated', value: '37', trend: '+5' },
  { icon: TrendingUp, label: 'Focus score', value: '86', trend: '+4 pts' },
];

export function Dashboard({ onNavigate }: DashboardProps) {
  return (
    <div className="animate-fade-up">
      <PageHeader
        title="Welcome back, Alex"
        subtitle="Here's your AI-powered workspace at a glance."
        icon={Zap}
        accent="bg-accent-50 text-accent-600"
      >
        <button className="btn-accent text-sm px-3.5 py-2" onClick={onPresent}>
          <Presentation size={15} /> Present project
        </button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-ink-100 flex items-center justify-center">
                  <Icon size={18} className="text-ink-600" />
                </div>
                <span className="chip bg-accent-50 text-accent-700">{s.trend}</span>
              </div>
              <div className="font-display text-2xl font-bold text-ink-900">{s.value}</div>
              <div className="text-sm text-ink-500 mt-0.5">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Feature grid */}
      <h2 className="font-display text-lg font-semibold text-ink-800 mb-3">AI tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => onNavigate(f.id)}
              className="card p-5 text-left group hover:shadow-pop hover:border-ink-200 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${f.accent}`}>
                  <Icon size={22} />
                </div>
                <span className="chip bg-ink-100 text-ink-600">{f.stat}</span>
              </div>
              <h3 className="font-display font-semibold text-ink-900 group-hover:text-brand-700 transition-colors">
                {f.title}
              </h3>
              <p className="text-sm text-ink-500 mt-1 leading-relaxed">{f.desc}</p>
              <div className="flex items-center gap-1 text-sm font-medium text-brand-600 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                Open tool <ArrowUpRight size={15} />
              </div>
            </button>
          );
        })}

        {/* Tip card */}
        <div className="rounded-2xl bg-gradient-to-br from-ink-900 to-brand-900 p-5 text-white relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-brand-500/30 blur-2xl" />
          <div className="relative">
            <MessageSquare size={22} className="text-brand-300 mb-3" />
            <h3 className="font-display font-semibold text-lg">Need a quick answer?</h3>
            <p className="text-sm text-ink-300 mt-1 leading-relaxed">
              Jump into the AI chat for instant, structured guidance on any work question.
            </p>
            <button
              onClick={() => onNavigate('chat')}
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-300 hover:text-white transition-colors"
            >
              Start chatting <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
      </div>

      <Disclaimer className="mt-8" />
    </div>
  );
}
