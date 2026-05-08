import { useState, useRef, useEffect } from 'react';
import { Brain, Send, User, Sparkles, RefreshCw } from 'lucide-react';
import { getSpaceResponse } from '../services/huggingFaceService';

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'assistant',
    text: "Hello! I'm SpacePulse AI, your intelligent space exploration assistant. Ask me anything about astronomy, space missions, the ISS, planets, or the cosmos! 🚀",
  },
];

const SUGGESTIONS = [
  'What is the ISS and how many crew are on it?',
  'How far is Mars from Earth?',
  'Explain how black holes work',
  'What was the Apollo 11 mission?',
];

export default function Chatbot() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText) return;

    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
      const response = await getSpaceResponse(userText);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: response || 'I encountered an issue processing your question. Please try again.',
        },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          text: 'Sorry, I encountered an error connecting to the AI service. Please check your connection and try again. 🚀',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setInput('');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cosmos-500 to-nebula-400 flex items-center justify-center">
              <Brain size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-3xl text-white">
                AI <span className="text-gradient">Chatbot</span>
              </h1>
              <p className="text-sm text-slate-400">Space intelligence powered by AI</p>
            </div>
          </div>
          <button
            onClick={resetChat}
            id="reset-chat"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs text-slate-400 border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            <RefreshCw size={12} />
            Reset
          </button>
        </div>

        {/* Chat window */}
        <div className="glass-card flex flex-col" style={{ height: '60vh', minHeight: '400px' }}>
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 items-end animate-fade-in ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-br from-cosmos-500 to-nebula-400'
                    : 'bg-gradient-to-br from-space-500 to-space-700'
                }`}>
                  {msg.role === 'assistant'
                    ? <Sparkles size={14} className="text-white" />
                    : <User size={14} className="text-white" />
                  }
                </div>

                {/* Bubble */}
                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'assistant'
                    ? 'bg-white/5 border border-white/10 text-slate-200 rounded-bl-sm'
                    : 'bg-gradient-to-br from-space-500 to-cosmos-600 text-white rounded-br-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Loading bubble */}
            {loading && (
              <div className="flex gap-3 items-end animate-fade-in">
                <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-cosmos-500 to-nebula-400">
                  <Sparkles size={14} className="text-white" />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/5 border border-white/10 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-space-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-space-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-space-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestion chips */}
          {messages.length === 1 && (
            <div className="px-5 pb-3 flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-space-500/30 bg-space-500/10 text-space-300 hover:bg-space-500/20 hover:text-white transition-all duration-200"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-3">
              <textarea
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything about space..."
                rows={1}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 resize-none focus:outline-none focus:border-space-500/50 focus:bg-white/8 transition-all duration-200"
              />
              <button
                id="send-btn"
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-space-500 to-cosmos-500 flex items-center justify-center text-white hover:shadow-glow-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 self-end"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-[10px] text-slate-600 mt-2 text-center">
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
