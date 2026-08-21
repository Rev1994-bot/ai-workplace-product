import { useState, type ReactNode } from 'react';
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  Telescope,
  MessageSquare,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

export type ViewId =
  | 'dashboard'
  | 'email'
  | 'meeting'
  | 'planner'
  | 'research'
  | 'chat';

interface NavItem {
  id: ViewId;
  label: string;
  icon: typeof LayoutDashboard;
  desc: string;
}

const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, desc: 'Overview' },
  { id: 'email', label: 'Email Generator', icon: Mail, desc: 'Draft with AI' },
  { id: 'meeting', label: 'Meeting Summarizer', icon: FileText, desc: 'Notes to actions' },
  { id: 'planner', label: 'Task Planner', icon: ListChecks, desc: 'Prioritize & schedule' },
  { id: 'research', label: 'Research Assistant', icon: Telescope, desc: 'Insights & summaries' },
  { id: 'chat', label: 'AI Chat', icon: MessageSquare, desc: 'Ask anything' },
];

interface SidebarProps {
  active: ViewId;
  onNavigate: (id: ViewId) => void;
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between bg-ink-950/95 backdrop-blur px-4 py-3 text-white">
        <div className="flex items-center gap-2">
          <Logo />
          <span className="font-display font-bold tracking-tight">Atlas</span>
        </div>
        <button
          className="btn-ghost text-white hover:bg-white/10 p-2 rounded-lg"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 lg:z-20 h-screen w-72 shrink-0
        bg-ink-950 text-ink-100 flex flex-col transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <Logo />
            <div className="leading-none">
              <div className="font-display font-bold text-lg tracking-tight text-white">Atlas</div>
              <div className="text-[11px] text-ink-400 font-medium">AI Productivity</div>
            </div>
          </div>
          <button
            className="lg:hidden btn-ghost text-white hover:bg-white/10 p-2 rounded-lg"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] uppercase tracking-wider text-ink-500 font-semibold">
            Workspace
          </div>
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileOpen(false);
                }}
                className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150
                ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-glow'
                    : 'text-ink-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? 'text-white' : 'text-ink-400 group-hover:text-white'}
                />
                <div className="flex-1 text-left leading-tight">
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className={`text-[11px] ${isActive ? 'text-brand-100' : 'text-ink-500'}`}>
                    {item.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-accent-400 flex items-center justify-center text-white font-semibold text-sm">
              AK
            </div>
            <div className="flex-1 leading-tight">
              <div className="text-sm font-medium text-white">Alex Kim</div>
              <div className="text-[11px] text-ink-400">Pro workspace</div>
            </div>
            <Sparkles size={16} className="text-accent-400" />
          </div>
        </div>
      </aside>
    </>
  );
}

function Logo() {
  return (
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-glow">
      <Sparkles size={18} className="text-white" />
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
  accent,
  children,
}: {
  title: string;
  subtitle: string;
  icon: typeof LayoutDashboard;
  accent?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-start gap-3.5">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
            accent || 'bg-brand-50 text-brand-600'
          }`}
        >
          <Icon size={22} />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900 tracking-tight">{title}</h1>
          <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>
        </div>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

export function Disclaimer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-2 text-xs text-ink-400 ${className}`}
    >
      <span className="inline-block w-1 h-1 rounded-full bg-warn-500 mt-1.5 shrink-0" />
      <span>AI-generated content may require human review before use.</span>
    </div>
  );
}

export function LoadingDots({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-ink-500 text-sm">
      <div className="flex gap-1">
        <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-soft" />
        <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-soft [animation-delay:0.2s]" />
        <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse-soft [animation-delay:0.4s]" />
      </div>
      {label && <span>{label}</span>}
    </div>
  );
}

export function ShimmerBlock({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-3 animate-fade-in">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="shimmer-line h-4"
          style={{ width: `${90 - i * 12}%` }}
        />
      ))}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  desc,
}: {
  icon: typeof LayoutDashboard;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-ink-100 flex items-center justify-center mb-4">
        <Icon size={26} className="text-ink-400" />
      </div>
      <h3 className="font-display font-semibold text-ink-700">{title}</h3>
      <p className="text-sm text-ink-400 mt-1 max-w-sm">{desc}</p>
    </div>
  );
}

export function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      className="btn-outline text-xs px-3 py-1.5"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard unavailable */
        }
      }}
    >
      {copied ? 'Copied!' : label}
    </button>
  );
}
