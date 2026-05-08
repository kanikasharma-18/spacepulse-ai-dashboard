import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageCircle, X, Send, Trash2, Sparkles, User,
  ChevronDown, Brain,
} from 'lucide-react';
import { askAI } from '../services/aiService';
import { getISSPosition } from '../services/issService';
import { getSpaceNews } from '../services/newsService';
import { getAstronauts } from '../services/astroService';

// ─── localStorage helpers ───────────────────────────────────────────────────
const LS_KEY = 'spacepulse_chat_history';
const MAX_STORED = 30;

function loadHistory() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(msgs) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(msgs.slice(-MAX_STORED)));
  } catch { /* quota exceeded — ignore */ }
}

// ─── Initial welcome message ────────────────────────────────────────────────
const WELCOME = {
  id: 'welcome',
  role: 'assistant',
  text: "👋 Hi! I'm SpacePulse AI. I can answer questions about the current ISS position, speed, location, crew aboard, and the latest space news shown in the dashboard. What would you like to know?",
  ts: Date.now(),
};

// ─── Suggestion chips ───────────────────────────────────────────────────────
const CHIPS = [
  'Where is the ISS right now?',
  'How fast is the ISS moving?',
  'Who is on the ISS?',
  'What are the latest space news?',
];

// ─── Timestamp formatter ─────────────────────────────────────────────────────
function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function FloatingChatbot() {
  useEffect(() => {
    console.log('FloatingChatbot mounted');
  }, []);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    const hist = loadHistory();
    return hist.length > 0 ? hist : [WELCOME];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [atBottom, setAtBottom] = useState(true);

  const bottomRef = useRef(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Persist to localStorage whenever messages change
  useEffect(() => {
    saveHistory(messages);
  }, [messages]);

  // Auto-scroll to bottom when open and messages update
  useEffect(() => {
    if (open && atBottom) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, open, atBottom]);

  // Clear unread on open
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  // Track scroll position
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const dist = el.scrollHeight - el.scrollTop - el.clientHeight;
    setAtBottom(dist < 60);
  }, []);

  // ── Gather live dashboard context ─────────────────────────────────────────
  async function gatherContext() {
    const ctx = {};
    try {
      const iss = await getISSPosition();
      ctx.latitude = iss.latitude?.toFixed(4);
      ctx.longitude = iss.longitude?.toFixed(4);
      ctx.altitude = iss.altitude?.toFixed(2);
      ctx.velocity = iss.velocity?.toFixed(2);
      ctx.visibility = iss.visibility;

      const astros = await getAstronauts();
      ctx.crew = astros.count;
      ctx.astronauts = astros.names;
    } catch { /* use what we have */ }

    try {
      const news = await getSpaceNews(6);
      ctx.newsTitles = news.map(n => n.title).join('; ');
      ctx.newsDescriptions = news.map(n => n.summary).join('; ');
      ctx.newsCategories = [...new Set(news.map(n => n.category))].join(', ');
    } catch { /* use what we have */ }

    return ctx;
  }

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    const userMsg = { id: Date.now(), role: 'user', text: userText, ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setAtBottom(true);

    // Increment unread if panel is closed
    if (!open) setUnread(u => u + 1);

    try {
      const ctx = await gatherContext();
      const reply = await askAI(userText, ctx);

      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: reply,
        ts: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);
      if (!open) setUnread(u => u + 1);
    } catch (err) {
      const errMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        text: err.message || 'AI service is temporarily unavailable. Please try again later.',
        ts: Date.now(),
        isError: true,
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, loading, open]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([WELCOME]);
    localStorage.removeItem(LS_KEY);
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    setAtBottom(true);
  };

  return (
    <>
      {/* ── Floating Panel ───────────────────────────────────────────────── */}
      <div
        className={`
          fixed bottom-24 right-4 sm:right-6 z-[1000]
          w-[calc(100vw-2rem)] sm:w-96 max-h-[75vh]
          flex flex-col
          rounded-2xl overflow-hidden
          border border-white/10
          shadow-2xl
          transition-all duration-300 origin-bottom-right
          ${open ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none'}
        `}
        style={{
          background: 'linear-gradient(135deg, rgba(9,13,26,0.97) 0%, rgba(15,22,41,0.97) 100%)',
          backdropFilter: 'blur(20px)',
        }}
        aria-label="SpacePulse AI Chatbot"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.03] flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-space-500 to-cosmos-500 flex items-center justify-center shadow-glow-sm">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <p className="font-display font-semibold text-sm text-white leading-tight">SpacePulse AI</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                Dashboard-aware · Context only
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              title="Clear chat"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
            >
              <Trash2 size={13} />
            </button>
            <button
              onClick={() => setOpen(false)}
              title="Close"
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
          style={{ minHeight: 0 }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className={`w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center
                ${msg.role === 'assistant'
                  ? 'bg-gradient-to-br from-space-500 to-cosmos-500'
                  : 'bg-gradient-to-br from-nebula-500 to-space-600'}`}
              >
                {msg.role === 'assistant'
                  ? <Sparkles size={11} className="text-white" />
                  : <User size={11} className="text-white" />
                }
              </div>

              {/* Bubble + timestamp */}
              <div className={`flex flex-col gap-0.5 max-w-[82%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`
                  px-3 py-2.5 rounded-2xl text-sm leading-relaxed
                  ${msg.role === 'user'
                    ? 'bg-gradient-to-br from-space-500 to-cosmos-600 text-white rounded-br-sm'
                    : msg.isError
                      ? 'bg-red-500/10 border border-red-500/20 text-red-300 rounded-bl-sm'
                      : 'bg-white/[0.06] border border-white/[0.08] text-slate-200 rounded-bl-sm'
                  }
                `}>
                  {msg.text}
                </div>
                <span className="text-[9px] text-slate-600 px-1">{fmtTime(msg.ts)}</span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex items-end gap-2 animate-fade-in">
              <div className="w-6 h-6 rounded-lg flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-space-500 to-cosmos-500">
                <Brain size={11} className="text-white" />
              </div>
              <div className="px-3 py-2.5 rounded-2xl rounded-bl-sm bg-white/[0.06] border border-white/[0.08] flex items-center gap-1">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="w-1.5 h-1.5 rounded-full bg-space-400 animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Scroll-to-bottom hint */}
        {!atBottom && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-20 right-4 w-8 h-8 rounded-full bg-space-500/80 border border-space-400/30 flex items-center justify-center text-white shadow-lg hover:bg-space-500 transition-all duration-200"
          >
            <ChevronDown size={14} />
          </button>
        )}

        {/* Suggestion chips (only when first message) */}
        {messages.length === 1 && !loading && (
          <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
            {CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                className="text-[11px] px-2.5 py-1 rounded-full border border-space-500/30 bg-space-500/10 text-space-300 hover:bg-space-500/25 hover:text-white transition-all duration-200"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="px-3 pb-3 pt-2 border-t border-white/10 flex-shrink-0">
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              id="chatbot-input"
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask about ISS or space news…"
              className="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-600 resize-none focus:outline-none focus:border-space-500/50 transition-all duration-200"
              style={{ maxHeight: '100px' }}
            />
            <button
              id="chatbot-send"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-space-500 to-cosmos-500 flex items-center justify-center text-white hover:opacity-90 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
          <p className="text-[9px] text-slate-700 mt-1.5 text-center">
            Enter to send · restricted to dashboard data · last {Math.min(messages.length - 1, MAX_STORED)} msgs stored
          </p>
        </div>
      </div>

      {/* ── Floating Button ───────────────────────────────────────────────── */}
      <button
        id="chatbot-toggle"
        onClick={() => setOpen(o => !o)}
        aria-label="Toggle SpacePulse AI Chatbot"
        className={`
          fixed bottom-6 right-4 sm:right-6 z-[1000]
          w-14 h-14 rounded-2xl
          flex items-center justify-center
          bg-gradient-to-br from-space-500 to-cosmos-500
          shadow-lg shadow-space-500/30
          hover:scale-110 active:scale-95
          transition-all duration-200
          ${open ? 'rotate-12' : ''}
        `}
      >
        {open
          ? <X size={22} className="text-white" />
          : <MessageCircle size={22} className="text-white" />
        }
        {/* Unread badge */}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
    </>
  );
}
