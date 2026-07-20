import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";
import { X, Loader2, CheckCircle2 } from "lucide-react";
import { emailjsConfig } from "@/config/emailjs";

type Product = { id: string; label: string };

interface OrderDialogProps {
  product: Product | null;
  onClose: () => void;
}

// Initialize EmailJS once with the public key.
let emailjsInitialized = false;
function ensureEmailJSInit() {
  if (emailjsInitialized) return;
  emailjs.init({ publicKey: emailjsConfig.publicKey });
  emailjsInitialized = true;
}

export function OrderDialog({ product, onClose }: OrderDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    governorate: "",
    address: "",
    quantity: "1",
    notes: "",
  });

  useEffect(() => {
    ensureEmailJSInit();
  }, []);

  if (!product) return null;

  const update =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return; // prevent duplicate submissions
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.governorate.trim() ||
      !form.address.trim() ||
      !form.quantity.trim()
    ) {
      toast.error("من فضلك أكمل جميع الحقول المطلوبة.");
      return;
    }
    setSubmitting(true);
    try {
      ensureEmailJSInit();
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        {
          name: form.name,
          phone: form.phone,
          governorate: form.governorate,
          address: form.address,
          product: product.label,
          quantity: form.quantity,
          notes: form.notes || "—",
        },
        { publicKey: emailjsConfig.publicKey },
      );
      setDone(true);
      toast.success("تم إرسال طلبك بنجاح، سنتواصل معك قريبًا.");
      setTimeout(() => {
        onClose();
        setDone(false);
        setForm({ name: "", phone: "", governorate: "", address: "", quantity: "1", notes: "" });
      }, 1800);
    } catch (err: unknown) {
      // Show the exact EmailJS error message.
      let detail = "";
      if (err && typeof err === "object") {
        const anyErr = err as { text?: string; message?: string; status?: number };
        detail = anyErr.text || anyErr.message || "";
        if (anyErr.status) detail = `(${anyErr.status}) ${detail}`.trim();
      }
      if (!detail) detail = String(err);
      console.error("EmailJS error", err);
      toast.error(`فشل الإرسال: ${detail}`, { duration: 8000 });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="animate-float-up relative w-full max-w-lg overflow-hidden rounded-t-3xl bg-card shadow-card sm:rounded-3xl"
      >
        <div className="flex items-center justify-between border-b border-border bg-primary/10 px-5 py-4">
          <div>
            <h2 className="text-lg font-extrabold text-foreground">تأكيد الطلب</h2>
            <p className="text-sm text-muted-foreground">{product.label}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="rounded-full p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {done ? (
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <CheckCircle2 className="h-14 w-14 text-[var(--color-whatsapp)]" />
            <p className="text-base font-bold text-foreground">
              تم إرسال طلبك بنجاح، سنتواصل معك قريبًا.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3 px-5 py-5 max-h-[75vh] overflow-y-auto">
            <Field label="الاسم بالكامل" value={form.name} onChange={update("name")} required placeholder="اسمك الكريم" />
            <Field label="رقم الهاتف" value={form.phone} onChange={update("phone")} required type="tel" placeholder="01xxxxxxxxx" />
            <Field label="المحافظة" value={form.governorate} onChange={update("governorate")} required placeholder="مثال: كفر الشيخ" />
            <Field label="العنوان بالتفصيل" value={form.address} onChange={update("address")} required placeholder="المدينة، الشارع، العلامات المميزة" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-bold text-foreground">اسم المنتج</label>
                <input
                  value={product.label}
                  readOnly
                  className="w-full rounded-2xl border border-border bg-secondary/50 p-3 text-sm outline-none"
                />
              </div>
              <Field label="الكمية" value={form.quantity} onChange={update("quantity")} required type="number" min="1" placeholder="1" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-foreground">ملاحظات (اختياري)</label>
              <textarea
                value={form.notes}
                onChange={update("notes")}
                rows={3}
                maxLength={500}
                className="w-full rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
                placeholder="أي تفاصيل إضافية عن الطلب…"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-bold text-primary-foreground shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> جاري الإرسال…
                </>
              ) : (
                "تأكيد الطلب"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type?: string;
  placeholder?: string;
  min?: string;
}) {
  const { label, ...rest } = props;
  return (
    <div>
      <label className="mb-1 block text-sm font-bold text-foreground">{label}</label>
      <input
        {...rest}
        className="w-full rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
