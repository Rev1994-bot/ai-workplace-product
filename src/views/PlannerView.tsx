import { useState } from 'react';
import {
  ListChecks,
  Sparkles,
  Plus,
  Trash2,
  GripVertical,
  Lightbulb,
  Clock,
} from 'lucide-react';
import { PageHeader, Disclaimer, LoadingDots, EmptyState } from '@/components/Shell';
import { ai, type Task, type PlannerOutput } from '@/lib/ai';

const PRIORITY_COLORS: Record<Task['priority'], string> = {
  high: 'bg-danger-50 text-danger-600 border-danger-100',
  medium: 'bg-warn-50 text-warn-600 border-warn-100',
  low: 'bg-accent-50 text-accent-600 border-accent-100',
};

const ENERGY_LABEL: Record<Task['energy'], string> = {
  focus: 'Deep focus',
  communication: 'Communication',
  routine: 'Routine',
};

const SAMPLE_TASKS: Task[] = [
  { id: 't1', title: 'Finalize Q3 strategy doc', durationMin: 90, priority: 'high', due: 'Today', energy: 'focus' },
  { id: 't2', title: 'Review pull requests', durationMin: 45, priority: 'medium', due: 'Today', energy: 'communication' },
  { id: 't3', title: '1:1 with Sarah', durationMin: 30, priority: 'medium', due: 'Today', energy: 'communication' },
  { id: 't4', title: 'Inbox triage', durationMin: 20, priority: 'low', due: 'Tomorrow', energy: 'routine' },
  { id: 't5', title: 'Draft launch announcement', durationMin: 60, priority: 'high', due: 'Tomorrow', energy: 'focus' },
];

export function PlannerView() {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [workStart, setWorkStart] = useState('09:00');
  const [workEnd, setWorkEnd] = useState('17:00');
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<PlannerOutput | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState(30);
  const [newPriority, setNewPriority] = useState<Task['priority']>('medium');
  const [newEnergy, setNewEnergy] = useState<Task['energy']>('routine');

  function addTask() {
    if (!newTitle.trim()) return;
    setTasks([
      ...tasks,
      {
        id: `t${Date.now()}`,
        title: newTitle.trim(),
        durationMin: newDuration,
        priority: newPriority,
        due: 'Today',
        energy: newEnergy,
      },
    ]);
    setNewTitle('');
  }

  function removeTask(id: string) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  async function handlePlan() {
    if (tasks.length === 0) return;
    setLoading(true);
    setOutput(null);
    const result = await ai.planner({ tasks, workStart, workEnd });
    setOutput(result);
    setLoading(false);
  }

  return (
    <div className="animate-fade-up">
      <PageHeader
        title="AI Task Planner"
        subtitle="Prioritize tasks and build a focused, time-blocked day schedule."
        icon={ListChecks}
        accent="bg-warn-50 text-warn-600"
      />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Task list */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-ink-900">Your tasks</h3>
              <span className="chip bg-ink-100 text-ink-500">{tasks.length} items</span>
            </div>

            <div className="space-y-2 mb-4">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-xl border border-ink-100 hover:border-ink-200 transition"
                >
                  <GripVertical size={15} className="text-ink-300 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-ink-800 truncate">{t.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`chip border ${PRIORITY_COLORS[t.priority]} text-[10px] px-2 py-0.5 capitalize`}>
                        {t.priority}
                      </span>
                      <span className="text-[11px] text-ink-400 flex items-center gap-1">
                        <Clock size={11} /> {t.durationMin}m
                      </span>
                      <span className="text-[11px] text-ink-400">· {ENERGY_LABEL[t.energy]}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeTask(t.id)}
                    className="opacity-0 group-hover:opacity-100 text-ink-400 hover:text-danger-600 transition p-1"
                    aria-label="Remove task"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-sm text-ink-400 text-center py-6">No tasks yet. Add one below.</p>
              )}
            </div>

            {/* Add task */}
            <div className="border-t border-ink-100 pt-4 space-y-3">
              <input
                className="input"
                placeholder="New task title…"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addTask()}
              />
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="label text-xs">Minutes</label>
                  <input
                    type="number"
                    min={5}
                    step={5}
                    className="input"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value) || 30)}
                  />
                </div>
                <div>
                  <label className="label text-xs">Priority</label>
                  <select
                    className="input"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Task['priority'])}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="label text-xs">Energy</label>
                  <select
                    className="input"
                    value={newEnergy}
                    onChange={(e) => setNewEnergy(e.target.value as Task['energy'])}
                  >
                    <option value="focus">Focus</option>
                    <option value="communication">Comm</option>
                    <option value="routine">Routine</option>
                  </select>
                </div>
              </div>
              <button className="btn-outline w-full py-2 text-sm" onClick={addTask} disabled={!newTitle.trim()}>
                <Plus size={15} /> Add task
              </button>
            </div>
          </div>

          <div className="card p-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Work start</label>
                <input type="time" className="input" value={workStart} onChange={(e) => setWorkStart(e.target.value)} />
              </div>
              <div>
                <label className="label">Work end</label>
                <input type="time" className="input" value={workEnd} onChange={(e) => setWorkEnd(e.target.value)} />
              </div>
            </div>
            <button
              className="btn-accent w-full py-2.5 mt-4"
              disabled={tasks.length === 0 || loading}
              onClick={handlePlan}
            >
              <Sparkles size={16} /> {loading ? 'Planning your day…' : 'Generate schedule'}
            </button>
          </div>
        </div>

        {/* Schedule output */}
        <div className="lg:col-span-3">
          <div className="card p-6 min-h-[480px]">
            {loading ? (
              <div className="space-y-4">
                <LoadingDots label="Optimizing your schedule…" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="shimmer-line h-12 rounded-xl" />
                ))}
              </div>
            ) : output ? (
              <div className="animate-fade-up space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display font-semibold text-ink-900">Today's schedule</h3>
                  <span className="chip bg-brand-50 text-brand-700">
                    {Math.round(output.totalScheduledMin / 60)}h {output.totalScheduledMin % 60}m planned
                  </span>
                </div>

                <div className="space-y-2">
                  {output.schedule.map((b, i) => (
                    <div
                      key={i}
                      className={`flex items-stretch gap-3 rounded-xl border overflow-hidden ${
                        b.title === 'Lunch break'
                          ? 'border-ink-100 bg-ink-50'
                          : 'border-ink-100 bg-white'
                      }`}
                    >
                      <div
                        className={`w-1.5 shrink-0 ${
                          b.priority === 'high'
                            ? 'bg-danger-500'
                            : b.priority === 'medium'
                            ? 'bg-warn-500'
                            : b.title === 'Lunch break'
                            ? 'bg-ink-300'
                            : 'bg-accent-500'
                        }`}
                      />
                      <div className="flex-1 py-3 pr-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium text-ink-800">{b.title}</div>
                          <div className="text-xs text-ink-400 font-mono">{b.time}–{b.end}</div>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] text-ink-400 flex items-center gap-1">
                            <Clock size={11} /> {b.durationMin}m
                          </span>
                          {b.title !== 'Lunch break' && (
                            <span className="text-[11px] text-ink-400">· {ENERGY_LABEL[b.energy]}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {output.topPriorities.length > 0 && (
                  <div className="rounded-xl bg-brand-50/60 border border-brand-100 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-brand-700 mb-2">
                      Top priorities
                    </div>
                    <ul className="space-y-1.5">
                      {output.topPriorities.map((p, i) => (
                        <li key={i} className="text-sm text-ink-700 flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-brand-600 text-white text-[10px] flex items-center justify-center mt-0.5 shrink-0">
                            {i + 1}
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-500">
                    <Lightbulb size={14} className="text-warn-500" /> Suggestions
                  </div>
                  {output.suggestions.map((s, i) => (
                    <div key={i} className="text-sm text-ink-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-warn-500 mt-2 shrink-0" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState
                icon={ListChecks}
                title="Your optimized schedule will appear here"
                desc="Add your tasks, set your work hours, and generate a time-blocked schedule that front-loads high-priority, deep-focus work."
              />
            )}
          </div>
          <Disclaimer className="mt-4" />
        </div>
      </div>
    </div>
  );
}
