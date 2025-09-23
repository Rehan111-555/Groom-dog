 // app/api/groom/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("image");
    // We no longer accept a prompt from the client:
    // const userPrompt = String(form.get("prompt") ?? "");
    const dogOnly = String(form.get("dog_only") ?? "true") === "true";
    const targetW = Number(form.get("target_w") || 0);
    const targetH = Number(form.get("target_h") || 0);

    if (!file) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const base64 = buf.toString("base64");
    const mime = file.type || "image/jpeg";

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-image-preview";
    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      return Response.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    // 👉 Hidden default prompt (ENV first, then fallback)
    const defaultPrompt =
      process.env.GROOM_DEFAULT_PROMPT ||
      "Keep everything the same, but trim the dog's hair evenly using a 3mm trimmer blade, including the face, so it looks like a professional groomer did it. Do not change any other details.";

    // Guardrails to preserve composition and ensure an image response
    const hardRules = [
      "You MUST return an IMAGE as inline data (base64). Do not return text.",
      "Do NOT crop or reframe the image. Keep composition identical.",
      targetW && targetH
        ? `The output MUST be exactly ${targetW}x${targetH} pixels. Do not change aspect ratio or resolution.`
        : null,
      "Do NOT add text, stickers, or watermarks.",
    ]
      .filter(Boolean)
      .join("\n");

    const guard = dogOnly
      ? "Edit ONLY the DOG: Keep everything the same, but trim the dog's hair evenly using a 3mm trimmer blade, including the face, so it looks like a professional groomer did it. Do not change any other details."
      : "Keep everything the same, but trim the dog's hair evenly using a 3mm trimmer blade, including the face, so it looks like a professional groomer did it. Do not change any other details.";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const body = {
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${hardRules}\n\nTask: ${guard}\n\nUser instructions: ${defaultPrompt}`.trim(),
            },
            { inline_data: { mime_type: mime, data: base64 } },
          ],
        },
      ],
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const text = await resp.text().catch(() => "");
    if (!resp.ok) {
      return Response.json(
        { error: `Gemini error ${resp.status}`, detail: text },
        { status: 502 }
      );
    }

    let json = {};
    try {
      json = JSON.parse(text);
    } catch {}

    const parts = json?.candidates?.[0]?.content?.parts || [];
    const imgInline = parts.find(
      (p) => p?.inline_data?.data || p?.inlineData?.data
    );
    if (imgInline) {
      const data = imgInline.inline_data || imgInline.inlineData;
      const outB64 = data.data;
      const outMime = data.mime_type || data.mimeType || "image/png";
      return Response.json({ image: `data:${outMime};base64,${outB64}` });
    }

    const errText =
      parts.find((p) => p?.text)?.text || "Model returned no image.";
    return Response.json(
      { error: "No image returned from model", detail: errText },
      { status: 502 }
    );
  } catch (err) {
    return Response.json(
      { error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}
