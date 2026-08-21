import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Sparkles, Send, ArrowDown } from 'lucide-react';
import { PageHeader, Disclaimer, LoadingDots } from '@/components/Shell';
import { ai, type ChatMessage } from '@/lib/ai';

const SUGGESTIONS = [
  'Help me prioritize my week',
  'Summarize what a product manager does',
  'Draft a polite follow-up email',
  'How do I run an effective 1:1?',
];

let msgCounter = 0;
function makeMsg(role: ChatMessage['role'], content: string): ChatMessage {
  msgCounter += 1;
  return { id: `m${msgCounter}`, role, content, timestamp: Date.now() };
}

export function ChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    makeMsg(
      'assistant',
      "Hi! I'm Atlas, your AI workplace assistant. Ask me anything about emails, meetings, planning, or research — or pick a suggestion below."
    ),
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  function handleScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setShowScrollBtn(!nearBottom && el.scrollHeight > el.clientHeight + 100);
  }

  function scrollToBottom() {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const userMsg = makeMsg('user', content);
    const history = [...messages, userMsg];
    setMessages(history);
    setInput('');
    setLoading(true);
    const reply = await ai.chat(history, content);
    setMessages((prev) => [...prev, makeMsg('assistant', reply)]);
    setLoading(false);
  }

  return (
    <div className="animate-fade-up flex flex-col h-[calc(100vh-7rem)] lg:h-[calc(100vh-3rem)]">
      <PageHeader
        title="AI Chatbot"
        subtitle="Ask anything and get structured, actionable guidance."
        icon={MessageSquare}
        accent="bg-brand-50 text-brand-600"
      />

      <div className="card flex-1 flex flex-col overflow-hidden min-h-0">
        {/* Messages */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5 relative"
        >
          {messages.map((m) => (
            <MessageBubble key={m.id} msg={m} />
          ))}
          {loading && (
            <div className="flex gap-3 animate-fade-in">
              <Avatar role="assistant" />
              <div className="flex items-center gap-2 pt-1">
                <LoadingDots label="Atlas is thinking…" />
              </div>
            </div>
          )}
          {showScrollBtn && (
            <button
              onClick={scrollToBottom}
              className="sticky bottom-2 left-1/2 -translate-x-1/2 btn-outline p-2 rounded-full shadow-pop bg-white"
              aria-label="Scroll to latest"
            >
              <ArrowDown size={16} />
            </button>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="px-4 sm:px-6 pb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="chip bg-brand-50 text-brand-700 hover:bg-brand-100 transition border border-brand-100"
              >
                <Sparkles size={12} /> {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-ink-100 p-3 sm:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-end gap-2"
          >
            <textarea
              className="input resize-none min-h-[44px] max-h-32 py-3 leading-relaxed"
              placeholder="Message Atlas…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
            />
            <button
              type="submit"
              className="btn-accent p-3 rounded-xl shrink-0"
              disabled={!input.trim() || loading}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
          <Disclaimer className="mt-2.5 px-1" />
        </div>
      </div>
    </div>
  );
}

function Avatar({ role }: { role: ChatMessage['role'] }) {
  if (role === 'user') {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-accent-400 flex items-center justify-center text-white font-semibold text-xs shrink-0">
        AK
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-xl bg-ink-900 flex items-center justify-center shrink-0">
      <Sparkles size={16} className="text-brand-300" />
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 animate-fade-up ${isUser ? 'flex-row-reverse' : ''}`}>
      <Avatar role={msg.role} />
      <div className={`max-w-[80%] ${isUser ? 'items-end' : ''}`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? 'bg-brand-600 text-white rounded-tr-md'
              : 'bg-ink-100 text-ink-800 rounded-tl-md'
          }`}
        >
          {msg.content}
        </div>
        <div className={`text-[11px] text-ink-400 mt-1 px-1 ${isUser ? 'text-right' : ''}`}>
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
