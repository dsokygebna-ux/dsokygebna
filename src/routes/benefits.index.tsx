import { createFileRoute, Link } from "@tanstack/react-router";
import { siteConfig } from "@/config/site";

const items = [
  { to: "/benefits/cheese", label: "فوائد الجبنة القريش", desc: "بروتين عالي الجودة وكالسيوم لبناء العضلات وصحة العظام." },
  { to: "/benefits/butter", label: "فوائد الزبدة الجاموسي", desc: "مصدر غني بالطاقة وفيتامينات A و D و E و K الذائبة في الدهون." },
  { to: "/benefits/cream", label: "فوائد القشطة الجاموسي", desc: "قوام كريمي طبيعي وقيمة غذائية عالية عند تناولها باعتدال." },
] as const;

export const Route = createFileRoute("/benefits/")({
  component: BenefitsIndex,
  head: () => ({
    meta: [
      { title: "الفوائد الصحية لمنتجات الألبان | الدسوقي" },
      {
        name: "description",
        content:
          "تصفّح مقالات صحية دقيقة عن فوائد الجبنة القريش والزبدة الجاموسي والقشطة الجاموسي والقيمة الغذائية لكل منتج.",
      },
    ],
  }),
});

function BenefitsIndex() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold">الفوائد الصحية لمنتجات الألبان</h1>
      <p className="mt-3 leading-relaxed text-muted-foreground">
        مقالات مبسّطة عن منتجات {siteConfig.brand.name}: القيمة الغذائية، الفوائد المدعومة علمياً،
        أفضل الاستخدامات، والاحتياطات — مع الحفاظ على أسلوب بسيط ومناسب للجميع.
      </p>
      <div className="mt-8 grid gap-4">
        {items.map((it) => (
          <Link
            key={it.to}
            to={it.to}
            className="block rounded-3xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-card"
          >
            <div className="text-lg font-extrabold text-foreground">{it.label}</div>
            <div className="mt-1 text-sm text-muted-foreground">{it.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
