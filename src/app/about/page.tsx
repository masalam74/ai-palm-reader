import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us - AI Palm Reader",
  description:
    "Learn about AI Palm Reader — our mission, methodology, and the classical palmistry traditions behind our AI-powered palm reading app.",
  openGraph: {
    title: "About AI Palm Reader",
    description: "Learn about our mission and the classical palmistry traditions behind our app.",
    url: "https://ai-palm-reader-psi.vercel.app/about",
  },
};

export default function AboutPage() {
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
            <Link href="/about" className="text-slate-300 transition-colors hover:text-white">
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
          About <span className="text-amber-400">AI Palm Reader</span>
        </h1>
        <p className="mb-10 text-sm text-slate-500">Our mission, methodology, and team</p>

        <div className="space-y-8 text-sm leading-relaxed text-slate-400">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">Our Mission</h2>
            <p className="mb-3">
              AI Palm Reader was created to make the ancient art of palmistry accessible to everyone — free, instant, and private. We combine modern AI vision technology with classical palmistry traditions to offer an engaging self-reflection experience that anyone can try from their phone or computer.
            </p>
            <p>
              We believe that self-reflection tools should be freely available. Palmistry has been practiced across cultures for thousands of years — from Vedic traditions in India to classical European chiromancy. Our app brings this tradition into the digital age while respecting its roots.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">How It Works</h2>
            <p className="mb-3">
              When you upload a photo of your open palm, our AI vision model analyzes the image to identify the major lines (Heart, Head, Life, Fate), hand shape, and mounts. The analysis is then interpreted using established palmistry frameworks and returned to you in seconds.
            </p>
            <p>
              The entire process happens on our secure servers. Your palm photo is processed in real-time and is not stored, shared, or used for any purpose other than generating your reading. We do not use your images to train our models.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">Our Methodology</h2>
            <p className="mb-3">
              Our readings follow the <strong className="text-slate-300">elemental hand typology</strong> established by William G. Benham in <em>&quot;The Laws of Scientific Hand Reading&quot;</em> (1900), one of the most influential works in Western palmistry. Hand shapes are classified into four elemental types — Fire, Earth, Air, and Water — based on palm proportions, finger length, and skin texture.
            </p>
            <p className="mb-3">
              Major line interpretations draw from both Benham&apos;s system and the classical framework described by Cheiro (Count Louis Hamon) in <em>&quot;Palmistry for All&quot;</em>. Each line is assessed for depth, clarity, curvature, starting and ending points, forks, and other features.
            </p>
            <p className="mb-3">
              Mount analysis uses the classical seven-mount system (Venus, Jupiter, Saturn, Apollo/Sun, Mercury, Luna, and Mars), each associated with specific personality traits and aptitudes in the palmistry tradition.
            </p>
            <p>
              We also include a brief scientific note connecting the observations to <strong className="text-slate-300">dermatoglyphics</strong> — the biological study of fingerprint and palmar ridge patterns formed during prenatal development, which has been researched in relation to genetics and certain medical conditions.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">Disclaimer</h2>
            <p>
              Palmistry is an ancient interpretive tradition, not a scientifically validated method. Our AI-powered readings are intended for <strong className="text-slate-300">entertainment and self-reflection purposes only</strong>. They should not be used as a substitute for professional medical, psychological, financial, or legal advice. The Life Line in palmistry does not predict lifespan — a fact established by Benham himself. Individual results may vary based on photo quality and AI interpretation.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white">Technology</h2>
            <p>
              AI Palm Reader is built with Next.js and uses state-of-the-art vision AI models to analyze palm images. The app is fully responsive and works on smartphones, tablets, and desktop computers. Images are processed in real-time and never stored on our servers.
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
