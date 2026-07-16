import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service - AI Palm Reader",
  description: "Terms and conditions for using AI Palm Reader.",
  openGraph: {
    title: "Terms of Service - AI Palm Reader",
    url: "https://ai-palm-reader-psi.vercel.app/terms",
  },
};

export default function TermsPage() {
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
            <Link href="/contact" className="transition-colors hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </nav>

      <article className="mx-auto max-w-2xl px-4 py-12 sm:py-16">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Terms of <span className="text-amber-400">Service</span>
        </h1>
        <p className="mb-10 text-sm text-slate-500">Last updated: July 2025</p>

        <div className="space-y-6 text-sm leading-relaxed text-slate-400">
          <section>
            <h2 className="mb-2 text-base font-semibold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using AI Palm Reader (&quot;the Service&quot;), available at https://ai-palm-reader-psi.vercel.app, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. These terms apply to all visitors and users of the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">2. Description of Service</h2>
            <p>
              AI Palm Reader provides an AI-powered palm reading experience for entertainment and self-reflection purposes. Users may upload photographs of their palms and receive automated interpretations based on classical palmistry traditions and AI image analysis. The Service does not provide medical, psychological, financial, legal, or any other professional advice.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">3. Entertainment Disclaimer</h2>
            <p>
              The readings provided by AI Palm Reader are based on classical palmistry traditions (including the works of William G. Benham and Cheiro) and AI interpretation. Palmistry is not a scientifically validated method of personality assessment or prediction. The readings are provided <strong className="text-slate-300">for entertainment and self-reflection purposes only</strong>. You should not make any life, medical, financial, or legal decisions based on the readings provided by this Service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">4. User Conduct</h2>
            <p className="mb-2">When using AI Palm Reader, you agree not to:</p>
            <ul className="ml-4 list-disc space-y-1 text-slate-400">
              <li>Upload images that are obscene, offensive, or contain illegal content</li>
              <li>Upload images of minors without appropriate consent</li>
              <li>Attempt to disrupt, overload, or interfere with the proper functioning of the Service</li>
              <li>Use the Service for any purpose that is unlawful or prohibited by these terms</li>
              <li>Attempt to reverse-engineer, decompile, or otherwise access the source code of the Service</li>
              <li>Misrepresent the readings as professional advice of any kind</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">5. Image Upload and Privacy</h2>
            <p>
              When you upload a palm photograph, it is processed in real-time on our servers to generate your reading. Images are not permanently stored and are discarded after processing. We do not share your images with third parties or use them to train AI models. For full details on how we handle your data, please see our <Link href="/privacy" className="text-amber-400 hover:text-amber-300">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">6. Intellectual Property</h2>
            <p>
              The content, design, and code of AI Palm Reader are the property of AI Palm Reader and are protected by applicable intellectual property laws. You may not copy, modify, distribute, or create derivative works from the Service without our prior written consent. The shareable result cards generated by the Service may be shared for personal, non-commercial purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">7. Accuracy of Readings</h2>
            <p>
              AI Palm Reader uses AI vision models and classical palmistry frameworks to generate interpretations. The accuracy of readings depends on many factors including image quality, lighting, angle, and the inherent limitations of both AI interpretation and palmistry as a tradition. We make no guarantees about the accuracy, completeness, or reliability of any reading. Individual results will vary.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by applicable law, AI Palm Reader and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or other intangible losses, resulting from your use of or inability to use the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">9. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting to this page. Your continued use of the Service after any changes constitutes acceptance of the updated terms. We encourage you to review these terms periodically.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">10. Contact</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at <Link href="/contact" className="text-amber-400 hover:text-amber-300">our contact page</Link> or email us at technosupportnow@gmail.com.
            </p>
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
