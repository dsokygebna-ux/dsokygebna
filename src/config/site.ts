// =============================================================================
// إعدادات الموقع - عدّل هذا الملف فقط لتحديث الأرقام والروابط
// Site configuration — edit this single file to update contact info,
// social links, WhatsApp numbers, and map location.
// =============================================================================

import cheeseImg from "@/assets/product-cheese.jpg";
import butterImgAsset from "@/assets/product-butter.jpg.asset.json";
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

  // ---------- المنتجات (صور + أسماء) ----------
  products: [
    { id: "cheese", image: cheeseImg, label: "جبنه قريش" },
    { id: "butter", image: butterImg, label: "زبده جاموسي" },
    { id: "cream", image: creamImg, label: "قشطه جاموسي" },
  ],

  // ---------- آراء العملاء ----------
  reviews: [
    {
      text: "أفضل جبنة قريش جربتها، طعم بيتي أصيل وطازج دائماً.",
      rating: 5,
    },
    {
      text: "الزبدة والقشطة على مستوى عالي جداً، والتوصيل سريع.",
      rating: 5,
    },
    {
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
