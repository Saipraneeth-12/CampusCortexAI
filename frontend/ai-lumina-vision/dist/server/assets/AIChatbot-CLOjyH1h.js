import { r as reactExports, T as jsxRuntimeExports } from "./worker-entry-CCute6b2.js";
import { u as useRole, R as ROLE_META } from "./router-CPi72iO1.js";
import { a as api } from "./api-afpyfS2M.js";
import { M as MotionConfigContext, i as isHTMLElement, u as useConstant, P as PresenceContext, a as usePresence, b as useIsomorphicLayoutEffect, L as LayoutGroupContext, m as motion } from "./proxy-AGUjS2rb.js";
import { c as createLucideIcon } from "./createLucideIcon-BfcRJH-_.js";
import { S as Sparkles } from "./sparkles-C5R8qfhP.js";
const __iconNode$7 = [
  ["path", { d: "M12 8V4H8", key: "hb8ula" }],
  ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
  ["path", { d: "M2 14h2", key: "vft8re" }],
  ["path", { d: "M20 14h2", key: "4cs60a" }],
  ["path", { d: "M15 13v2", key: "1xurst" }],
  ["path", { d: "M9 13v2", key: "rq6x2g" }]
];
const Bot = createLucideIcon("bot", __iconNode$7);
const __iconNode$6 = [
  ["path", { d: "M12 19v3", key: "npa21l" }],
  ["path", { d: "M15 9.34V5a3 3 0 0 0-5.68-1.33", key: "1gzdoj" }],
  ["path", { d: "M16.95 16.95A7 7 0 0 1 5 12v-2", key: "cqa7eg" }],
  ["path", { d: "M18.89 13.23A7 7 0 0 0 19 12v-2", key: "16hl24" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }],
  ["path", { d: "M9 9v3a3 3 0 0 0 5.12 2.12", key: "r2i35w" }]
];
const MicOff = createLucideIcon("mic-off", __iconNode$6);
const __iconNode$5 = [
  ["path", { d: "M12 19v3", key: "npa21l" }],
  ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2", key: "1vc78b" }],
  ["rect", { x: "9", y: "2", width: "6", height: "13", rx: "3", key: "s6n7sd" }]
];
const Mic = createLucideIcon("mic", __iconNode$5);
const __iconNode$4 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode$4);
const __iconNode$3 = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode$3);
const __iconNode$2 = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
  ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }]
];
const User = createLucideIcon("user", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["path", { d: "M16 9a5 5 0 0 1 0 6", key: "1q6k2b" }],
  ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728", key: "ijwkga" }]
];
const Volume2 = createLucideIcon("volume-2", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["line", { x1: "22", x2: "16", y1: "9", y2: "15", key: "1ewh16" }],
  ["line", { x1: "16", x2: "22", y1: "9", y2: "15", key: "5ykzw1" }]
];
const VolumeX = createLucideIcon("volume-x", __iconNode);
function setRef(ref, value) {
  if (typeof ref === "function") {
    return ref(value);
  } else if (ref !== null && ref !== void 0) {
    ref.current = value;
  }
}
function composeRefs(...refs) {
  return (node) => {
    let hasCleanup = false;
    const cleanups = refs.map((ref) => {
      const cleanup = setRef(ref, node);
      if (!hasCleanup && typeof cleanup === "function") {
        hasCleanup = true;
      }
      return cleanup;
    });
    if (hasCleanup) {
      return () => {
        for (let i = 0; i < cleanups.length; i++) {
          const cleanup = cleanups[i];
          if (typeof cleanup === "function") {
            cleanup();
          } else {
            setRef(refs[i], null);
          }
        }
      };
    }
  };
}
function useComposedRefs(...refs) {
  return reactExports.useCallback(composeRefs(...refs), refs);
}
class PopChildMeasure extends reactExports.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const element = this.props.childRef.current;
    if (isHTMLElement(element) && prevProps.isPresent && !this.props.isPresent && this.props.pop !== false) {
      const parent = element.offsetParent;
      const parentWidth = isHTMLElement(parent) ? parent.offsetWidth || 0 : 0;
      const parentHeight = isHTMLElement(parent) ? parent.offsetHeight || 0 : 0;
      const computedStyle = getComputedStyle(element);
      const size = this.props.sizeRef.current;
      size.height = parseFloat(computedStyle.height);
      size.width = parseFloat(computedStyle.width);
      size.top = element.offsetTop;
      size.left = element.offsetLeft;
      size.right = parentWidth - size.width - size.left;
      size.bottom = parentHeight - size.height - size.top;
    }
    return null;
  }
  /**
   * Required with getSnapshotBeforeUpdate to stop React complaining.
   */
  componentDidUpdate() {
  }
  render() {
    return this.props.children;
  }
}
function PopChild({ children, isPresent, anchorX, anchorY, root, pop }) {
  const id = reactExports.useId();
  const ref = reactExports.useRef(null);
  const size = reactExports.useRef({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  });
  const { nonce } = reactExports.useContext(MotionConfigContext);
  const childRef = children.props?.ref ?? children?.ref;
  const composedRef = useComposedRefs(ref, childRef);
  reactExports.useInsertionEffect(() => {
    const { width, height, top, left, right, bottom } = size.current;
    if (isPresent || pop === false || !ref.current || !width || !height)
      return;
    const x = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
    const y = anchorY === "bottom" ? `bottom: ${bottom}` : `top: ${top}`;
    ref.current.dataset.motionPopId = id;
    const style = document.createElement("style");
    if (nonce)
      style.nonce = nonce;
    const parent = root ?? document.head;
    parent.appendChild(style);
    if (style.sheet) {
      style.sheet.insertRule(`
          [data-motion-pop-id="${id}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x}px !important;
            ${y}px !important;
          }
        `);
    }
    return () => {
      ref.current?.removeAttribute("data-motion-pop-id");
      if (parent.contains(style)) {
        parent.removeChild(style);
      }
    };
  }, [isPresent]);
  return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size, pop, children: pop === false ? children : reactExports.cloneElement(children, { ref: composedRef }) });
}
const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, anchorY, root }) => {
  const presenceChildren = useConstant(newChildrenMap);
  const id = reactExports.useId();
  let isReusedContext = true;
  let context = reactExports.useMemo(() => {
    isReusedContext = false;
    return {
      id,
      initial,
      isPresent,
      custom,
      onExitComplete: (childId) => {
        presenceChildren.set(childId, true);
        for (const isComplete of presenceChildren.values()) {
          if (!isComplete)
            return;
        }
        onExitComplete && onExitComplete();
      },
      register: (childId) => {
        presenceChildren.set(childId, false);
        return () => presenceChildren.delete(childId);
      }
    };
  }, [isPresent, presenceChildren, onExitComplete]);
  if (presenceAffectsLayout && isReusedContext) {
    context = { ...context };
  }
  reactExports.useMemo(() => {
    presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
  }, [isPresent]);
  reactExports.useEffect(() => {
    !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
  }, [isPresent]);
  children = jsxRuntimeExports.jsx(PopChild, { pop: mode === "popLayout", isPresent, anchorX, anchorY, root, children });
  return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
};
function newChildrenMap() {
  return /* @__PURE__ */ new Map();
}
const getChildKey = (child) => child.key || "";
function onlyElements(children) {
  const filtered = [];
  reactExports.Children.forEach(children, (child) => {
    if (reactExports.isValidElement(child))
      filtered.push(child);
  });
  return filtered;
}
const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", anchorY = "top", root }) => {
  const [isParentPresent, safeToRemove] = usePresence(propagate);
  const presentChildren = reactExports.useMemo(() => onlyElements(children), [children]);
  const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
  const isInitialRender = reactExports.useRef(true);
  const pendingPresentChildren = reactExports.useRef(presentChildren);
  const exitComplete = useConstant(() => /* @__PURE__ */ new Map());
  const exitingComponents = reactExports.useRef(/* @__PURE__ */ new Set());
  const [diffedChildren, setDiffedChildren] = reactExports.useState(presentChildren);
  const [renderedChildren, setRenderedChildren] = reactExports.useState(presentChildren);
  useIsomorphicLayoutEffect(() => {
    isInitialRender.current = false;
    pendingPresentChildren.current = presentChildren;
    for (let i = 0; i < renderedChildren.length; i++) {
      const key = getChildKey(renderedChildren[i]);
      if (!presentKeys.includes(key)) {
        if (exitComplete.get(key) !== true) {
          exitComplete.set(key, false);
        }
      } else {
        exitComplete.delete(key);
        exitingComponents.current.delete(key);
      }
    }
  }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
  const exitingChildren = [];
  if (presentChildren !== diffedChildren) {
    let nextChildren = [...presentChildren];
    for (let i = 0; i < renderedChildren.length; i++) {
      const child = renderedChildren[i];
      const key = getChildKey(child);
      if (!presentKeys.includes(key)) {
        nextChildren.splice(i, 0, child);
        exitingChildren.push(child);
      }
    }
    if (mode === "wait" && exitingChildren.length) {
      nextChildren = exitingChildren;
    }
    setRenderedChildren(onlyElements(nextChildren));
    setDiffedChildren(presentChildren);
    return null;
  }
  const { forceRender } = reactExports.useContext(LayoutGroupContext);
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
    const key = getChildKey(child);
    const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
    const onExit = () => {
      if (exitingComponents.current.has(key)) {
        return;
      }
      if (exitComplete.has(key)) {
        exitingComponents.current.add(key);
        exitComplete.set(key, true);
      } else {
        return;
      }
      let isEveryExitComplete = true;
      exitComplete.forEach((isExitComplete) => {
        if (!isExitComplete)
          isEveryExitComplete = false;
      });
      if (isEveryExitComplete) {
        forceRender?.();
        setRenderedChildren(pendingPresentChildren.current);
        propagate && safeToRemove?.();
        onExitComplete && onExitComplete();
      }
    };
    return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, anchorY, children: child }, key);
  }) });
};
const ROLE_SUGGESTIONS = {
  "Institute Owner": [
    "What's the biggest threat to me today?",
    "Which competitor should I worry about most?",
    "Give me a 7-day action plan",
    "What opportunities should I act on now?"
  ],
  "Backend Developer": [
    "What backend frameworks are trending?",
    "Any new cloud infrastructure news?",
    "What's the biggest tech shift this week?",
    "Give me a 7-day action plan"
  ],
  "Data Engineer": [
    "What ETL tools are trending?",
    "Any news on real-time analytics platforms?",
    "What's happening in AI data infrastructure?",
    "Give me a 7-day action plan"
  ],
  "Founder / Entrepreneur": [
    "What startups got funded this week?",
    "Any major EdTech acquisitions?",
    "What's the biggest market gap right now?",
    "Give me a 7-day action plan"
  ],
  "Product Builder": [
    "What product launches happened today?",
    "Any new no-code tools worth watching?",
    "What UX trends are emerging?",
    "Give me a 7-day action plan"
  ]
};
function now() {
  return (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function stripMarkdown(text) {
  return text.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\*(.*?)\*/g, "$1").replace(/#{1,6}\s/g, "").replace(/`{1,3}[^`]*`{1,3}/g, "").replace(/\n{2,}/g, ". ").replace(/\n/g, " ").trim();
}
function speak(text) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(stripMarkdown(text));
  utt.lang = "en-US";
  utt.rate = 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(
    (v) => v.lang === "en-US" && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha"))
  ) || voices.find((v) => v.lang.startsWith("en"));
  if (preferred) utt.voice = preferred;
  window.speechSynthesis.speak(utt);
}
function stopSpeaking() {
  if (typeof window !== "undefined") window.speechSynthesis?.cancel();
}
function InlineChatbot() {
  const { role } = useRole();
  const meta = ROLE_META[role];
  const [input, setInput] = reactExports.useState("");
  const [messages, setMessages] = reactExports.useState([]);
  const [typing, setTyping] = reactExports.useState(false);
  const [autoSpeak, setAutoSpeak] = reactExports.useState(false);
  const [listening, setListening] = reactExports.useState(false);
  const bottomRef = reactExports.useRef(null);
  const inputRef = reactExports.useRef(null);
  const recognRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);
  reactExports.useEffect(() => {
    setMessages([]);
    stopSpeaking();
  }, [role]);
  const send = async (text) => {
    if (!text.trim() || typing) return;
    stopSpeaking();
    setInput("");
    const userMsg = { id: Date.now().toString(), role: "user", text, time: now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setTyping(true);
    try {
      const history = newMessages.slice(-6).map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
      const res = await api.chat({ role, message: text, history });
      const reply = { id: (Date.now() + 1).toString(), role: "assistant", text: res.reply, time: now() };
      setMessages((m) => [...m, reply]);
      if (autoSpeak) speak(res.reply);
    } catch {
      const errMsg = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        text: "Backend not connected. Start the FastAPI server on port 8000 to enable live AI responses.",
        time: now()
      };
      setMessages((m) => [...m, errMsg]);
    } finally {
      setTyping(false);
    }
  };
  const startListening = () => {
    const SRClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SRClass) {
      alert("Voice input not supported. Use Chrome.");
      return;
    }
    stopSpeaking();
    const recog = new SRClass();
    recog.lang = "en-US";
    recog.continuous = false;
    recog.interimResults = false;
    recog.onstart = () => setListening(true);
    recog.onend = () => setListening(false);
    recog.onerror = () => setListening(false);
    recog.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
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
    const last = [...messages].reverse().find((m) => m.role === "assistant");
    if (last) speak(last.text);
  };
  const suggestions = ROLE_SUGGESTIONS[role] ?? ROLE_SUGGESTIONS["Institute Owner"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass neon-border rounded-2xl overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 border-b border-border/50 px-5 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-5 w-5 text-white" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -right-1 -bottom-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[oklch(0.78_0.2_155)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-white" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm font-semibold", children: [
          "Campus Cortex AI Advisor",
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-[oklch(0.85_0.18_200)]" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
          "Grounded in your live report · ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: meta.color }, children: role })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => {
              setAutoSpeak((a) => !a);
              stopSpeaking();
            },
            title: autoSpeak ? "Auto-speak ON" : "Auto-speak OFF",
            className: `grid h-7 w-7 place-items-center rounded-lg border border-border/60 transition-colors ${autoSpeak ? "bg-[oklch(0.7_0.24_255/0.2)] text-[oklch(0.85_0.18_200)]" : "bg-white/5 text-muted-foreground hover:text-foreground"}`,
            children: autoSpeak ? /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-3.5 w-3.5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: replayLast,
            disabled: !messages.some((m) => m.role === "assistant"),
            title: "Replay last response",
            className: "grid h-7 w-7 place-items-center rounded-lg border border-border/60 bg-white/5 text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3.5 w-3.5" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-80 overflow-y-auto px-4 py-3 space-y-3", children: [
      messages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full gap-4 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl", children: "🧠" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Ask me anything about today's intelligence" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Type, press Enter, or tap 🎤 to speak" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-2", children: suggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => send(s),
            className: "rounded-full border border-border/60 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground",
            children: s
          },
          s
        )) })
      ] }),
      messages.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => m.role === "assistant" && speak(m.text),
            className: `flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${m.role === "assistant" ? "bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] text-white cursor-pointer hover:opacity-80" : "bg-white/10 text-foreground cursor-default"}`,
            children: m.role === "assistant" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3.5 w-3.5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${m.role === "assistant" ? "bg-white/5 text-foreground/90" : "bg-gradient-to-br from-[oklch(0.7_0.24_255/0.3)] to-[oklch(0.65_0.28_300/0.3)] text-foreground"}`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "leading-relaxed whitespace-pre-wrap", children: m.text }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[10px] text-muted-foreground", children: m.time })
        ] })
      ] }, m.id)),
      typing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-3.5 w-3.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 rounded-2xl bg-white/5 px-4 py-3", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce", style: { animationDelay: `${i * 0.15}s` } }, i)) })
      ] }),
      listening && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[oklch(0.72_0.27_340)] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-3.5 w-3.5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl bg-[oklch(0.72_0.27_340/0.15)] px-4 py-3 text-xs text-[oklch(0.72_0.27_340)]", children: "Listening… speak now" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/50 px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
      e.preventDefault();
      send(input);
    }, className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: listening ? stopListening : startListening,
          disabled: typing,
          className: `flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/60 transition-colors disabled:opacity-40 ${listening ? "bg-[oklch(0.72_0.27_340/0.2)] text-[oklch(0.72_0.27_340)] border-[oklch(0.72_0.27_340/0.4)]" : "bg-white/5 text-muted-foreground hover:text-foreground"}`,
          children: listening ? /* @__PURE__ */ jsxRuntimeExports.jsx(MicOff, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: inputRef,
          value: input,
          onChange: (e) => setInput(e.target.value),
          placeholder: listening ? "Listening…" : "Ask about today's market intelligence…",
          disabled: typing || listening,
          className: "flex-1 rounded-xl border border-border/60 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:border-[oklch(0.7_0.24_255/0.6)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.7_0.24_255/0.2)] disabled:opacity-50"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: !input.trim() || typing,
          className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] text-white shadow-[0_0_16px_oklch(0.7_0.24_265/0.4)] transition-opacity disabled:opacity-40",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" })
        }
      )
    ] }) })
  ] });
}
function AIChatbot() {
  const { role } = useRole();
  const meta = ROLE_META[role];
  const [open, setOpen] = reactExports.useState(false);
  const [input, setInput] = reactExports.useState("");
  const [messages, setMessages] = reactExports.useState([]);
  const [typing, setTyping] = reactExports.useState(false);
  const bottomRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);
  reactExports.useEffect(() => {
    if (open) setMessages([]);
  }, [role]);
  const send = async (text) => {
    if (!text.trim() || typing) return;
    setInput("");
    const userMsg = { id: Date.now().toString(), role: "user", text, time: now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setTyping(true);
    try {
      const history = newMessages.slice(-6).map((m) => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));
      const res = await api.chat({ role, message: text, history });
      setMessages((m) => [...m, { id: (Date.now() + 1).toString(), role: "assistant", text: res.reply, time: now() }]);
    } catch {
      setMessages((m) => [...m, { id: (Date.now() + 1).toString(), role: "assistant", text: "Backend not connected. Start the FastAPI server on port 8000.", time: now() }]);
    } finally {
      setTyping(false);
    }
  };
  const suggestions = (ROLE_SUGGESTIONS[role] ?? ROLE_SUGGESTIONS["Institute Owner"]).slice(0, 3);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.button,
      {
        onClick: () => setOpen(true),
        whileHover: { scale: 1.08 },
        whileTap: { scale: 0.95 },
        className: "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] shadow-[0_0_32px_oklch(0.7_0.24_265/0.6)]",
        style: { display: open ? "none" : "flex" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-6 w-6 text-white" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[oklch(0.72_0.27_340)] text-[9px] font-bold text-white", children: "AI" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: open && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 24, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 24, scale: 0.96 },
        transition: { duration: 0.2 },
        className: "glass-strong fixed bottom-6 right-6 z-50 flex w-[360px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-border/60 shadow-[0_24px_80px_oklch(0.05_0.02_265/0.9)]",
        style: { height: "500px" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 border-b border-border/50 px-4 py-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-5 w-5 text-white" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-semibold flex items-center gap-1.5", children: [
                "Campus Cortex AI ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-3 w-3 text-[oklch(0.85_0.18_200)]" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-muted-foreground", children: [
                "Tuned for ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: meta.color }, children: role })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setOpen(false), className: "grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-white/10 hover:text-foreground", children: "✕" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-4 py-3 space-y-3", children: [
            messages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full gap-3 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Ask about today's market intelligence" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-center gap-1.5", children: suggestions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => send(s), className: "rounded-full border border-border/60 bg-white/5 px-2.5 py-1 text-[10px] text-muted-foreground hover:bg-white/10 hover:text-foreground", children: s }, s)) })
            ] }),
            messages.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${m.role === "assistant" ? "bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] text-white" : "bg-white/10"}`, children: m.role === "assistant" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-3.5 w-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm ${m.role === "assistant" ? "bg-white/5" : "bg-gradient-to-br from-[oklch(0.7_0.24_255/0.3)] to-[oklch(0.65_0.28_300/0.3)]"}`, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "leading-relaxed whitespace-pre-wrap", children: m.text }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[10px] text-muted-foreground", children: m.time })
              ] })
            ] }, m.id)),
            typing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "h-3.5 w-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 rounded-2xl bg-white/5 px-4 py-3", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce", style: { animationDelay: `${i * 0.15}s` } }, i)) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border/50 px-3 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: (e) => {
            e.preventDefault();
            send(input);
          }, className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: input,
                onChange: (e) => setInput(e.target.value),
                placeholder: "Ask about trends, competitors…",
                className: "flex-1 rounded-xl border border-border/60 bg-white/5 px-3 py-2 text-sm placeholder:text-muted-foreground/60 focus:border-[oklch(0.7_0.24_255/0.6)] focus:outline-none focus:ring-2 focus:ring-[oklch(0.7_0.24_255/0.2)]"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: !input.trim() || typing, className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[oklch(0.7_0.24_255)] to-[oklch(0.65_0.28_300)] text-white disabled:opacity-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-4 w-4" }) })
          ] }) })
        ]
      }
    ) })
  ] });
}
export {
  AnimatePresence as A,
  InlineChatbot as I,
  AIChatbot as a
};
