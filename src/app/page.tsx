"use client";

import { useState, useRef, useCallback, useEffect, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Camera,
  Upload,
  Sparkles,
  Eye,
  Hand,
  Heart,
  Brain,
  Zap,
  Compass,
  FlaskConical,
  RotateCcw,
  X,
  Share2,
  Download,
  BookOpen,
  Info,
} from "lucide-react";


// ─── Types ───────────────────────────────────────────────────────────────────
interface PalmLine {
  label: string;
  description: string;
  trait: string;
}

interface PalmReading {
  overallSummary: string;
  lines: {
    heartLine?: PalmLine;
    headLine?: PalmLine;
    lifeLine?: PalmLine;
    fateLine?: PalmLine;
  };
  mounts: { description: string };
  handShape: { description: string; type: string };
  scientificNote: string;
  element: string;
  disclaimer: string;
}

interface PalmResponse {
  success: boolean;
  reading?: PalmReading;
  error?: string;
}

// ─── Element Config ──────────────────────────────────────────────────────────
const ELEMENT_CONFIG: Record<
  string,
  { emoji: string; color: string; gradient: string; bg: string }
> = {
  Fire: {
    emoji: "🔥",
    color: "text-orange-500",
    gradient: "from-orange-500/20 via-red-500/10 to-amber-500/20",
    bg: "bg-orange-500/10",
  },
  Earth: {
    emoji: "🌍",
    color: "text-emerald-600",
    gradient: "from-emerald-500/20 via-green-500/10 to-lime-500/20",
    bg: "bg-emerald-500/10",
  },
  Air: {
    emoji: "💨",
    color: "text-cyan-500",
    gradient: "from-cyan-500/20 via-sky-500/10 to-teal-500/20",
    bg: "bg-cyan-500/10",
  },
  Water: {
    emoji: "💧",
    color: "text-blue-500",
    gradient: "from-blue-500/20 via-indigo-500/10 to-purple-500/20",
    bg: "bg-blue-500/10",
  },
  Unknown: {
    emoji: "✨",
    color: "text-purple-500",
    gradient: "from-purple-500/20 via-pink-500/10 to-violet-500/20",
    bg: "bg-purple-500/10",
  },
};

// ─── Line Icons ──────────────────────────────────────────────────────────────
const LINE_ICONS: Record<string, React.ReactNode> = {
  heartLine: <Heart className="h-5 w-5 text-rose-500" />,
  headLine: <Brain className="h-5 w-5 text-amber-500" />,
  lifeLine: <Zap className="h-5 w-5 text-emerald-500" />,
  fateLine: <Compass className="h-5 w-5 text-violet-500" />,
};

const LINE_COLORS: Record<string, string> = {
  heartLine: "border-rose-500/30 hover:border-rose-500/60",
  headLine: "border-amber-500/30 hover:border-amber-500/60",
  lifeLine: "border-emerald-500/30 hover:border-emerald-500/60",
  fateLine: "border-violet-500/30 hover:border-violet-500/60",
};

const LINE_BG: Record<string, string> = {
  heartLine: "bg-rose-500/5 hover:bg-rose-500/10",
  headLine: "bg-amber-500/5 hover:bg-amber-500/10",
  lifeLine: "bg-emerald-500/5 hover:bg-emerald-500/10",
  fateLine: "bg-violet-500/5 hover:bg-violet-500/10",
};

// ─── Canvas Helpers for Share Card ──────────────────────────────────────────
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(" ");
  let line = "";
  let curY = y;
  for (const word of words) {
    const test = line + (line ? " " : "") + word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, curY);
      line = word;
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, curY);
}

// ─── Animation Variants ─────────────────────────────────────────────────────
const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

// ─── Seeded random for deterministic SSR ───────────────────────────────────
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

const PARTICLE_DATA = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  size: seededRandom(i * 7 + 1) * 4 + 2,
  x: seededRandom(i * 7 + 2) * 100,
  y: seededRandom(i * 7 + 3) * 100,
  duration: seededRandom(i * 7 + 4) * 8 + 6,
  delay: seededRandom(i * 7 + 5) * 4,
}));

// ─── Hydration-safe client mount check ──────────────────────────────────────
const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

// ─── Floating Particles Component (client-only to avoid framer-motion SSR mismatch) ─
function FloatingParticles() {
  const isMounted = useIsMounted();
  if (!isMounted) return <div className="pointer-events-none absolute inset-0" />;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLE_DATA.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-amber-400/20"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: [0, -30, 0, 30, 0],
            x: [0, 15, 0, -15, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// ─── Loading Orb Animation ───────────────────────────────────────────────────
function ReadingOrb() {
  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Outer glow rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute h-40 w-40 rounded-full border border-amber-400/20 sm:h-48 sm:w-48"
          animate={{
            scale: [1, 1.3 + i * 0.15, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Central orb */}
      <motion.div
        className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 shadow-lg shadow-amber-500/30 sm:h-28 sm:w-28"
        animate={{
          boxShadow: [
            "0 0 30px rgba(251,191,36,0.3)",
            "0 0 60px rgba(251,191,36,0.5)",
            "0 0 30px rgba(251,191,36,0.3)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <Eye className="h-10 w-10 text-white sm:h-12 sm:w-12" />
      </motion.div>

      <motion.p
        className="mt-8 text-center text-sm font-medium text-amber-200/80 sm:text-base"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Reading your palm...
      </motion.p>
      <motion.p
        className="mt-2 text-center text-xs text-slate-500"
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
      >
        This may take 10–20 seconds — the AI is studying every line
      </motion.p>
    </motion.div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function PalmReaderPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PalmReading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("heartLine");
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Start camera — show modal first, then acquire stream
  const startCamera = useCallback(async () => {
    setCameraError(null);
    setShowCamera(true);
    // Wait for React to commit the modal to the DOM so <video> is available
    await new Promise((r) => setTimeout(r, 100));
    try {
      // Try rear camera first (for phones), fall back to front (for laptops)
      let stream: MediaStream | null = null;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
        });
      } catch {
        // Rear camera not available (e.g. laptop) — try any camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
        });
      }
      streamRef.current = stream;
      // Video element is now in the DOM — connect the stream directly.
      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        video.play().catch(() => {});
      }
    } catch {
      setCameraError("Camera access denied. Please grant permission or upload an image instead.");
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  }, []);

  // Capture from camera
  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    // Guard: video may not have loaded metadata yet
    const w = video.videoWidth || 1280;
    const h = video.videoHeight || 720;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, w, h);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "palm-capture.jpg", { type: "image/jpeg" });
          setImageFile(file);
          setImagePreview(canvas.toDataURL("image/jpeg"));
          stopCamera();
        }
      },
      "image/jpeg",
      0.9
    );
  }, [stopCamera]);

  // Handle file selection
  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setImageFile(file);
      setError(null);
      setResult(null);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    },
    []
  );

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setError(null);
      setResult(null);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  // Reset everything
  const reset = useCallback(() => {
    setImagePreview(null);
    setImageFile(null);
    setResult(null);
    setError(null);
    setIsAnalyzing(false);
    setIsPremium(false);
    setActiveTab("heartLine");
    stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, [stopCamera]);

  // Compress image before upload to speed up VLM analysis
  const compressImage = useCallback(
    (file: File, maxSize = 1024, quality = 0.8): Promise<File> =>
      new Promise((resolve) => {
        if (file.size < 500_000) {
          resolve(file);
          return;
        }
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let w = img.width;
          let h = img.height;
          if (w > maxSize || h > maxSize) {
            if (w > h) {
              h = (h / w) * maxSize;
              w = maxSize;
            } else {
              w = (w / h) * maxSize;
              h = maxSize;
            }
          }
          canvas.width = w;
          canvas.height = h;
          canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(new File([blob], "palm.jpg", { type: "image/jpeg" }));
              else resolve(file);
            },
            "image/jpeg",
            quality
          );
        };
        img.onerror = () => resolve(file);
        img.src = URL.createObjectURL(file);
      }),
    []
  );

  // Analyze palm
  const analyzePalm = useCallback(async (retryCount = 0) => {
    if (!imageFile) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    // Compress image before sending
    const compressed = await compressImage(imageFile);

    const formData = new FormData();
    formData.append("image", compressed);

    // 3-minute timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180_000);

    try {
      const res = await fetch("/api/analyze-palm", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });
      const data: PalmResponse = await res.json();

      if (!data.success || data.error) {
        setError(data.error || "Analysis failed. Please try again.");
      } else if (data.reading) {
        // Stagger the result appearance
        await new Promise((r) => setTimeout(r, 500));
        setResult(data.reading);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("analyzePalm error:", msg);
      if (msg.includes("aborted") || msg.includes("AbortError")) {
        setError("The analysis timed out. Please try again with a clearer photo.");
      } else if (retryCount < 1) {
        console.log("Retrying palm analysis (attempt 2)...");
        await new Promise((r) => setTimeout(r, 1500));
        return analyzePalm(retryCount + 1);
      } else {
        setError("Couldn't reach the server. Please check your connection and try again.");
      }
    } finally {
      clearTimeout(timeoutId);
      setIsAnalyzing(false);
    }
  }, [imageFile, compressImage]);

  const elementConfig = ELEMENT_CONFIG[result?.element || "Unknown"];

  // ─── Share Card Logic (pure canvas — no DOM dependency) ─────────────────
  const generateShareCard = useCallback(async (): Promise<Blob | null> => {
    if (!result) return null;

    const W = 800; // 2x for retina
    const H = 900;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Background
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, "#0a0a0f");
    bgGrad.addColorStop(0.5, "#1a1020");
    bgGrad.addColorStop(1, "#0a0a0f");
    ctx.fillStyle = bgGrad;
    roundRect(ctx, 0, 0, W, H, 32);
    ctx.fill();

    // Border
    ctx.strokeStyle = "rgba(251,191,36,0.2)";
    ctx.lineWidth = 2;
    roundRect(ctx, 1, 1, W - 2, H - 2, 32);
    ctx.stroke();

    // Decorative glow circle
    const glowGrad = ctx.createRadialGradient(W - 40, 40, 0, W - 40, 40, 120);
    glowGrad.addColorStop(0, "rgba(251,191,36,0.15)");
    glowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(W - 160, 0, 200, 200);

    // Header
    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 22px system-ui, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("AI Palm Reading", 48, 70);

    // Decorative line under header
    const lineGrad = ctx.createLinearGradient(48, 0, 300, 0);
    lineGrad.addColorStop(0, "rgba(251,191,36,0.3)");
    lineGrad.addColorStop(1, "transparent");
    ctx.fillStyle = lineGrad;
    ctx.fillRect(48, 84, 260, 1);

    // Element emoji
    ctx.font = "52px system-ui, sans-serif";
    ctx.fillText(elementConfig.emoji, 48, 150);

    // Element label
    const elemGrad = ctx.createLinearGradient(120, 0, 400, 0);
    elemGrad.addColorStop(0, "#fbbf24");
    elemGrad.addColorStop(0.5, "#f97316");
    elemGrad.addColorStop(1, "#f43f5e");
    ctx.fillStyle = elemGrad;
    ctx.font = "bold 42px system-ui, sans-serif";
    ctx.fillText(`${result.element} Palm`, 120, 142);

    // Hand shape
    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px system-ui, sans-serif";
    ctx.fillText(`${result.handShape?.type || "Unique"} Hand Shape`, 120, 170);

    // Line traits — 2x2 grid
    const lines = Object.entries(result.lines || {}) as [string, PalmLine][];
    const cardW = 336;
    const cardH = 72;
    const gap = 16;
    const startX = 48;
    const startY = 210;

    lines.forEach(([_key, line], i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = startX + col * (cardW + gap);
      const y = startY + row * (cardH + gap);

      // Card bg
      ctx.fillStyle = "rgba(255,255,255,0.04)";
      roundRect(ctx, x, y, cardW, cardH, 12);
      ctx.fill();

      // Card border
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      roundRect(ctx, x, y, cardW, cardH, 12);
      ctx.stroke();

      // Label
      ctx.fillStyle = "#64748b";
      ctx.font = "500 16px system-ui, sans-serif";
      ctx.textAlign = "left";
      ctx.fillText(line.label.toUpperCase(), x + 20, y + 28);

      // Trait
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 22px system-ui, sans-serif";
      ctx.fillText(line.trait, x + 20, y + 55);
    });

    // Summary text
    ctx.fillStyle = "#94a3b8";
    ctx.font = "20px system-ui, sans-serif";
    ctx.textAlign = "left";
    const summaryY = startY + 2 * (cardH + gap) + 30;
    wrapText(ctx, result.overallSummary, 48, summaryY, W - 96, 30);

    // CTA button
    const ctaY = H - 100;
    const ctaGrad = ctx.createLinearGradient(48, 0, W - 48, 0);
    ctaGrad.addColorStop(0, "rgba(251,191,36,0.15)");
    ctaGrad.addColorStop(1, "rgba(249,115,22,0.15)");
    ctx.fillStyle = ctaGrad;
    roundRect(ctx, 48, ctaY, W - 96, 52, 12);
    ctx.fill();
    ctx.strokeStyle = "rgba(251,191,36,0.3)";
    ctx.lineWidth = 1;
    roundRect(ctx, 48, ctaY, W - 96, 52, 12);
    ctx.stroke();

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 20px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Discover what your palm reveals", W / 2, ctaY + 33);

    // Convert to blob (async)
    return new Promise<Blob | null>((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  }, [result, elementConfig]);

  const shareResult = useCallback(async () => {
    setIsSharing(true);
    try {
      const blob = await generateShareCard();
      if (!blob) return;

      const file = new File([blob], "my-palm-reading.png", { type: "image/png" });
      const shareData: ShareData = {
        title: "My AI Palm Reading ✨",
        text: `I'm a ${result?.element || "Mystic"} palm! Discover what your palm lines reveal about you →`,
        files: [file],
      };

      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: download the image
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "my-palm-reading.png";
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // User cancelled share or download failed — silent
    } finally {
      setIsSharing(false);
    }
  }, [result, generateShareCard]);

  const downloadCard = useCallback(async () => {
    setIsSharing(true);
    try {
      const blob = await generateShareCard();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "my-palm-reading.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silent
    } finally {
      setIsSharing(false);
    }
  }, [generateShareCard]);

  return (
    <div className="relative min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Starfield background */}
      <div className="pointer-events-none fixed inset-0">
        <FloatingParticles />
      </div>

      {/* Top Navigation */}
      <nav className="relative z-20 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-2.5">
          <a href="/" className="flex items-center gap-2 text-amber-400 transition-colors hover:text-amber-300">
            <span className="text-base">✋</span>
            <span className="text-xs font-bold tracking-wide">AI Palm Reader</span>
          </a>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <a href="/about" className="transition-colors hover:text-slate-300">
              About
            </a>
            <a href="/contact" className="transition-colors hover:text-slate-300">
              Contact
            </a>
          </div>
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-2xl px-4 py-8 sm:py-12">
        {/* ─── Header ───────────────────────────────────────────────── */}
        <motion.header
          className="mb-10 text-center sm:mb-14"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-4 inline-flex items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 px-5 py-2 text-xs font-medium uppercase tracking-widest text-amber-300"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Sparkles className="mr-2 h-3.5 w-3.5" />
            AI-Powered Palmistry
          </motion.div>

          <h1 className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl">
            Palm Reader
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm text-slate-400 sm:text-base">
            Upload a photo of your open palm and let AI reveal the ancient wisdom hidden in your
            lines — grounded in classical palmistry & modern dermatoglyphic science.
          </p>
        </motion.header>

        {/* ─── Upload Section ──────────────────────────────────────── */}
        {!result && (
          <motion.div
            className="space-y-6"
            {...fadeInUp}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {/* Camera Modal */}
            <AnimatePresence>
              {showCamera && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-[#12121a] border border-amber-500/20"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                  >
                    <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
                      <span className="text-sm font-medium text-amber-300">
                        📷 Position your open palm
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={stopCamera}
                        className="h-8 w-8 text-slate-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="relative aspect-[4/3] bg-black">
                      {cameraError ? (
                        <div className="flex h-full items-center justify-center p-6 text-center text-sm text-red-400">
                          {cameraError}
                        </div>
                      ) : (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="h-full w-full object-cover"
                          onLoadedMetadata={() => {
                            // Ensure video is playing once metadata loads
                            videoRef.current?.play().catch(() => {});
                          }}
                        />
                      )}
                    </div>
                    <div className="flex justify-center gap-3 p-4">
                      <Button
                        variant="outline"
                        onClick={stopCamera}
                        className="border-white/10 text-slate-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={capturePhoto}
                        disabled={!!cameraError}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Capture
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Drop Zone / Image Preview */}
            {!imagePreview ? (
              <motion.div
                className="group cursor-pointer rounded-2xl border-2 border-dashed border-amber-500/20 bg-white/[0.02] p-8 text-center transition-colors hover:border-amber-500/40 hover:bg-white/[0.04] sm:p-12"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10">
                  <Hand className="h-8 w-8 text-amber-400" />
                </div>
                <p className="mb-1 text-base font-medium text-slate-200">
                  Drop your palm image here
                </p>
                <p className="mb-6 text-sm text-slate-500">
                  or click to browse your gallery
                </p>
                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <Button
                    className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Image
                  </Button>
                  <Button
                    variant="outline"
                    className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      startCamera();
                    }}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Use Camera
                  </Button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </motion.div>
            ) : (
              <motion.div
                className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-white/[0.02]"
                {...scaleIn}
              >
                <div className="relative aspect-[4/3] w-full bg-black/40">
                  <img
                    src={imagePreview}
                    alt="Your palm"
                    className="h-full w-full object-contain"
                  />
                  <button
                    onClick={reset}
                    className="absolute right-3 top-3 rounded-full bg-black/60 p-2 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/80 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex gap-3 p-4">
                  <Button
                    variant="outline"
                    onClick={reset}
                    className="flex-1 border-white/10 text-slate-300"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Retake
                  </Button>
                  <Button
                    onClick={analyzePalm}
                    disabled={isAnalyzing}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isAnalyzing ? "Reading..." : "Reveal My Palm"}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-300"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <p>{error}</p>
                  {imageFile && !isAnalyzing && (
                    <button
                      onClick={() => analyzePalm()}
                      className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-red-500/20 px-4 py-1.5 text-xs font-medium text-red-200 transition-colors hover:bg-red-500/30"
                    >
                      <Sparkles className="h-3 w-3" />
                      Try Again
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Tips */}
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Tips for best results
              </p>
              <ul className="grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-amber-400">→</span>
                  Open your non-dominant hand fully
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-amber-400">→</span>
                  Good, even lighting (no harsh shadows)
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-amber-400">→</span>
                  Center the palm, fingers slightly apart
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5 text-amber-400">→</span>
                  Flat hand, not curved or angled
                </li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* ─── Loading State ───────────────────────────────────────── */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              className="flex min-h-[60vh] flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ReadingOrb />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Results ─────────────────────────────────────────────── */}
        <AnimatePresence>
          {result && !isAnalyzing && (
            <motion.div
              className="space-y-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* Back button + image */}
              <motion.div variants={fadeInUp} className="flex items-start gap-4">
                <button
                  onClick={reset}
                  className="mt-1 rounded-lg bg-white/5 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <div className="flex-1 overflow-hidden rounded-xl border border-white/10">
                  <div className="h-28 sm:h-36">
                    <img
                      src={imagePreview!}
                      alt="Your palm"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </div>
              </motion.div>

              {/* Overall Summary + Element */}
              <motion.div variants={fadeInUp}>
                <Card className="border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5 overflow-hidden">
                  <CardContent className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-start gap-4">
                      <div className="flex-1">
                        <h2 className="mb-2 text-lg font-bold text-amber-300 sm:text-xl">
                          Your Palm Reading
                        </h2>
                        <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
                          {result.overallSummary}
                        </p>
                      </div>
                      <motion.div
                        className={`flex flex-col items-center gap-1 rounded-xl ${elementConfig.bg} px-4 py-3`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, type: "spring" }}
                      >
                        <span className="text-2xl">{elementConfig.emoji}</span>
                        <span className={`text-xs font-bold uppercase tracking-wider ${elementConfig.color}`}>
                          {result.element}
                        </span>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Hand Shape */}
              {result.handShape?.type && (
                <motion.div variants={fadeInUp}>
                  <Card className="border-white/5 bg-white/[0.02]">
                    <CardContent className="p-5">
                      <div className="mb-2 flex items-center gap-2">
                        <Hand className="h-4 w-4 text-amber-400" />
                        <h3 className="text-sm font-semibold text-slate-200">Hand Shape</h3>
                        <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-300">
                          {result.handShape.type}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-400">
                        {result.handShape.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Palm Lines Tabs */}
              <motion.div variants={fadeInUp}>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="mb-4 flex h-auto w-full flex-wrap gap-1 bg-white/[0.03] p-1.5">
                    {Object.entries(result.lines || {}).map(([key, line]) => (
                      <TabsTrigger
                        key={key}
                        value={key}
                        className="flex-1 gap-1.5 rounded-lg px-3 py-2 text-xs data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/20 data-[state=active]:to-orange-500/20 data-[state=active]:text-amber-300 sm:text-sm"
                      >
                        {LINE_ICONS[key]}
                        <span className="hidden sm:inline">{(line as PalmLine).label}</span>
                        <span className="sm:hidden">
                          {(line as PalmLine).label?.split(" ")[0]}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Object.entries(result.lines || {}).map(([key, line]) => (
                    <TabsContent key={key} value={key}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`rounded-xl border ${LINE_COLORS[key] || "border-white/10"} ${LINE_BG[key] || "bg-white/[0.02]"} p-5 transition-colors sm:p-6`}
                      >
                        <div className="mb-3 flex items-center gap-2">
                          {LINE_ICONS[key]}
                          <h3 className="text-base font-bold text-slate-100">
                            {(line as PalmLine).label}
                          </h3>
                          <span className="ml-auto rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-300">
                            {(line as PalmLine).trait}
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed text-slate-400">
                          {(line as PalmLine).description}
                        </p>
                      </motion.div>
                    </TabsContent>
                  ))}
                </Tabs>
              </motion.div>

              {/* Mounts Analysis */}
              {result.mounts?.description && (
                <motion.div variants={fadeInUp}>
                  <Card className="border-white/5 bg-white/[0.02]">
                    <CardContent className="p-5">
                      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        Mounts Analysis
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-400">
                        {result.mounts.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Scientific Note */}
              {result.scientificNote && (
                <motion.div variants={fadeInUp}>
                  <Card className="border-cyan-500/10 bg-cyan-500/[0.03]">
                    <CardContent className="p-5">
                      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-cyan-300">
                        <FlaskConical className="h-4 w-4" />
                        Scientific Perspective
                      </h3>
                      <p className="text-sm leading-relaxed text-slate-400">
                        {result.scientificNote}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Methodology & Disclaimer */}
              <motion.div
                variants={fadeInUp}
                className="space-y-3 rounded-xl border border-white/5 bg-white/[0.01] px-5 py-4"
              >
                {/* Methodology */}
                <div>
                  <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <BookOpen className="h-3.5 w-3.5" />
                    Our Methodology
                  </h4>
                  <div className="space-y-1.5 text-[11px] leading-relaxed text-slate-600">
                    <p>
                      This reading follows the <span className="text-slate-500">elemental hand typology</span> from
                      William G. Benham's <span className="italic text-slate-500">"The Laws of Scientific Hand Reading"</span> (1900)
                      and the classical line interpretation system from Cheiro's <span className="italic text-slate-500">"Palmistry for All"</span>.
                    </p>
                    <p>
                      Major lines (Heart, Head, Life, Fate) are assessed for depth, curvature, starting/ending points,
                      forks, and islands. Mounts are evaluated using the classical seven-mount system (Venus, Jupiter,
                      Saturn, Apollo, Mercury, Luna, Mars). The dermatoglyphic note references modern scientific
                      research on prenatal ridge pattern formation.
                    </p>
                  </div>
                </div>

                {/* Separator */}
                <div className="border-t border-white/5" />

                {/* Disclaimer */}
                <div>
                  <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-600/70">
                    <Info className="h-3.5 w-3.5" />
                    Important Disclaimer
                  </h4>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    Palmistry is an ancient interpretive tradition, not a science. Readings are based on classical
                    literature and should be treated as <span className="text-slate-500">entertainment and self-reflection</span> only.
                    The Life Line does <span className="underline decoration-amber-500/30">not</span> predict lifespan.
                    This app does not provide medical, psychological, or financial advice. Individual results may vary
                    based on image quality and AI interpretation.
                  </p>
                </div>
              </motion.div>

              {/* Share + Read Another */}
              <motion.div variants={fadeInUp} className="space-y-3 pb-8">
                <div className="flex gap-3">
                  <Button
                    onClick={shareResult}
                    disabled={isSharing}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-600 disabled:opacity-50"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    {isSharing ? "Preparing..." : "Share Result"}
                  </Button>
                  <Button
                    onClick={downloadCard}
                    disabled={isSharing}
                    variant="outline"
                    className="border-amber-500/30 text-amber-300 hover:bg-amber-500/10 disabled:opacity-50"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Save Image
                  </Button>
                </div>
                <Button
                  onClick={reset}
                  variant="ghost"
                  className="w-full text-slate-500 hover:text-slate-300"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Read Another Palm
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Ad Slot: Below Results (highest CTR position) ────── */}
        {result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mx-auto mb-6 w-full max-w-lg"
          >
            {/* 
              AD PLACEMENT SLOT 1 — Below Results
              Replace this placeholder with your AdSense code:
              <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-XXXX" data-ad-slot="XXXX" data-ad-format="auto"></ins>
            */}
            <div className="flex h-[90px] items-center justify-center rounded-xl border border-dashed border-white/5 bg-white/[0.01] text-[10px] uppercase tracking-widest text-slate-700">
              Ad Space
            </div>
          </motion.div>
        )}

        {/* ─── Footer ──────────────────────────────────────────────── */}
        <footer className="mt-auto border-t border-white/5 pt-6 pb-6">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] text-slate-600">
            <a href="/about" className="transition-colors hover:text-slate-400">About</a>
            <span className="text-slate-800">·</span>
            <a href="/contact" className="transition-colors hover:text-slate-400">Contact</a>
            <span className="text-slate-800">·</span>
            <a href="/terms" className="transition-colors hover:text-slate-400">Terms of Service</a>
            <span className="text-slate-800">·</span>
            <a href="/privacy" className="transition-colors hover:text-slate-400">Privacy Policy</a>
          </div>
          <p className="mt-3 text-center text-[10px] text-slate-700">
            Powered by AI Vision · For entertainment purposes only
          </p>
          {/* 
            AD PLACEMENT SLOT 2 — Footer Banner
            Replace with a 728x90 leaderboard AdSense unit
          */}
          <div className="mx-auto mt-4 flex h-[60px] max-w-md items-center justify-center rounded-lg border border-dashed border-white/5 bg-white/[0.01] text-[10px] uppercase tracking-widest text-slate-700">
            Ad Space
          </div>
        </footer>
      </div>
    </div>
  );
}