import { createFileRoute } from "@tanstack/react-router";

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

// Best-effort per-IP rate limit (stateless workers reset frequently).
const hits = new Map<string, { count: number; ts: number }>();
function rateLimit(ip: string) {
  const now = Date.now();
  const cur = hits.get(ip);
  if (!cur || now - cur.ts > 60_000) {
    hits.set(ip, { count: 1, ts: now });
    return true;
  }
  cur.count += 1;
  return cur.count <= 20;
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
          if (!rateLimit(ip)) return new Response("Too many requests", { status: 429 });

          const body = (await request.json()) as Body;
          const raw = Array.isArray(body.messages) ? body.messages : [];
          const messages = raw
            .filter((m) => m && typeof m.content === "string" && m.content.trim())
            .slice(-12)
            .map((m) => ({
              role: m.role === "assistant" ? "assistant" : "user",
              content: m.content.slice(0, 2000),
            }));

          if (messages.length === 0) return new Response("Missing messages", { status: 400 });

          const key = process.env.OPENAI_API_KEY;
          if (!key) return new Response("AI not configured", { status: 500 });

          const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: `Bearer ${key}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              stream: true,
              temperature: 0.5,
              messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
            }),
          });

          if (!upstream.ok || !upstream.body) {
            const errText = await upstream.text().catch(() => "");
            console.error("OpenAI error", upstream.status, errText);
            if (upstream.status === 429) return new Response("quota", { status: 402 });
            return new Response("AI upstream error", { status: 502 });
          }

          // Convert OpenAI SSE → plain text stream of deltas.
          const reader = upstream.body.getReader();
          const decoder = new TextDecoder();
          const encoder = new TextEncoder();
          let buffer = "";

          const stream = new ReadableStream<Uint8Array>({
            async pull(controller) {
              const { done, value } = await reader.read();
              if (done) {
                controller.close();
                return;
              }
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() ?? "";
              for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith("data:")) continue;
                const data = trimmed.slice(5).trim();
                if (!data || data === "[DONE]") continue;
                try {
                  const json = JSON.parse(data);
                  const delta: string | undefined = json.choices?.[0]?.delta?.content;
                  if (delta) controller.enqueue(encoder.encode(delta));
                } catch {
                  // ignore malformed chunk
                }
              }
            },
            cancel() { reader.cancel().catch(() => {}); },
          });

          return new Response(stream, {
            headers: {
              "content-type": "text/plain; charset=utf-8",
              "cache-control": "no-store",
            },
          });
        } catch (err) {
          console.error("chat route error", err);
          return new Response("Server error", { status: 500 });
        }
      },
    },
  },
});
