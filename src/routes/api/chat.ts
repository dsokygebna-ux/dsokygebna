import { createFileRoute } from "@tanstack/react-router";
import { streamText, type ModelMessage } from "ai";

import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `أنت المساعد الرسمي لموقع "الدسوقي لمنتجات الألبان" — متجر مصري متخصص في منتجات الألبان الطازجة والطبيعية 100%.

معلومات المتجر:
- الاسم: الدسوقي لمنتجات الألبان
- المنتجات المتوفرة: جبنة قريش، زبدة جاموسي طبيعية، قشطة جاموسي طبيعية.
- الجودة: منتجات طازجة يومياً من المزرعة إلى مائدة العميل.
- واتساب للطلب والاستفسار: 01091883015 و 01091882075
- فيسبوك: https://www.facebook.com/share/1LvgMan7qZ/
- تيك توك: https://www.tiktok.com/@asername1237
- الموقع الجغرافي: دسوق (يوجد رابط خرائط جوجل في صفحة تواصل معنا).

قواعد مهمة للإجابة:
1) استخدم دائماً اللغة العربية الفصحى المبسطة وبأسلوب ودّي ومحترم.
2) إذا سأل العميل عن السعر أو "بكام" أو التكلفة أو العروض: لا تذكر أي رقم أو تقدير للسعر أبداً. أجب بـ: "للاستفسار عن الأسعار وتأكيد التوفر يُرجى التواصل مباشرة مع الدسوقي عبر واتساب: 01091883015" واعرض الرابط https://wa.me/201091883015 .
3) أجب باختصار ووضوح، واستخدم قوائم عند الحاجة.
4) إذا طُلبت معلومات صحية أو تغذوية عن منتجات الألبان، قدّم معلومات عامة دقيقة علمياً باعتدال، واذكر في النهاية: "المعلومات لأغراض التوعية العامة ولا تغني عن استشارة الطبيب أو أخصائي التغذية."
5) لا تخترع منتجات أو أرقاماً غير موجودة أعلاه.
6) للطلب أو الشكاوى وجّه العميل مباشرة إلى واتساب المتجر.`;

type Body = { messages?: Array<{ role: "user" | "assistant"; content: string }> };

// Very small in-memory rate limit per IP (best-effort on stateless workers).
const hits = new Map<string, { count: number; ts: number }>();
function rateLimit(ip: string) {
  const now = Date.now();
  const win = 60_000;
  const max = 20;
  const cur = hits.get(ip);
  if (!cur || now - cur.ts > win) {
    hits.set(ip, { count: 1, ts: now });
    return true;
  }
  cur.count += 1;
  return cur.count <= max;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const ip =
            request.headers.get("cf-connecting-ip") ||
            request.headers.get("x-forwarded-for") ||
            "anon";
          if (!rateLimit(ip)) {
            return new Response("Too many requests", { status: 429 });
          }

          const body = (await request.json()) as Body;
          const raw = Array.isArray(body.messages) ? body.messages : [];
          const messages: ModelMessage[] = raw
            .filter((m) => m && typeof m.content === "string" && m.content.trim())
            .slice(-12)
            .map((m) => ({
              role: m.role === "assistant" ? "assistant" : "user",
              content: m.content.slice(0, 2000),
            }));

          if (messages.length === 0) {
            return new Response("Missing messages", { status: 400 });
          }

          const key = process.env.LOVABLE_API_KEY;
          if (!key) return new Response("AI not configured", { status: 500 });

          const gateway = createLovableAiGatewayProvider(key);
          const result = streamText({
            model: gateway("google/gemini-3-flash-preview"),
            system: SYSTEM_PROMPT,
            messages,
          });

          return result.toTextStreamResponse({
            headers: { "Cache-Control": "no-store" },
          });
        } catch (err) {
          console.error("chat route error", err);
          return new Response("Server error", { status: 500 });
        }
      },
    },
  },
});
