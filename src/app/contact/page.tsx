import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us - AI Palm Reader",
  description:
    "Get in touch with the AI Palm Reader team. Questions, feedback, or support — we'd love to hear from you.",
  openGraph: {
    title: "Contact AI Palm Reader",
    description: "Get in touch with the AI Palm Reader team.",
    url: "https://aipalmreader.com/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Nav */}
      <nav className="border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-amber-400 hover:text-amber-300">
            <span className="text-lg">✋</span>
            <span className="text-sm font-bold tracking-wide">AI Palm Reader</span>
          </Link>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link href="/about" className="transition-colors hover:text-white">
              About
            </Link>
            <Link href="/contact" className="text-slate-300 transition-colors hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      <article className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Contact <span className="text-amber-400">Us</span>
        </h1>
        <p className="mb-10 text-sm text-slate-500">Questions, feedback, or support</p>

        <div className="space-y-8">
          <section className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Get in Touch</h2>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              We&apos;d love to hear from you. Whether you have a question about your reading, feedback about the app, or a business inquiry, please reach out using the contact details below. We typically respond within 24–48 hours.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                  ✉
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-300">Email</p>
                  <p className="text-sm text-slate-400">technosupportnow@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                  ⏱
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-300">Response Time</p>
                  <p className="text-sm text-slate-400">Usually within 24–48 hours</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Common Questions</h2>
            <div className="space-y-5 text-sm">
              <div>
                <h3 className="mb-1 font-medium text-slate-300">Is my palm photo stored?</h3>
                <p className="text-slate-400">
                  No. Your photo is processed in real-time on our servers and immediately discarded. We do not store, share, or use your palm images for any purpose other than generating your reading.
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-medium text-slate-300">My reading seems inaccurate. What should I do?</h3>
                <p className="text-slate-400">
                  Reading quality depends heavily on photo clarity. For best results, use a well-lit photo of your open palm taken from directly above. Avoid shadows, blur, and cropped images. If you believe there is a technical issue, please email us with a screenshot.
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-medium text-slate-300">Can I use this for medical diagnosis?</h3>
                <p className="text-slate-400">
                  Absolutely not. AI Palm Reader is an entertainment and self-reflection tool only. It does not provide medical, psychological, financial, or legal advice. Please consult qualified professionals for any health-related concerns.
                </p>
              </div>
              <div>
                <h3 className="mb-1 font-medium text-slate-300">Is the app free?</h3>
                <p className="text-slate-400">
                  Yes, AI Palm Reader is completely free to use. Upload your palm photo, get your reading, and share it with friends — no account required, no hidden fees.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="mt-12 border-t border-white/5 pt-6 text-center">
          <Link href="/" className="text-sm text-amber-400 transition-colors hover:text-amber-300">
            &larr; Back to AI Palm Reader
          </Link>
        </div>
      </article>
    </div>
  );
}
