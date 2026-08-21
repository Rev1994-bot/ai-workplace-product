// Simulated AI engine. Produces structured, professional outputs for each
// workplace feature using deterministic prompt-engineering-style templates.
// No network calls — keeps the prototype fully interactive offline.

export type Tone =
  | 'professional'
  | 'friendly'
  | 'persuasive'
  | 'apologetic'
  | 'urgent';

export interface EmailInput {
  topic: string;
  audience: string;
  tone: Tone;
  goal: string;
  senderName: string;
}

export interface EmailOutput {
  subject: string;
  body: string;
  preview: string;
  wordCount: number;
}

export interface MeetingInput {
  transcript: string;
  meetingTitle: string;
}

export interface MeetingOutput {
  summary: string;
  keyPoints: string[];
  actionItems: { task: string; owner: string; deadline: string }[];
  decisions: string[];
  participants: string[];
}

export interface Task {
  id: string;
  title: string;
  durationMin: number;
  priority: 'high' | 'medium' | 'low';
  due: string;
  energy: 'focus' | 'routine' | 'communication';
}

export interface PlannerInput {
  tasks: Task[];
  workStart: string;
  workEnd: string;
}

export interface ScheduledBlock {
  time: string;
  end: string;
  title: string;
  priority: Task['priority'];
  energy: Task['energy'];
  durationMin: number;
}

export interface PlannerOutput {
  schedule: ScheduledBlock[];
  topPriorities: string[];
  suggestions: string[];
  totalScheduledMin: number;
}

export interface ResearchInput {
  topic: string;
  depth: 'brief' | 'standard' | 'deep';
}

export interface ResearchOutput {
  overview: string;
  insights: { title: string; detail: string }[];
  keyTerms: { term: string; definition: string }[];
  summary: string;
  followUp: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

// ---------- Email ----------

const TONE_OPENERS: Record<Tone, string[]> = {
  professional: ['I hope this message finds you well.', 'Thank you for your time.'],
  friendly: ["Hope you're having a great day!", 'Great to connect with you.'],
  persuasive: ["I wanted to share something that could make a real difference for your team."],
  apologetic: ["Thank you for your patience, and I apologize for the inconvenience."],
  urgent: ["I'm reaching out regarding a time-sensitive matter that needs quick attention."],
};

const TONE_CLOSERS: Record<Tone, string> = {
  professional: "I welcome any feedback and am happy to discuss further at your convenience.",
  friendly: "Looking forward to hearing your thoughts — happy to chat anytime!",
  persuasive: "I'd be glad to walk you through the details and answer any questions you may have.",
  apologetic: "Thank you again for your understanding, and please let me know how I can make this right.",
  urgent: "Please let me know your availability today so we can move forward promptly.",
};

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function generateEmail(input: EmailInput): EmailOutput {
  const seed = hashStr(input.topic + input.audience + input.tone);
  const opener = pick(TONE_OPENERS[input.tone], seed);
  const closer = TONE_CLOSERS[input.tone];

  const topic = input.topic.trim() || 'our upcoming project';
  const goal = input.goal.trim() || 'coordinate next steps';
  const audience = input.audience.trim() || 'stakeholders';

  const subject = `${topic.charAt(0).toUpperCase() + topic.slice(1)} — next steps`;
  const preview = `${opener} I'm writing to ${goal.toLowerCase()} regarding ${topic}.`;

  const body = [
    `Dear ${audience},`,
    ``,
    `${opener}`,
    ``,
    `I'm writing to ${goal.toLowerCase()} regarding ${topic}. Based on where things stand, I'd like to align on the following points:`,
    ``,
    `• Context — ${topic} has progressed to a stage where your input would help us move forward confidently.`,
    `• What's needed — a quick review of the proposed approach and confirmation of priorities.`,
    `• Impact — keeping this on track helps us meet our timeline without unexpected blockers.`,
    ``,
    `${closer}`,
    ``,
    `Best regards,`,
    `${input.senderName || 'Your name'}`,
  ].join('\n');

  return {
    subject,
    preview,
    body,
    wordCount: body.split(/\s+/).filter(Boolean).length,
  };
}

// ---------- Meeting ----------

function generateMeeting(input: MeetingInput): MeetingOutput {
  const text = input.transcript.trim();
  const seed = hashStr(text);
  const title = input.meetingTitle.trim() || 'Team Sync';

  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const summary =
    sentences.slice(0, 3).join(' ') ||
    `The ${title} covered project status, open questions, and next steps. The team aligned on priorities and identified owners for follow-up actions.`;

  const keyPoints = sentences
    .filter((s) => /should|will|need|plan|decide|agree|review|update|schedule/i.test(s))
    .slice(0, 5)
    .map((s) => s.replace(/^[-•\d.]+\s*/, ''));

  while (keyPoints.length < 3) {
    keyPoints.push(
      [
        'Project milestones are on track with minor adjustments to the timeline.',
        'Budget review is pending final approval from finance.',
        'Next stakeholder update is scheduled for the end of the week.',
      ][keyPoints.length] || 'Team aligned on the current direction.'
    );
  }

  const actionWords = text.match(/(?:should|will|needs? to|must|assign|follow up|send|prepare|review|schedule)\s[^.!?]+/gi) || [];
  const actionItems = actionWords.slice(0, 4).map((w, i) => {
    const owners = ['PM', 'Eng Lead', 'Design', 'Marketing', 'Finance'];
    const deadlines = ['This week', 'Next Monday', 'In 3 days', 'By Friday', 'End of sprint'];
    return {
      task: w.trim().replace(/^(should|will|needs? to|must)\s+/i, '').charAt(0).toUpperCase() +
        w.trim().replace(/^(should|will|needs? to|must)\s+/i, '').slice(1),
      owner: owners[(seed + i) % owners.length],
      deadline: deadlines[(seed + i * 2) % deadlines.length],
    };
  });

  while (actionItems.length < 2) {
    actionItems.push({
      task: 'Circulate meeting notes to all attendees',
      owner: 'PM',
      deadline: 'Today',
    });
  }

  const decisions = [
    `Adopted the revised timeline for ${title.toLowerCase()}.`,
    'Prioritized the top three deliverables for this sprint.',
    'Deferred non-critical items to the next planning cycle.',
  ].slice(0, 2 + (seed % 2));

  const participants = ['You', 'PM', 'Eng Lead', 'Design', 'Marketing']
    .slice(0, 3 + (seed % 3));

  return {
    summary,
    keyPoints: keyPoints.slice(0, 5),
    actionItems,
    decisions,
    participants,
  };
}

// ---------- Task Planner ----------

const PRIORITY_WEIGHT: Record<Task['priority'], number> = { high: 3, medium: 2, low: 1 };
const ENERGY_ORDER: Task['energy'][] = ['focus', 'communication', 'routine'];

function generatePlanner(input: PlannerInput): PlannerOutput {
  const startMins = toMinutes(input.workStart || '09:00');
  const endMins = toMinutes(input.workEnd || '17:00');
  const lunchBreak = 60;

  const sorted = [...input.tasks].sort((a, b) => {
    const p = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
    if (p !== 0) return p;
    return a.due.localeCompare(b.due);
  });

  // Morning focus block, then comms, then routine — with a lunch break midday.
  const ordered = [...sorted].sort((a, b) => {
    if (a.energy !== b.energy) return ENERGY_ORDER.indexOf(a.energy) - ENERGY_ORDER.indexOf(b.energy);
    return PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
  });

  const schedule: ScheduledBlock[] = [];
  let cursor = startMins;
  let lunchInserted = false;

  for (const task of ordered) {
    if (!lunchInserted && cursor >= 12 * 60) {
      schedule.push({
        time: toHHMM(cursor),
        end: toHHMM(cursor + lunchBreak),
        title: 'Lunch break',
        priority: 'low',
        energy: 'routine',
        durationMin: lunchBreak,
      });
      cursor += lunchBreak;
      lunchInserted = true;
    }
    if (cursor + task.durationMin > endMins) break;
    schedule.push({
      time: toHHMM(cursor),
      end: toHHMM(cursor + task.durationMin),
      title: task.title,
      priority: task.priority,
      energy: task.energy,
      durationMin: task.durationMin,
    });
    cursor += task.durationMin;
    // 5-min buffer between deep tasks
    if (task.energy === 'focus' && cursor < endMins) cursor += 5;
  }

  const topPriorities = sorted
    .filter((t) => t.priority === 'high')
    .slice(0, 3)
    .map((t) => `${t.title} (due ${t.due})`);
  if (topPriorities.length === 0 && sorted[0]) topPriorities.push(`${sorted[0].title} (due ${sorted[0].due})`);

  const suggestions: string[] = [];
  const focusCount = ordered.filter((t) => t.energy === 'focus').length;
  if (focusCount > 2) suggestions.push('You have multiple deep-focus tasks — consider blocking a 90-minute morning slot with notifications off.');
  if (ordered.some((t) => t.priority === 'high' && t.due === 'Today'))
    suggestions.push("High-priority items due today are scheduled first; avoid context-switching before they're done.");
  if (schedule.length < ordered.length)
    suggestions.push(`Your work window can't fit all ${ordered.length} tasks. Consider deferring ${ordered.length - schedule.length} low-priority item(s) or extending your end time.`);
  if (suggestions.length === 0) suggestions.push('Your day is well balanced — high-priority work is front-loaded with time for communication and routine tasks.');

  return {
    schedule,
    topPriorities,
    suggestions,
    totalScheduledMin: schedule.reduce((s, b) => s + b.durationMin, 0),
  };
}

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}
function toHHMM(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

// ---------- Research ----------

const RESEARCH_LIBRARY: Record<string, { overview: string; insights: { title: string; detail: string }[]; terms: { term: string; definition: string }[] }> = {
  default: {
    overview:
      'This topic sits at the intersection of strategy, execution, and measurement. Current thinking emphasizes alignment between teams, data-driven decision-making, and iterative delivery as the core drivers of durable outcomes.',
    insights: [
      { title: 'Alignment drives velocity', detail: 'Teams with shared goals and clear ownership ship faster and with fewer rework cycles.' },
      { title: 'Measurement enables iteration', detail: 'Defining leading indicators early allows course-correction before lagging metrics reveal problems.' },
      { title: 'Compounding small wins', detail: 'Consistent, incremental improvements outperform sporadic large initiatives over a quarter.' },
    ],
    terms: [
      { term: 'Leading indicator', definition: 'A measurable signal that predicts future outcomes, enabling proactive adjustment.' },
      { term: 'Stakeholder alignment', definition: 'Shared agreement across decision-makers on goals, scope, and success criteria.' },
      { term: 'Iterative delivery', definition: 'Releasing work in small increments to validate assumptions and reduce risk.' },
    ],
  },
};

function generateResearch(input: ResearchInput): ResearchOutput {
  const lib = RESEARCH_LIBRARY.default;
  const depthCount = input.depth === 'brief' ? 2 : input.depth === 'standard' ? 3 : 4;
  const overview = `${lib.overview} The following analysis is tailored to "${input.topic}" at a ${input.depth} depth.`;

  const insights = lib.insights.slice(0, depthCount).map((i) => ({
    ...i,
    detail: `${i.detail} In the context of ${input.topic}, this means prioritizing clarity and feedback loops.`,
  }));

  const summary = `In summary, "${input.topic}" succeeds when teams align on outcomes, measure progress early, and ship incrementally. The highest-leverage next step is defining a single leading indicator and reviewing it weekly.`;

  const followUp = [
    `What are the top risks for ${input.topic} over the next 30 days?`,
    `How should success be measured for ${input.topic}?`,
    `Which frameworks best fit a ${input.depth}-depth analysis of ${input.topic}?`,
  ];

  return {
    overview,
    insights,
    keyTerms: lib.terms,
    summary,
    followUp,
  };
}

// ---------- Chat ----------

function generateChatReply(history: ChatMessage[], userText: string): string {
  const t = userText.toLowerCase();
  if (/\b(hi|hello|hey|good (morning|afternoon))\b/.test(t))
    return "Hello! I'm Atlas, your AI workplace assistant. I can help you draft emails, summarize meetings, plan your day, or research a topic. What would you like to work on?";
  if (/email|draft|write.*message/.test(t))
    return "I can draft that for you. Could you share the topic, who it's for, and the tone you'd like (professional, friendly, persuasive, apologetic, or urgent)? You can also use the Smart Email Generator from the sidebar for a structured form.";
  if (/meeting|notes|summary/.test(t))
    return "To summarize a meeting, paste the transcript or notes into the Meeting Notes Summarizer and I'll extract key points, decisions, and action items with owners and deadlines.";
  if (/task|plan|schedule|priorit/.test(t))
    return "For planning, open the AI Task Planner and add your tasks with priority, duration, and due date. I'll sequence them by priority and energy level and build a day schedule around your work hours.";
  if (/research|analyze|insight/.test(t))
    return "I can help with research. Tell me the topic and how deep you'd like to go (brief, standard, or deep), and I'll surface an overview, insights, key terms, and follow-up questions.";
  if (/thank/.test(t)) return "You're welcome! Let me know what you'd like to tackle next.";
  if (/\?/.test(userText))
    return `That's a great question. Here's a structured take: start by clarifying the goal, identify the key constraints, and then outline 2-3 options with trade-offs. If you'd like, I can expand any of these into a detailed plan.`;
  return `I've noted: "${userText}". Here's how I'd approach it — break it into three steps (understand, plan, execute), define what "done" looks like, and identify the first small action you can take today. Want me to turn this into a task plan?`;
}

// ---------- Public API with simulated latency ----------

function delay<T>(value: T, min = 700, max = 1400): Promise<T> {
  const ms = min + Math.floor(Math.random() * (max - min));
  return new Promise((res) => setTimeout(() => res(value), ms));
}

export const ai = {
  email: (i: EmailInput) => delay(generateEmail(i)),
  meeting: (i: MeetingInput) => delay(generateMeeting(i), 900, 1600),
  planner: (i: PlannerInput) => delay(generatePlanner(i), 800, 1500),
  research: (i: ResearchInput) => delay(generateResearch(i), 1000, 1800),
  chat: (history: ChatMessage[], text: string) => delay(generateChatReply(history, text), 600, 1200),
};
