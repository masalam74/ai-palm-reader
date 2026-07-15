import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - AI Palm Reader",
  description: "Privacy policy for AI Palm Reader. Learn how we handle your data and palm images.",
  openGraph: {
    title: "Privacy Policy - AI Palm Reader",
    url: "https://aipalmreader.com/privacy",
  },
};

export default function PrivacyPage() {
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
          Privacy <span className="text-amber-400">Policy</span>
        </h1>
        <p className="mb-10 text-sm text-slate-500">Last updated: July 2025</p>

        <div className="space-y-6 text-sm leading-relaxed text-slate-400">
          <section>
            <h2 className="mb-2 text-base font-semibold text-white">1. Introduction</h2>
            <p>
              AI Palm Reader (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we handle information when you use our Service at aipalmreader.com.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">2. Information We Collect</h2>
            <p className="mb-2"><strong className="text-slate-300">Palm Images:</strong> When you use our Service, you upload a photograph of your palm. These images are processed in real-time on our servers to generate your reading. Images are <strong className="text-slate-300">not permanently stored</strong> and are deleted from our servers immediately after processing is complete.</p>
            <p className="mb-2"><strong className="text-slate-300">Usage Data:</strong> We may collect anonymous usage data such as page views, device type, browser type, and general geographic region. This data does not identify you personally and is used solely to improve the Service.</p>
            <p><strong className="text-slate-300">Cookies:</strong> We may use essential cookies for the operation of the Service and analytics cookies to understand how visitors interact with our website. You can manage cookie preferences through your browser settings.</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">3. How We Use Your Information</h2>
            <p>We use the limited information we collect to:</p>
            <ul className="ml-4 list-disc space-y-1 text-slate-400">
              <li>Process your palm image to generate a reading (real-time only)</li>
              <li>Maintain and improve the Service</li>
              <li>Analyze anonymous usage patterns to enhance user experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">4. Image Handling</h2>
            <p className="mb-2">
              Your palm photographs are handled with the following safeguards:
            </p>
            <ul className="ml-4 list-disc space-y-1 text-slate-400">
              <li>Images are processed in real-time and are not saved to any database</li>
              <li>Images are not shared with third parties</li>
              <li>Images are not used to train AI models</li>
              <li>Images are automatically deleted from server memory after processing</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">5. Third-Party Services</h2>
            <p>
              Our Service may use third-party services for analytics (e.g., Google Analytics) and advertising (e.g., Google AdSense). These services may collect anonymous data as described in their respective privacy policies. We do not share your palm images or personally identifiable information with these services.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">6. Data Security</h2>
            <p>
              We implement reasonable technical and organizational measures to protect the information processed through our Service. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">7. Children&apos;s Privacy</h2>
            <p>
              Our Service is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will take appropriate action.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">8. Your Rights</h2>
            <p>
              Depending on your jurisdiction, you may have the right to access, correct, or delete any personal information we hold about you. Since we do not permanently store personal data or palm images, there is typically no data to retrieve or delete. If you have concerns, please contact us at support@aipalmreader.com.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated revision date. Your continued use of the Service after any changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-white">10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy, please visit our <Link href="/contact" className="text-amber-400 hover:text-amber-300">contact page</Link> or email us at support@aipalmreader.com.
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