
export const runtime = "nodejs";

/**
 * Gemini 2.5 Flash Image *Preview* backend
 * - Uses generateContent with inline_data (no generationConfig.response_mime_type)
 * - Strong "image ONLY" instruction to avoid text replies
 * - Falls back to fetching fileData.fileUri if the model returns a file reference
 */
export async function POST(req) {
  try {
    const form = await req.formData();
    const file = form.get("image");
    const userPrompt = String(form.get("prompt") ?? "");
    const dogOnly = String(form.get("dog_only") ?? "true") === "true";

    if (!file) return Response.json({ error: "No image provided" }, { status: 400 });

    const buf = Buffer.from(await file.arrayBuffer());
    const base64 = buf.toString("base64");
    const mime = file.type || "image/jpeg";

    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash-image-preview";
    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) return Response.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });

    const guard = dogOnly
      ? "Edit ONLY the DOG: tidy fur (face/paws). KEEP breed, pose, lighting, and BACKGROUND IDENTICAL. Do NOT add text, stickers, accessories, logos, or watermarks."
      : "Edit the image as described. Do NOT add text overlays or watermarks.";

    const system = [
      "You are an image editor. You MUST return an IMAGE, not text.",
      "Output exactly one image as inline data (base64) in the response. Do not include any natural language messages."
    ].join("\n");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const body = {
      contents: [{
        role: "user",
        parts: [
          { text: `${system}\n\nTask: ${guard}\n\nUser instructions: ${userPrompt}`.trim() },
          { inline_data: { mime_type: mime, data: base64 } }
        ]
      }]
    };

    const resp = await fetch(url, {
      method: "POST",
      headers: { "x-goog-api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const text = await resp.text().catch(()=>"" );
    if (!resp.ok) return Response.json({ error: `Gemini error ${resp.status}`, detail: text }, { status: 502 });

    let json = {}; try { json = JSON.parse(text); } catch {}
    const parts = json?.candidates?.[0]?.content?.parts || [];

    // Case 1: inline image returned
    const imgInline = parts.find((p)=> (p?.inline_data?.data) || (p?.inlineData?.data));
    if (imgInline) {
      const data = imgInline.inline_data || imgInline.inlineData;
      const outB64 = data.data;
      const outMime = data.mime_type || data.mimeType || "image/png";
      return Response.json({ image: `data:${outMime};base64,${outB64}` });
    }

    // Case 2: fileData reference returned -> try to download
    const fileRef = parts.find((p)=> p?.fileData || p?.file_data);
    if (fileRef) {
      const fd = fileRef.fileData || fileRef.file_data;
      const uri = fd.fileUri || fd.gcsUri || fd.uri || "";
      if (uri) {
        try {
          // Try download with API key if it's a Google hosted file
          const fetchUri = uri.startsWith("http") ? uri : `https://generativelanguage.googleapis.com/v1beta/${uri}?alt=media`;
          const f = await fetch(fetchUri, { headers: { "x-goog-api-key": apiKey } });
          const arr = new Uint8Array(await f.arrayBuffer());
          const b64 = Buffer.from(arr).toString("base64");
          const mimeGuess = (f.headers.get("content-type")) || "image/png";
          return Response.json({ image: `data:${mimeGuess};base64,${b64}` });
        } catch (e) {
          // fallthrough to text error below
        }
      }
    }

    // Otherwise show whatever text the model produced
    const errText = parts.find((p)=>p?.text)?.text || "Model returned no image. This preview model may sometimes respond with text.";
    return Response.json({ error: "No image returned from model", detail: errText }, { status: 502 });
  } catch (err) {
    return Response.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
