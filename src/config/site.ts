// =============================================================================
// إعدادات الموقع - عدّل هذا الملف فقط لتحديث الأرقام والروابط والأسعار
// Site configuration — edit this single file to update all contact info,
// social links, product prices, WhatsApp numbers, and map location.
// =============================================================================

import cheeseImg from "@/assets/product-cheese.jpg";
import butterImg from "@/assets/product-butter.jpg";
import creamImg from "@/assets/product-cream.jpg";

export const siteConfig = {
  // ---------- الهوية ----------
  brand: {
    name: "الدسوقي لمنتجات الألبان",
    tagline: "طازج من المزرعة إلى مائدتك",
    welcome:
      "منتجات ألبان طبيعية 100% نقدّمها لك بجودة عالية وطعم أصيل كل يوم.",
  },

  // ---------- أرقام الواتساب (المصر: +20) ----------
  // كل ضغطة تفتح واتساب مباشرة
  whatsapp: {
    primary: "201091882075",   // 01091882075
    secondary: "201091883015", // 01091883015
    defaultMessage: "السلام عليكم، أرغب في الاستفسار عن منتجات الألبان.",
  },

  // ---------- الهاتف ----------
  phones: ["01091882075", "01091883015"],

  // ---------- روابط التواصل الاجتماعي ----------
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    tiktok: "https://www.tiktok.com/",
    youtube: "https://youtube.com/",
  },

  // ---------- الموقع الجغرافي ----------
  location: {
    address: "شارع الجمهورية، مدينة الدسوق، محافظة كفر الشيخ",
    // ضع رابط تضمين خرائط جوجل (embed src) هنا
    mapEmbed:
      "https://www.google.com/maps?q=Desouk,Egypt&output=embed",
    mapLink: "https://maps.google.com/?q=Desouk,Egypt",
  },

  // ---------- ساعات العمل ----------
  hours: [
    { day: "السبت - الخميس", time: "٧:٠٠ ص - ١٠:٠٠ م" },
    { day: "الجمعة", time: "٢:٠٠ م - ١٠:٠٠ م" },
  ],

  // ---------- المنتجات (الأسعار قابلة للتعديل) ----------
  products: [
    {
      id: "qarish",
      name: "الجبنة القريش",
      description:
        "جبنة قريش طازجة قليلة الدسم، غنية بالبروتين ومصنوعة يدوياً بطريقة تقليدية.",
      price: "٦٠ ج.م / كجم",
      image: cheeseImg,
    },
    {
      id: "butter",
      name: "الزبدة الجاموسي",
      description:
        "زبدة جاموسي طبيعية بلون ذهبي وطعم غني، خالية من أي إضافات.",
      price: "٣٥٠ ج.م / كجم",
      image: butterImg,
    },
    {
      id: "cream",
      name: "القشطة الجاموسي",
      description:
        "قشطة جاموسي كثيفة وطازجة، مثالية للحلويات ووجبة الإفطار.",
      price: "٢٨٠ ج.م / كجم",
      image: creamImg,
    },
  ],

  // ---------- آراء العملاء ----------
  reviews: [
    {
      name: "أم أحمد",
      text: "أفضل جبنة قريش جربتها، طعم بيتي أصيل وطازج دائماً.",
      rating: 5,
    },
    {
      name: "محمد السيد",
      text: "الزبدة والقشطة على مستوى عالي جداً، والتوصيل سريع.",
      rating: 5,
    },
    {
      name: "سارة إبراهيم",
      text: "منتجات نظيفة وطبيعية، أطلب منهم بشكل منتظم لعائلتي.",
      rating: 5,
    },
  ],
} as const;

// -------- مساعدات --------
export const waLink = (
  number: string = siteConfig.whatsapp.primary,
  text: string = siteConfig.whatsapp.defaultMessage,
) => `https://wa.me/${number}?text=${encodeURIComponent(text)}`;

export const telLink = (phone: string) => `tel:${phone.replace(/\s/g, "")}`;
