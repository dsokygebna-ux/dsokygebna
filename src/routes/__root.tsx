import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { registerServiceWorker } from "../lib/register-sw";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">٤٠٤</h1>
        <h2 className="mt-4 text-xl font-semibold">الصفحة غير موجودة</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          الصفحة التي تبحث عنها غير متاحة.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">حدث خطأ ما</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          حاول تحديث الصفحة أو العودة للرئيسية.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            حاول مجدداً
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border bg-card px-4 py-2 text-sm font-semibold hover:bg-accent"
          >
            الرئيسية
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "الدسوقي لمنتجات الألبان | جبنة قريش، زبدة وقشطة جاموسي طازجة" },
      { name: "description", content: "الدسوقي لمنتجات الألبان — جبنة قريش، زبدة وقشطة جاموسي طازجة وطبيعية 100%. اطلب الآن عبر واتساب." },
      { name: "theme-color", content: "#7cc4e6" },
      { property: "og:title", content: "الدسوقي لمنتجات الألبان | جبنة قريش، زبدة وقشطة جاموسي طازجة" },
      { property: "og:description", content: "الدسوقي لمنتجات الألبان — جبنة قريش، زبدة وقشطة جاموسي طازجة وطبيعية 100%. اطلب الآن عبر واتساب." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ar_EG" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "الدسوقي لمنتجات الألبان | جبنة قريش، زبدة وقشطة جاموسي طازجة" },
      { name: "twitter:description", content: "الدسوقي لمنتجات الألبان — جبنة قريش، زبدة وقشطة جاموسي طازجة وطبيعية 100%. اطلب الآن عبر واتساب." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/48cc536a-2d77-4e5b-ad00-a639fbc52555/id-preview-a2ad717d--226bc50a-8e44-45b4-8184-eded463880e3.lovable.app-1784113833248.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/48cc536a-2d77-4e5b-ad00-a639fbc52555/id-preview-a2ad717d--226bc50a-8e44-45b4-8184-eded463880e3.lovable.app-1784113833248.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/icon-512.png" },
      { rel: "manifest", href: "/manifest.webmanifest" },
      { rel: "canonical", href: "https://dsokygebna.lovable.app/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&family=Tajawal:wght@400;500;700;800&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "الدسوقي لمنتجات الألبان",
          description: "منتجات ألبان طازجة وطبيعية 100% — جبنة قريش، زبدة وقشطة جاموسي.",
          url: "https://dsokygebna.lovable.app/",
          image: "https://dsokygebna.lovable.app/icon-512.png",
          telephone: "+201091883015",
          address: { "@type": "PostalAddress", addressCountry: "EG", addressLocality: "دسوق" },
          geo: { "@type": "GeoCoordinates", latitude: 30.892689, longitude: 30.660649 },
          priceRange: "$$",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
