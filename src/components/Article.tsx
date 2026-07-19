import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/config/site";

export function Article({
  title, intro, image, imageAlt, children,
}: { title: string; intro: string; image?: string; imageAlt?: string; children: ReactNode }) {
  return (
    <article className="prose prose-neutral max-w-none">
      <h1 className="text-3xl font-extrabold leading-tight">{title}</h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{intro}</p>
      {image && (
        <img
          src={image} alt={imageAlt ?? title}
          className="mt-6 aspect-video w-full rounded-3xl object-cover shadow-soft"
          loading="lazy"
        />
      )}
      <div className="mt-8 space-y-6 text-[1.02rem] leading-loose text-foreground">
        {children}
      </div>
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <a
          href={waLink()} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-whatsapp)] px-6 py-3 text-sm font-bold text-white shadow-soft hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" /> اطلب عبر واتساب
        </a>
        <Link to="/benefits" className="text-sm font-bold text-primary hover:underline">
          ← كل المقالات
        </Link>
      </div>
      <p className="mt-8 rounded-2xl bg-secondary/60 p-4 text-sm text-muted-foreground">
        المعلومات الواردة في هذا المقال لأغراض التوعية الصحية فقط، ولا تغني عن استشارة الطبيب أو أخصائي التغذية.
      </p>
    </article>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return <h2 className="mt-8 text-2xl font-extrabold text-foreground">{children}</h2>;
}
export function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-6 text-lg font-bold text-foreground">{children}</h3>;
}
export function UL({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pr-6 marker:text-primary">{children}</ul>;
}
