"use client";
import { useState } from "react";
import { Phone, MessageCircle, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";

const COUNTRY_CODES = [
  { label: "US +1",   value: "+1",   flag: "🇺🇸" },
  { label: "CA +1",   value: "+1-CA", flag: "🇨🇦" },
  { label: "GB +44",  value: "+44",  flag: "🇬🇧" },
  { label: "IE +353", value: "+353", flag: "🇮🇪" },
  { label: "FR +33",  value: "+33",  flag: "🇫🇷" },
  { label: "DE +49",  value: "+49",  flag: "🇩🇪" },
  { label: "NL +31",  value: "+31",  flag: "🇳🇱" },
  { label: "BE +32",  value: "+32",  flag: "🇧🇪" },
  { label: "ES +34",  value: "+34",  flag: "🇪🇸" },
  { label: "PT +351", value: "+351", flag: "🇵🇹" },
  { label: "IT +39",  value: "+39",  flag: "🇮🇹" },
  { label: "CH +41",  value: "+41",  flag: "🇨🇭" },
  { label: "AT +43",  value: "+43",  flag: "🇦🇹" },
  { label: "SE +46",  value: "+46",  flag: "🇸🇪" },
  { label: "NO +47",  value: "+47",  flag: "🇳🇴" },
  { label: "DK +45",  value: "+45",  flag: "🇩🇰" },
  { label: "FI +358", value: "+358", flag: "🇫🇮" },
  { label: "PL +48",  value: "+48",  flag: "🇵🇱" },
  { label: "AU +61",  value: "+61",  flag: "🇦🇺" },
  { label: "NZ +64",  value: "+64",  flag: "🇳🇿" },
  { label: "MX +52",  value: "+52",  flag: "🇲🇽" },
  { label: "BR +55",  value: "+55",  flag: "🇧🇷" },
  { label: "AR +54",  value: "+54",  flag: "🇦🇷" },
];

type FormValues = {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  message: string;
};

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { countryCode: "+1" } });

  const onSubmit = async (data: FormValues) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          countryCode: data.countryCode.replace("-CA", ""),
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-mihrab-green focus:ring-1 focus:ring-mihrab-green outline-none transition-colors bg-gray-50/50 text-sm";
  const errorClass = "text-xs text-red-500 mt-1";

  return (
    <section id="contact" className="py-24 bg-mihrab-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
          {/* Contact Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="bg-mihrab-green text-white p-12 md:w-2/5 relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full border border-white/10 -translate-x-1/4 translate-y-1/4"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-serif mb-4">Get in Touch</h2>
              <p className="text-white/80 mb-12">
                Have questions about our programs? Reach out to us and our
                admissions team will guide you.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-mihrab-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Call Us</p>
                    <a href="tel:+201553135708" className="font-medium">
                      +20 15 53135708
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-mihrab-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">WhatsApp</p>
                    <a
                      href="https://wa.me/201553135708"
                      className="font-medium"
                      target="_blank"
                      rel="noreferrer"
                    >
                      +20 15 53135708
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-mihrab-gold" />
                  </div>
                  <div>
                    <p className="text-sm text-white/60">Email</p>
                    <p className="font-medium">contact@mihrabacademy.org</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-12 md:w-3/5"
          >
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Smith"
                    className={inputClass}
                    {...register("name", { required: "Name is required" })}
                  />
                  {errors.name && <p className={errorClass}>{errors.name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="jane@example.com"
                    className={inputClass}
                    {...register("email", {
                      required: "Email is required",
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email" },
                    })}
                  />
                  {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-400">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    className="px-3 py-3 rounded-lg border border-gray-200 focus:border-mihrab-green focus:ring-1 focus:ring-mihrab-green outline-none transition-colors bg-gray-50/50 text-sm shrink-0"
                    {...register("countryCode")}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.flag} {c.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    placeholder="555 123 4567"
                    className={inputClass}
                    {...register("phone", { required: "Phone number is required" })}
                  />
                </div>
                {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="How can we help you?"
                  className={`${inputClass} resize-none`}
                  {...register("message", { required: "Message is required" })}
                />
                {errors.message && <p className={errorClass}>{errors.message.message}</p>}
              </div>

              {status === "success" && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  Message sent! We&apos;ll get back to you soon.
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Something went wrong. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-mihrab-green hover:bg-mihrab-green-light disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-lg transition-colors"
              >
                {status === "loading" ? "Sending…" : "Send Message"}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
