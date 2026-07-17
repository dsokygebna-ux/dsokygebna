import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="العودة إلى أعلى الصفحة"
      className="fixed bottom-24 left-5 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-card transition hover:scale-105 hover:bg-secondary animate-fade-in"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
