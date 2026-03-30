import { getStore } from "@netlify/blobs";

const SITE_ID = "959175d1-fe9b-401d-b485-bf13b18b0a21";
const TOKEN = "nfp_YDJhPekCEzEkxpFhvZMFgcdHhzrKeRCfb5c0";

export default async (req) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  if (req.method === "OPTIONS") return new Response("", { status: 200, headers });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers });

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "uploads";

    if (!file) return new Response(JSON.stringify({ error: "No file provided" }), { status: 400, headers });

    const store = getStore({
      name: "dashing-images",
      siteID: SITE_ID,
      token: TOKEN,
    });

    // Create unique key
    const ext = file.name.split(".").pop().toLowerCase();
    const key = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Upload to Netlify Blobs
    const arrayBuffer = await file.arrayBuffer();
    await store.set(key, arrayBuffer, {
      metadata: {
        filename: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString()
      }
    });

    // Return the public URL
    const url = `https://shimmering-lolly-8bbb14.netlify.app/.netlify/blobs/dashing-images/${key}`;

    return new Response(JSON.stringify({ ok: true, url, key }), { status: 200, headers });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers });
  }
};

export const config = { path: "/api/upload" };
