import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import {
  Phone, MapPin, Star, Send,
  Facebook, Instagram, Youtube, MessageCircle,
} from "lucide-react";

import logoAsset from "@/assets/logo.png.asset.json";
import hero from "@/assets/hero.jpg";
import { siteConfig, waLink, telLink } from "@/config/site";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BackToTop } from "@/components/BackToTop";
import { ChatWidget } from "@/components/ChatWidget";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    links: [
      { rel: "preload", as: "image", href: hero, fetchpriority: "high" } as any,
    ],
  }),
});

// TikTok icon (lucide has no TikTok yet)
function TikTokIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.5 3a5.5 5.5 0 0 0 5 5v3a8.4 8.4 0 0 1-5-1.6v6.6a6 6 0 1 1-6-6c.34 0 .67.03 1 .09v3.1a3 3 0 1 0 2 2.83V3h3z" />
    </svg>
  );
}

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav />
      <Hero />
      <Products />
      <Reviews />
      <ContactSection />
      <Footer />
      <FloatingWhatsApp />
      <BackToTop />
      <Toaster position="top-center" richColors closeButton dir="rtl" />
    </div>
  );
}

// ------------------------- Nav -------------------------
function Nav() {
  const [installEvent, setInstallEvent] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => { e.preventDefault(); setInstallEvent(e); };
    const onInstalled = () => { setInstalled(true); setInstallEvent(null); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installEvent) return;
    installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") setInstalled(true);
    setInstallEvent(null);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <a href="#top" className="flex items-center gap-3">
          <img
            src={logoAsset.url}
            alt="شعار الدسوقي"
            width={72} height={72}
            className="h-[4.5rem] w-[4.5rem] shrink-0 object-contain"
          />
        </a>
        <nav className="hidden items-center gap-6 text-sm font-semibold md:flex">
          <a href="#products" className="hover:text-primary">المنتجات</a>
          <a href="#reviews" className="hover:text-primary">آراء العملاء</a>
          <a href="#contact" className="hover:text-primary">تواصل معنا</a>
        </nav>
        <div className="flex items-center gap-2">
          {installEvent && !installed && (
            <button
              onClick={handleInstall}
              className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-soft transition hover:opacity-90 sm:inline-flex"
            >
              <Download className="h-4 w-4" /> تثبيت التطبيق
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

// ------------------------- Hero -------------------------
function Hero() {
  return (
    <section id="top" className="hero-bg relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2 md:items-center md:py-20">
        <div className="animate-float-up order-2 md:order-1">
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            {siteConfig.brand.welcome}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={waLink()}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-soft transition hover:-translate-y-0.5 hover:opacity-95"
            >
              <MessageCircle className="h-5 w-5" /> اطلب الآن
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3 text-base font-bold text-foreground transition hover:bg-secondary"
            >
              <Phone className="h-5 w-5" /> تواصل معنا
            </a>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <div className="animate-gentle-float overflow-hidden rounded-3xl shadow-card ring-1 ring-white/60">
            <img
              src={hero}
              alt="منتجات ألبان طازجة"
              width={1600} height={900}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />

          </div>
        </div>
      </div>
    </section>
  );
}

// ------------------------- Products -------------------------
function Products() {
  return (
    <section id="products" className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {siteConfig.products.map((p, i) => (
          <article
            key={p.id}
            className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-card animate-float-up"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="aspect-square overflow-hidden bg-secondary">
              <img
                src={p.image} alt={p.label}
                width={1024} height={1024} loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-5 text-center">
              <h3 className="text-xl font-extrabold text-foreground">{p.label}</h3>
              <a
                href={waLink(siteConfig.whatsapp.primary, `أرغب في طلب ${p.label}`)}
                target="_blank" rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-[var(--color-whatsapp)] px-6 py-3 text-sm font-bold text-white shadow-soft transition hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" /> اطلب واتساب
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ------------------------- Reviews -------------------------
function Reviews() {
  return (
    <section id="reviews" className="bg-secondary/60 py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {siteConfig.reviews.map((r, i) => (
            <div
              key={i}
              className="rounded-3xl border border-border bg-card p-6 shadow-soft animate-float-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex gap-1 text-primary">
                {Array.from({ length: r.rating }).map((_, s) => (
                  <Star key={s} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 leading-relaxed text-foreground">"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ------------------------- Contact -------------------------
function ContactSection() {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim().slice(0, 100);
    const phone = String(fd.get("phone") || "").trim().slice(0, 30);
    const message = String(fd.get("message") || "").trim().slice(0, 1000);
    if (!name || !message) {
      toast.error("من فضلك اكتب اسمك ورسالتك.");
      return;
    }
    const text = `اسم: ${name}%0Aهاتف: ${phone}%0A%0A${encodeURIComponent(message)}`;
    window.open(`https://wa.me/${siteConfig.whatsapp.primary}?text=${text}`, "_blank");
    toast.success("تم الإرسال! جاري فتح واتساب…");
    form.reset();
  };

  return (
    <section id="contact" className="mx-auto max-w-6xl px-4 py-16">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Info card */}
        <div className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="grid gap-3">
            {siteConfig.phones.map((p) => (
              <a key={p} href={telLink(p)} className="flex items-center gap-3 rounded-2xl bg-secondary/60 p-4 font-bold transition hover:bg-secondary">
                <Phone className="h-5 w-5 text-primary" /> {p}
              </a>
            ))}
          </div>

          <div className="flex items-start gap-3 rounded-2xl bg-secondary/60 p-4">
            <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
            <div className="text-sm leading-relaxed">{siteConfig.location.address}</div>
          </div>

          <div className="flex flex-wrap gap-2">
            <SocialButton href={siteConfig.social.facebook} label="فيسبوك"><Facebook className="h-5 w-5" /></SocialButton>
            <SocialButton href={siteConfig.social.instagram} label="انستجرام"><Instagram className="h-5 w-5" /></SocialButton>
            <SocialButton href={siteConfig.social.tiktok} label="تيك توك"><TikTokIcon className="h-5 w-5" /></SocialButton>
            <SocialButton href={siteConfig.social.youtube} label="يوتيوب"><Youtube className="h-5 w-5" /></SocialButton>
            <SocialButton href={waLink()} label="واتساب"><MessageCircle className="h-5 w-5" /></SocialButton>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border">
            <iframe
              src={siteConfig.location.mapEmbed}
              title="موقعنا على الخريطة"
              className="h-64 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <p className="text-sm text-muted-foreground">سيتم فتح واتساب بعد الإرسال لتأكيد الطلب.</p>

          <Field label="الاسم" name="name" required maxLength={100} placeholder="اسمك الكريم" />
          <Field label="رقم الهاتف" name="phone" type="tel" maxLength={30} placeholder="01xxxxxxxxx" />
          <div>
            <label className="mb-1 block text-sm font-bold">رسالتك</label>
            <textarea
              name="message" required maxLength={1000} rows={5}
              className="w-full rounded-2xl border border-border bg-background p-3 outline-none focus:border-primary"
              placeholder="اكتب طلبك أو استفسارك…"
            />
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-soft transition hover:opacity-90"
          >
            <Send className="h-4 w-4" /> إرسال
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label, name, type = "text", required, maxLength, placeholder,
}: { label: string; name: string; type?: string; required?: boolean; maxLength?: number; placeholder?: string }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-bold">{label}</label>
      <input
        name={name} type={type} required={required} maxLength={maxLength} placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-background p-3 outline-none focus:border-primary"
      />
    </div>
  );
}

function SocialButton({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary transition hover:bg-primary hover:text-primary-foreground"
    >
      {children}
    </a>
  );
}


// ------------------------- Footer -------------------------
function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <div className="flex items-center gap-2">
          <img src={logoAsset.url} alt="" width={28} height={28} className="h-7 w-7" />
        </div>
        <div>© {new Date().getFullYear()} جميع الحقوق محفوظة.</div>
      </div>
    </footer>
  );
}

// ------------------------- Floating WhatsApp -------------------------
function FloatingWhatsApp() {
  return (
    <a
      href={waLink()}
      target="_blank" rel="noopener noreferrer"
      aria-label="تواصل عبر واتساب"
      className="animate-soft-pulse fixed bottom-5 left-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-whatsapp)] text-white shadow-card transition hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
