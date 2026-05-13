"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/201553135708?text=Hi%2C%20I%27d%20like%20to%20book%20a%20free%20trial%20lesson%20at%20Mihrab%20Academy.";

const SESSION_KEY = "mihrab_trial_popup_seen";
const AUTO_SHOW_DELAY = 6000; // 6 seconds

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

export default function TrialPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const timer = setTimeout(() => setIsOpen(true), AUTO_SHOW_DELAY);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem(SESSION_KEY, "1");
  };

  const scrollToContact = () => {
    dismiss();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Popup card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Header band */}
            <div className="bg-mihrab-green px-5 py-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <WhatsAppIcon className="w-5 h-5 text-[#25D366] shrink-0" />
                <p className="text-white font-semibold text-sm leading-tight">
                  Claim Your Free Trial
                </p>
              </div>
              <button
                onClick={dismiss}
                className="text-white/60 hover:text-white transition-colors shrink-0 mt-0.5"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              <p className="text-gray-600 text-sm leading-relaxed">
                Give your child the gift of authentic Islamic education. Join{" "}
                <span className="font-semibold text-mihrab-green">
                  hundreds of families
                </span>{" "}
                already learning Quran, Arabic &amp; Seerah with expert teachers
                — completely online.
              </p>
              <p className="text-mihrab-gold font-semibold text-sm mt-2">
                Your first lesson is on us. No commitment.
              </p>

              <div className="flex gap-2 mt-4">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  WhatsApp
                </a>
                <button
                  onClick={scrollToContact}
                  className="flex-1 flex items-center justify-center gap-2 bg-mihrab-green hover:bg-mihrab-green-light text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
                >
                  <MessageCircle size={16} />
                  Message Us
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp button */}
      <motion.button
        onClick={() => setIsOpen((prev) => !prev)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe5d] shadow-lg flex items-center justify-center text-white transition-colors"
        aria-label="Open free trial chat"
      >
        <WhatsAppIcon className="w-7 h-7" />
        {/* Pulse ring */}
        <span className="absolute w-14 h-14 rounded-full bg-[#25D366]/40 animate-ping" />
      </motion.button>
    </div>
  );
}
