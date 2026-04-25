import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Volume2, VolumeX, Mic, MicOff, RotateCcw } from "lucide-react";
import { useRole, ROLE_META } from "@/context/RoleContext";
import { useChatHistory } from "@/context/ChatHistoryContext";
import { api } from "@/lib/api";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  time: string;
  sources?: Array<{
    title: string;
    source: string;
    date: string;
    link: string;
    summary: string;
  }>;
}

const ROLE_SUGGESTIONS: Record<string, string[]> = {
  "Institute Owner": [
    "What's the biggest threat to me today?",
    "Which competitor should I worry about most?",
    "Give me a 7-day action plan",
    "What opportunities should I act on now?",
  ],
  "Backend Developer": [
    "What backend frameworks are trending?",
    "Any new cloud infrastructure news?",
    "What's the biggest tech shift this week?",
    "Give me a 7-day action plan",
  ],
  "Data Engineer": [
    "What ETL tools are trending?",
    "Any news on real-time analytics platforms?",
    "What's happening in AI data infrastructure?",
    "Give me a 7-day action plan",
  ],
  "Founder / Entrepreneur": [
    "What startups got funded this week?",
    "Any major EdTech acquisitions?",
    "What's the biggest market gap right now?",
    "Give me a 7-day action plan",
  ],
  "Product Builder": [
    "What product launches happened today?",
    "Any new no-code tools worth watching?",
    "What UX trends are emerging?",
    "Give me a 7-day action plan",
  ],
};

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function stripMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .trim();
}

function speak(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(stripMarkdown(text));
  utt.lang = "en-US";
  utt.rate = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v =>
    v.lang === "en-US" && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha"))
  ) || voices.find(v => v.lang.startsWith("en"));
  if (preferred) utt.voice = preferred;
  window.speechSynthesis.speak(utt);
}

function stopSpeaking() {
  if (typeof window !== "undefined") window.speechSynthesis?.cancel();
}

// Inline chatbot — rendered inside the recommendations page
export function InlineChatbot() {
  const { role } = useRole();
  const meta = ROLE_META[role];
  const { messages, addMessage } = useChatHistory();
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognRef = useRef<{ stop: () => void } | null>(null);

  // Check for URL query parameter on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const prompt = params.get("prompt");
      if (prompt) {
        setInput(prompt);
        // Clear the URL parameter
        window.history.replaceState({}, "", window.location.pathname);
        // Auto-focus the input
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Reset on role change
  useEffect(() => {
    stopSpeaking();
  }, [role]);

  const send = async (text: string) => {
    if (!text.trim() || typing) return;
    stopSpeaking();
    setInput("");
    const userMsg: Message = { id: Date.now().toString(), role: "user", text, time: now() };
    addMessage(userMsg);
    setTyping(true);

    try {
      const history = messages.slice(-6).map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
      const res = await api.chat({ role, message: text, history, competitors: {} });
      const reply: Message = { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        text: res.reply, 
        time: now(),
        sources: res.sources || []
      };
      addMessage(reply);
      if (autoSpeak) speak(res.reply);
    } catch (e) {
      const errText = (e as Error).message.includes("fetch")
        ? "Cannot reach the backend. Make sure the FastAPI server is running on port 8000 (`uvicorn api:app --reload`)."
        : `Error: ${(e as Error).message}`;
      const errMsg: Message = {
        id: (Date.now() + 1).toString(), role: "assistant",
        text: errText,
        time: now(),
      };
      addMessage(errMsg);
    } finally {
      setTyping(false);
    }
  };

  const startListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SRClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SRClass) { alert("Voice input not supported. Use Chrome."); return; }
    stopSpeaking();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recog = new SRClass() as any;
    recog.lang = "en-US";
    recog.continuous = false;
    recog.interimResults = false;
    recog.onstart = () => setListening(true);
    recog.onend = () => setListening(false);
    recog.onerror = () => setListening(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recog.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript as string;
      setInput(transcript);
      setTimeout(() => send(transcript), 400);
    };
    recog.start();
    recognRef.current = recog;
  };

  const stopListening = () => {
    recognRef.current?.stop();
    setListening(false);
  };

  const replayLast = () => {
    const last = [...messages].reverse().find(m => m.role === "assistant");
    if (last) speak(last.text);
  };

  const suggestions = ROLE_SUGGESTIONS[role] ?? ROLE_SUGGESTIONS["Institute Owner"];

  return (
    <div className="glass neon-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/50 px-5 py-4">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)]">
          <Bot className="h-5 w-5 text-white" />
          <span className="absolute -right-1 -bottom-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[oklch(0.78_0.2_155)]">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            Campus Cortex AI Advisor
            <Sparkles className="h-3 w-3 text-[oklch(0.85_0.18_200)]" />
          </div>
          <div className="text-[10px] text-muted-foreground">
            Grounded in your live report · <span style={{ color: meta.color }}>{role}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setAutoSpeak(a => !a); stopSpeaking(); }}
            title={autoSpeak ? "Auto-speak ON" : "Auto-speak OFF"}
            className={`grid h-7 w-7 place-items-center rounded-lg border border-border/60 transition-colors ${autoSpeak ? "bg-[oklch(0.7_0.24_255/0.2)] text-[oklch(0.85_0.18_200)]" : "bg-white/5 text-muted-foreground hover:text-foreground"}`}
          >
            {autoSpeak ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={replayLast}
            disabled={!messages.some(m => m.role === "assistant")}
            title="Replay last response"
            className="grid h-7 w-7 place-items-center rounded-lg border border-border/60 bg-white/5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="h-80 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="text-3xl">🧠</div>
            <div>
              <p className="text-sm font-medium">Ask me anything about today's intelligence</p>
              <p className="text-xs text-muted-foreground mt-1">Type, press Enter, or tap 🎤 to speak</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-border/60 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) => (
          <div key={m.id} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            <button
              onClick={() => m.role === "assistant" && speak(m.text)}
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${m.role === "assistant" ? "bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] text-white cursor-pointer hover:opacity-80" : "bg-white/10 text-foreground cursor-default"}`}
            >
              {m.role === "assistant" ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
            </button>
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${m.role === "assistant" ? "bg-white/5 text-foreground/90" : "bg-gradient-to-br from-[oklch(0.7_0.24_255/0.3)] to-[oklch(0.65_0.28_300/0.3)] text-foreground"}`}>
              <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
              <div className="mt-1 text-[10px] text-muted-foreground">{m.time}</div>
              {m.role === "assistant" && m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">📰 Sources & References:</p>
                  {m.sources.slice(0, 5).map((src, idx) => (
                    <div key={idx} className="text-[9px] bg-white/5 rounded-lg p-2 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="font-semibold text-foreground/90 line-clamp-2">{src.title}</div>
                          <div className="text-muted-foreground/80 mt-0.5">
                            <span className="font-medium text-[oklch(0.85_0.18_200)]">{src.source}</span>
                            <span className="mx-1">•</span>
                            <span>{src.date}</span>
                          </div>
                        </div>
                      </div>
                      {src.summary && (
                        <div className="text-muted-foreground/70 line-clamp-2 italic">{src.summary}</div>
                      )}
                      {src.link && (
                        <a 
                          href={src.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[oklch(0.7_0.24_255)] hover:text-[oklch(0.7_0.24_255/0.8)] hover:underline transition-colors"
                        >
                          Read full article →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {typing && (
          <div className="flex gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] text-white">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <div className="flex items-center gap-1 rounded-2xl bg-white/5 px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}

        {listening && (
          <div className="flex gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[oklch(0.72_0.27_340)] text-white">
              <Mic className="h-3.5 w-3.5" />
            </div>
            <div className="rounded-2xl bg-[oklch(0.72_0.27_340/0.15)] px-4 py-3 text-xs text-[oklch(0.72_0.27_340)]">
              Listening… speak now
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border/50 px-4 py-3">
        <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
          <button
            type="button"
            onClick={listening ? stopListening : startListening}
            disabled={typing}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 transition-colors disabled:opacity-40 ${listening ? "bg-[oklch(0.72_0.27_340/0.2)] text-[oklch(0.72_0.27_340)] border-[oklch(0.72_0.27_340/0.4)]" : "bg-white/5 text-muted-foreground hover:text-foreground"}`}
          >
            {listening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={listening ? "Listening…" : "Ask about today's market intelligence…"}
            disabled={typing || listening}
            className="flex-1 rounded-xl border border-border/60 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:border-[oklch(0.7_0.24_255/0.6)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.7_0.24_255/0.2)] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || typing}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] text-white shadow-[0_0_16px_oklch(0.7_0.24_265/0.4)] transition-opacity disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

// Floating chatbot — kept for other pages
export function AIChatbot() {
  const { role } = useRole();
  const meta = ROLE_META[role];
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (open) setMessages([]);
  }, [role]);

  const send = async (text: string) => {
    if (!text.trim() || typing) return;
    setInput("");
    const userMsg: Message = { id: Date.now().toString(), role: "user", text, time: now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setTyping(true);
    try {
      const history = newMessages.slice(-6).map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
      const res = await api.chat({ role, message: text, history, competitors: {} });
      setMessages(m => [...m, { 
        id: (Date.now() + 1).toString(), 
        role: "assistant", 
        text: res.reply, 
        time: now(),
        sources: res.sources || []
      }]);
    } catch (e) {
      const errText = (e as Error).message.includes("fetch")
        ? "Backend not running. Start with: uvicorn api:app --reload (port 8000)"
        : `Error: ${(e as Error).message}`;
      setMessages(m => [...m, { id: (Date.now() + 1).toString(), role: "assistant", text: errText, time: now() }]);
    } finally {
      setTyping(false);
    }
  };

  const suggestions = (ROLE_SUGGESTIONS[role] ?? ROLE_SUGGESTIONS["Institute Owner"]).slice(0, 3);

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] shadow-[0_0_32px_oklch(0.7_0.24_265/0.6)] ${open ? "hidden" : "flex"}`}
      >
        <Bot className="h-6 w-6 text-white" />
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[oklch(0.72_0.27_340)] text-[9px] font-bold text-white">AI</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="glass-strong fixed bottom-6 right-6 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border/60 shadow-[0_24px_80px_oklch(0.05_0.02_265/0.9)]"
            style={{ height: "500px" }}
          >
            <div className="flex items-center gap-3 border-b border-border/50 px-4 py-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)]">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold flex items-center gap-1.5">Campus Cortex AI <Sparkles className="h-3 w-3 text-[oklch(0.85_0.18_200)]" /></div>
                <div className="text-[10px] text-muted-foreground">Tuned for <span style={{ color: meta.color }}>{role}</span></div>
              </div>
              <button onClick={() => setOpen(false)} className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-white/10 hover:text-foreground">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <p className="text-sm text-muted-foreground">Ask about today's market intelligence</p>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {suggestions.map(s => (
                      <button key={s} onClick={() => send(s)} className="rounded-full border border-border/60 bg-white/5 px-2.5 py-1 text-[10px] text-muted-foreground hover:bg-white/10 hover:text-foreground">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map(m => (
                <div key={m.id} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${m.role === "assistant" ? "bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] text-white" : "bg-white/10"}`}>
                    {m.role === "assistant" ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${m.role === "assistant" ? "bg-white/5" : "bg-gradient-to-br from-[oklch(0.7_0.24_255/0.3)] to-[oklch(0.65_0.28_300/0.3)]"}`}>
                    <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                    <div className="mt-1 text-[10px] text-muted-foreground">{m.time}</div>
                    {m.role === "assistant" && m.sources && m.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">📰 Sources & References:</p>
                        {m.sources.slice(0, 4).map((src, idx) => (
                          <div key={idx} className="text-[9px] bg-white/5 rounded-lg p-2 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <div className="font-semibold text-foreground/90 line-clamp-2">{src.title}</div>
                                <div className="text-muted-foreground/80 mt-0.5">
                                  <span className="font-medium text-[oklch(0.85_0.18_200)]">{src.source}</span>
                                  <span className="mx-1">•</span>
                                  <span>{src.date}</span>
                                </div>
                              </div>
                            </div>
                            {src.summary && (
                              <div className="text-muted-foreground/70 line-clamp-2 italic">{src.summary}</div>
                            )}
                            {src.link && (
                              <a 
                                href={src.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[oklch(0.7_0.24_255)] hover:text-[oklch(0.7_0.24_255/0.8)] hover:underline transition-colors"
                              >
                                Read full article →
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-2.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex items-center gap-1 rounded-2xl bg-white/5 px-4 py-3">
                    {[0, 1, 2].map(i => <span key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-border/50 px-3 py-3">
              <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex items-center gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about trends, competitors…"
                  className="flex-1 rounded-xl border border-border/60 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:border-[oklch(0.7_0.24_255/0.6)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.7_0.24_255/0.2)]"
                />
                <button type="submit" disabled={!input.trim() || typing} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] text-white disabled:opacity-40">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
