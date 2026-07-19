import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export const Route = createFileRoute("/benefits")({
  component: BenefitsLayout,
  head: () => ({
    meta: [
      { title: "فوائد منتجات الألبان | الدسوقي" },
      {
        name: "description",
        content:
          "دليل صحي مبسّط عن فوائد الجبنة القريش والزبدة الجاموسي والقشطة الجاموسي، مع القيمة الغذائية وأفضل طرق الاستخدام.",
      },
    ],
  }),
});

function BenefitsLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-sm font-bold text-primary hover:underline">
            <ArrowRight className="inline h-4 w-4" /> العودة للرئيسية
          </Link>
          <div className="text-sm font-extrabold">الفوائد الصحية</div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-4 py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.brand.name} — المعلومات لأغراض التوعية العامة ولا تغني عن استشارة الطبيب أو أخصائي التغذية.
        </div>
      </footer>
    </div>
  );
}
