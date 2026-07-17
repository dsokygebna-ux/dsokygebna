# خطة تحسين الموقع (المرحلة الأولى — الأولويات)

الحفاظ على كل المحتوى الحالي: الأسماء الثلاثة فقط (جبنه قريش، زبده جاموسي، قشطه جاموسي) بدون أسعار أو أوزان أو وصف، رقم الواتس، الخريطة، آراء العملاء، السوشيال ميديا.

## 1) إصلاح PWA بشكل احترافي
- استبدال `public/service-worker.js` و `public/sw.js` (Kill-switch الحالي) بـ Service Worker حقيقي مبني على **vite-plugin-pwa + Workbox** مع `generateSW` و `registerType: "autoUpdate"`.
- استراتيجيات الكاش:
  - `NetworkFirst` لصفحات HTML (تفادي الشاشة البيضاء بعد النشر).
  - `CacheFirst` للصور والخطوط والأصول ذات الهاش.
  - `StaleWhileRevalidate` لـ Google Fonts.
- `manifest.webmanifest` كامل: name/short_name/description/lang/dir/start_url/scope/display=standalone/orientation/theme_color/background_color/categories/shortcuts (اتصل / اطلب واتساب).
- **أيقونات بكل المقاسات المطلوبة** (72, 96, 128, 144, 152, 192, 384, 512) + maskable 512 + apple-touch-icon 180 — يتم توليدها من اللوجو الحالي.
- **Splash Screens** لـ iOS عبر روابط `apple-touch-startup-image` بأحجام الأجهزة الشائعة، ولأندرويد عبر `theme_color` + `background_color` في المانيفست.
- **Registration Guard**: عدم تسجيل الـ SW في بيئة معاينة Lovable أو داخل iframe أو على `?sw=off` (لمنع الشاشة البيضاء داخل المحرر).
- الحفاظ على منطق زر "تثبيت التطبيق" الحالي (`beforeinstallprompt`).

## 2) الأداء وضغط الصور
- إضافة `vite-imagetools` لتوليد صيغ **AVIF + WebP** تلقائياً من صور المنتجات والـ hero.
- استخدام `<picture>` مع `source type="image/avif"` ثم `webp` ثم `jpg` كـ fallback.
- `loading="lazy"` و `decoding="async"` لكل الصور عدا الـ hero (LCP → `fetchpriority="high"` + preload في `head()`).
- تصغير حجم اللوجو المعروض والاعتماد على `width/height` صريحة لمنع CLS.
- الحفاظ على تحميل الخطوط عبر `<link>` (كما هو حالياً).

## 3) الوضع الليلي (Dark Mode)
- تعريف `@custom-variant dark` في `src/styles.css` وإضافة نظير داكن لكل توكن لون (background/foreground/card/border/primary…).
- تفعيل تلقائي عبر `prefers-color-scheme` + زر تبديل في الـ Nav يحفظ الاختيار في `localStorage`.
- قراءة القيمة داخل `useEffect` لتفادي مشاكل الـ SSR/hydration.
- لون `theme-color` ديناميكي حسب الوضع.

## 4) SEO
- التأكد من وجود:
  - `public/robots.txt` (موجود — سيتم إضافة سطر `Sitemap:`).
  - `src/routes/sitemap[.]xml.ts` كـ server route ديناميكي لـ `/` فقط حالياً.
- **JSON-LD Schema.org** في `__root.tsx` (LocalBusiness/Organization: الاسم، العنوان، الهاتف، الإحداثيات، السوشيال) — بدون Product schema لأنه لا يوجد سعر.
- التأكد من Open Graph و Twitter Cards (موجودة، مراجعة سريعة).
- Canonical على الصفحة الرئيسية.

## 5) تجربة المستخدم
- **صفحة 404** أنيقة (موجودة أصلاً في `__root.tsx` — تحسين بصري بسيط).
- **زر العودة لأعلى** يظهر بعد التمرير 400px مع أنيميشن ناعم.
- **Toaster** لرسائل النجاح (استخدام `sonner` الموجود في shadcn) بدل رسالة نصية ثابتة في فورم التواصل.
- شاشة تحميل بسيطة (Skeleton في الـ hero لحين تحميل الصورة).
- Animations ناعمة (موجودة `animate-float-up` — سنستخدمها بشكل منظم).

## 6) جودة الكود والأمان الأساسي
- إبقاء التحقق من مدخلات الفورم (name/phone/message) مع رسائل خطأ بديهية.
- تنظيف أي imports غير مستخدمة.
- التأكد من عدم كسر أي route (index فقط حالياً).

## الملفات المتوقع تعديلها/إضافتها
- `vite.config.ts` — إضافة `vite-plugin-pwa` و `vite-imagetools`.
- `package.json` — تثبيت `vite-plugin-pwa`, `workbox-window`, `vite-imagetools`.
- `public/manifest.webmanifest` — إعادة كتابة كاملة.
- `public/service-worker.js` و `public/sw.js` — استبدال الـ kill-switch الحالي بعد أن يؤدي دوره (الإبقاء عليه فترة قصيرة اختياري — سيتم استبداله مباشرة).
- `public/icons/*` — أيقونات جديدة بكل المقاسات (توليد من اللوجو).
- `src/lib/register-sw.ts` — wrapper مع الـ guards.
- `src/styles.css` — توكنز الدارك مود + `@custom-variant dark`.
- `src/components/ThemeToggle.tsx` (جديد) + استخدامه في Nav.
- `src/components/BackToTop.tsx` (جديد).
- `src/routes/__root.tsx` — Splash images لـ iOS، JSON-LD، canonical، تسجيل SW، ThemeProvider.
- `src/routes/index.tsx` — `<picture>` للصور، preload للـ hero، Toaster، BackToTop.
- `src/routes/sitemap[.]xml.ts` (جديد).
- `public/robots.txt` — إضافة `Sitemap:`.

## ملاحظات مهمة للمستخدم
- بعد النشر، لو التطبيق كان متثبت قبل كده على الموبايل، محتاج **تحذف التطبيق القديم وتعيد التثبيت** مرة واحدة عشان الـ SW الجديد يشتغل صح.
- الوضع الأوفلاين يعمل فقط على **الموقع المنشور** وليس داخل معاينة Lovable.
- النقاط اللي أتأجلت للمرحلة الثانية (لو حبيت لاحقاً): Push Notifications، البحث/التصفية، تقييمات إضافية، Security Headers متقدمة (تحتاج إعدادات hosting)، مشاركة المنتج على فيسبوك (Web Share API ممكن نضيفها في المرحلة الثانية بسهولة).
