import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, X, Facebook } from "lucide-react";
import { siteConfig, waLink } from "@/config/site";

const AUTO_REPLY = `👋 أهلاً وسهلاً بك في الدسوقي لمنتجات الألبان.

يسعدنا اهتمامك بمنتجاتنا. نحن نقدم أجود أنواع الجبن ومنتجات الألبان بجودة عالية وأسعار مميزة، ونحرص دائماً على تقديم أفضل خدمة لعملائنا.

📲 للتواصل المباشر وطلب المنتجات أو الاستفسار عن الأسعار اضغط على زر (واتساب).

📘 لمتابعة أحدث العروض والمنشورات اضغط على زر (فيسبوك).

🎵 لمشاهدة أحدث الفيديوهات والمحتوى اضغط على زر (تيك توك).

💙 شكراً لزيارتك لموقعنا، ونتمنى أن تنال منتجاتنا إعجابك. نحن سعداء بخدمتك في أي وقت.`;

type Msg = { id: number; role: "user" | "bot"; text: string; showActions?: boolean };

function TikTokIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.5 3a5.5 5.5 0 0 0 5 5v3a8.4 8.4 0 0 1-5-1.6v6.6a6 6 0 1 1-6-6c.34 0 .67.03 1 .09v3.1a3 3 0 1 0 2 2.83V3h3z" />
    </svg>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(1);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ id: idRef.current++, role: "bot", text: AUTO_REPLY, showActions: true }]);
    }
  }, [open, msgs.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    const t = input.trim();
    if (!t) return;
    setMsgs((m) => [...m, { id: idRef.current++, role: "user", text: t }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, { id: idRef.current++, role: "bot", text: AUTO_REPLY, showActions: true }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating button */}
      <button
        aria-label="افتح الدردشة"
        onClick={() => setOpen((v) => !v)}
        className="animate-soft-pulse fixed bottom-5 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#3aa0c9] text-white shadow-card transition hover:scale-105"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-7 w-7" />}
      </button>

      {/* Chat window */}
      <div
        dir="rtl"
        className={`fixed bottom-24 right-5 z-50 w-[min(92vw,22rem)] origin-bottom-right overflow-hidden rounded-3xl border border-white/50 bg-white/80 shadow-card backdrop-blur-xl transition-all duration-300 sm:w-[24rem] ${
          open ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-90 opacity-0"
        }`}
        style={{ backdropFilter: "blur(18px) saturate(140%)" }}
      >
        <header className="flex items-center justify-between gap-2 bg-gradient-to-l from-primary to-[#3aa0c9] px-4 py-3 text-white">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-white/20">
              <MessageCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-extrabold">الدسوقي لمنتجات الألبان</div>
              <div className="text-[11px] opacity-90">متصل الآن</div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="إغلاق" className="rounded-full p-1 hover:bg-white/20">
            <X className="h-5 w-5" />
          </button>
        </header>

        <div ref={scrollRef} className="max-h-[55vh] min-h-[18rem] overflow-y-auto bg-gradient-to-b from-white/40 to-white/10 px-3 py-3">
          {msgs.map((m) => (
            <div key={m.id} className={`mb-2 flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "rounded-bl-sm bg-primary text-primary-foreground"
                    : "rounded-br-sm bg-white text-foreground"
                }`}
              >
                {m.text}
                {m.showActions && (
                  <div className="mt-3 flex flex-col gap-2">
                    <a
                      href={waLink()} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-whatsapp)] px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:opacity-90"
                    >
                      <MessageCircle className="h-4 w-4" /> تواصل عبر واتساب
                    </a>
                    <a
                      href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1877f2] px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:opacity-90"
                    >
                      <Facebook className="h-4 w-4" /> مشاهدة منشورات فيسبوك
                    </a>
                    <a
                      href={siteConfig.social.tiktok} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#111] px-4 py-2.5 text-sm font-bold text-white shadow-soft transition hover:opacity-90"
                    >
                      <TikTokIcon className="h-4 w-4" /> مشاهدة فيديوهات تيك توك
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
          {typing && (
            <div className="mb-2 flex justify-end">
              <div className="rounded-2xl rounded-br-sm bg-white px-3 py-3 shadow-sm">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={send} className="flex items-center gap-2 border-t border-white/50 bg-white/70 p-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="اكتب رسالتك…"
            className="flex-1 rounded-full border border-border/70 bg-white px-4 py-2 text-sm outline-none focus:border-primary"
            aria-label="رسالتك"
            maxLength={500}
          />
          <button
            type="submit"
            aria-label="إرسال"
            className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground shadow-soft transition hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </>
  );
}
