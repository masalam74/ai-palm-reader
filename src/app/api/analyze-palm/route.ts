import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 180;
export const dynamic = "force-dynamic";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

const PALM_PROMPT = `You are a trained palmistry analyst. Follow these established methods precisely:

METHODS:
1. HAND SHAPE (Elemental Typology — from William G. Benham, "The Laws of Scientific Hand Reading", 1900):
   - Fire: long palm, short fingers, flushed skin → passionate, impulsive, natural leader
   - Earth: square palm, short fingers, coarse skin → practical, reliable, patient
   - Air: square palm, long fingers → intellectual, communicative, curious
   - Water: conic/oval palm, long fingers, smooth skin → intuitive, emotional, creative

2. MAJOR LINES — observe depth, clarity, curvature, start/end points, forks, islands:
   - Heart Line: runs horizontally under fingers. Curves up toward Jupiter=index → idealistic in love. Straight to Apollo=ring → emotionally controlled. Ends between fingers → balanced. Deep = strong feelings. Faint = reserved nature. Chains/islands = emotional complexity.
   - Head Line: runs from Jupiter area toward Luna. Straight = analytical/logical mind (Benham). Slopes downward = imaginative/creative. Short = practical focus. Long = broad intellectual range. Fork at end = versatility.
   - Life Line: arcs around Venus mount. Does NOT predict lifespan (Benham Ch.4). Deep/wide = robust vitality. Close to thumb = low energy reserve. Wide arc = enthusiastic, adventurous. Broken = major life transition, not death.
   - Fate Line: vertical line from wrist toward Saturn=middle finger. Absent in ~20% of people — normal, not negative (Cheiro). Deep = strong sense of purpose. Starts at Luna = self-made. Starts at Life Line = early direction.

3. MOUNTS (Classical — Benham, Cheiro "Palmistry for All"):
   - Venus (base of thumb): passion, warmth, vitality
   - Jupiter (below index): ambition, leadership, confidence
   - Saturn (below middle): wisdom, discipline, responsibility
   - Apollo/Sun (below ring): creativity, fame, artistic talent
   - Mercury (below pinky): communication, commerce, adaptability
   - Luna/Moon (lower opposite thumb): imagination, intuition, travel

RULES:
- Be specific about WHAT YOU SEE (e.g., "curves upward toward index finger") then interpret
- If a line is faint or not clearly visible, say so — do not invent features
- Never predict death, disease, or specific future events
- Keep interpretations balanced — note both strengths and tendencies
- Base every claim on observable features, not assumptions

Return ONLY valid JSON (no markdown):
{"overallSummary":"2-3 sentences summarizing the dominant themes","lines":{"heartLine":{"label":"Heart Line","description":"30-40 words: what you observe + classical interpretation","trait":"1 word"},"headLine":{"label":"Head Line","description":"30-40 words: what you observe + classical interpretation","trait":"1 word"},"lifeLine":{"label":"Life Line","description":"30-40 words: what you observe + classical interpretation","trait":"1 word"},"fateLine":{"label":"Fate Line","description":"30-40 words: what you observe + classical interpretation, or note if absent","trait":"1 word or Not visible"}},"mounts":{"description":"40-50 words: which mounts appear developed and what they suggest"},"handShape":{"description":"30-40 words: observed shape + elemental type reasoning","type":"Fire/Earth/Air/Water"},"scientificNote":"30-40 words connecting to dermatoglyphics research (ridge patterns formed prenatally, studied in genetics)"},"element":"Fire or Earth or Air or Water — based on hand shape AND dominant line characteristics"}

If the image is NOT a clear human palm: {"error":"not a palm"}`;

async function compressImage(buffer: ArrayBuffer): Promise<Buffer> {
  try {
    const sharp = (await import("sharp")).default;
    return await sharp(Buffer.from(buffer))
      .resize(512, 512, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 75 })
      .toBuffer();
  } catch {
    return Buffer.from(buffer);
  }
}

/** Call Gemini Vision API with streaming */
async function analyzeWithGemini(imageUrl: string): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY environment variable is not set.");
  }

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gemini-2.5-flash",
      stream: true,
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: PALM_PROMPT },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${errorBody}`);
  }

  // Collect streaming response
  if (response.body instanceof ReadableStream) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let raw = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      raw += decoder.decode(value, { stream: true });
    }

    // Parse SSE chunks
    const contents: string[] = [];
    for (const line of raw.split("\n")) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6).trim();
      if (data === "[DONE]") break;
      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) contents.push(delta);
      } catch {
        // skip malformed chunk
      }
    }
    console.log(`Gemini stream: ${contents.length} chunks, ${contents.join("").length} chars`);
    return contents.join("");
  }

  // Non-streaming fallback
  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  console.log(`Gemini non-stream: ${content?.length || 0} chars`);
  return content || "";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: "Please upload a JPEG, PNG, or WebP image." },
        { status: 400 }
      );
    }

    if (imageFile.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image too large (max 10MB)." },
        { status: 400 }
      );
    }

    const rawBuffer = await imageFile.arrayBuffer();
    const compressed = await compressImage(rawBuffer);
    const base64Image = compressed.toString("base64");
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;
    console.log(
      `Image: ${(rawBuffer.byteLength / 1024).toFixed(0)}KB → ${(compressed.length / 1024).toFixed(0)}KB`
    );

    const content = await analyzeWithGemini(imageUrl);

    if (!content) {
      return NextResponse.json(
        { error: "Could not read the palm. Please try a clearer photo." },
        { status: 500 }
      );
    }

    // Parse JSON
    try {
      let jsonStr = content.trim();
      if (jsonStr.startsWith("```")) {
        jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
      }
      const parsed = JSON.parse(jsonStr);

      if (parsed.error) {
        return NextResponse.json(
          { error: "This doesn't look like a clear palm photo. Please upload a well-lit photo of your open palm." },
          { status: 400 }
        );
      }

      return NextResponse.json({ success: true, reading: parsed });
    } catch {
      // JSON parse failed — return raw content as summary
      return NextResponse.json({
        success: true,
        reading: {
          overallSummary: content,
          lines: {},
          mounts: {},
          handShape: {},
          scientificNote: "",
          element: "Unknown",
          disclaimer: "Palmistry is for entertainment purposes only.",
        },
      });
    }
  } catch (error) {
    console.error("Palm analysis error:", error);
    const msg = error instanceof Error ? error.message : String(error);

    if (
      msg.includes("timeout") ||
      msg.includes("TIMEOUT") ||
      msg.includes("ETIMEDOUT") ||
      msg.includes("deadline exceeded") ||
      msg.includes("context deadline")
    ) {
      return NextResponse.json(
        { error: "The AI timed out. Please try with a smaller or clearer photo." },
        { status: 504 }
      );
    }

    if (msg.includes("API_KEY")) {
      return NextResponse.json(
        { error: "API configuration error. Please contact support." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again with a different photo." },
      { status: 500 }
    );
  }
}
