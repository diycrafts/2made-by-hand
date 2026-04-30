const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const PDF_MAP = {
  "Stone Garden Border Wall": "DIY_Stone_Garden_Border_Wall_Guide.pdf",
  "Concrete Bowl Candle Holder": "DIY_Concrete_Candle_Holder_Guide.pdf",
  "Concrete Bird Bath with Fabric Drape": "DIY_Concrete_Bird_Bath_Guide.pdf",
  "River Stone Candle Holder": "DIY_River_Stone_Candle_Holder_Guide.pdf",
  "Balloon Vase with Gold Interior": "DIY_Concrete_Balloon_Vase_Guide.pdf",
  "Rope Texture Planter": "DIY_Concrete_Rope_Planter_Guide.pdf",
  "Concrete Hand Planter": "DIY_Concrete_Hand_Planter_Guide.pdf",
  "Dry Creek Stream & Garden Bridge": "DIY_Dry_Creek_Stream_Bridge_Guide.pdf",
  "Mosaic Patio Table": "DIY_Mosaic_Patio_Table_Guide.pdf",
  "Leaf Imprint Stepping Stones": "DIY_Leaf_Concrete_Stepping_Stones_Guide.pdf",
  "Glass Mosaic Stepping Stones": "DIY_Glass_Mosaic_Stepping_Stones_Guide.pdf",
  "Woven Texture Concrete Planter": "DIY_Concrete_Woven_Planter_Guide.pdf",
  "Natural Stone Accent Wall": "DIY_Natural_Stone_Accent_Wall_Guide.pdf",
  "Concrete Fire Bowl": "DIY_Concrete_Fire_Bowl_Guide.pdf",
  "Concrete House Number Sign": "DIY_Concrete_House_Number_Sign_Guide.pdf",
  "Concrete Serving Tray": "DIY_Concrete_Serving_Tray_Guide.pdf",
  "Concrete Garden Sign with Leaf Imprints": "DIY_Concrete_Garden_Sign_Guide.pdf",
  "Concrete Stepping Stones Path": "DIY_Concrete_Stepping_Stones_Guide.pdf",
};

const BASE_URL = "https://classy-quokka-8dbf45.netlify.app";

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { email, product, price, delay_minutes } = JSON.parse(event.body || "{}");
  const BREVO_API_KEY = process.env.BREVO_API_KEY;

  if (!email || !product) {
    return { statusCode: 400, body: JSON.stringify({ error: "Missing email or product" }) };
  }

  const pdfFile = PDF_MAP[product];
  const pdfUrl = pdfFile ? `${BASE_URL}/${pdfFile}` : null;

  let subject, htmlContent;

  if (!delay_minutes || delay_minutes === 0) {
    // EMAIL 1 — Confirmare instant cu link download
    subject = "Your DIY Guide is ready to download! 🎉";
    htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0C0B09;color:#F0EDE8;padding:40px 32px;border-radius:12px;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#C8963C;margin-bottom:8px;">MADE BY HAND</div>
          <h1 style="font-size:26px;font-weight:700;color:#F0EDE8;margin:0;">Your guide is ready! 🎉</h1>
        </div>
        <p style="color:#A09890;font-size:15px;line-height:1.7;margin-bottom:24px;">
          Thank you for your purchase! Your copy of <strong style="color:#F0EDE8;">${product}</strong> is ready to download.
        </p>
        ${pdfUrl ? `
        <div style="text-align:center;margin:32px 0;">
          <a href="${pdfUrl}" style="display:inline-block;background:#C8963C;color:#0C0B09;font-weight:700;font-size:16px;padding:16px 36px;border-radius:8px;text-decoration:none;letter-spacing:0.02em;">
            ⬇ Download Your Guide Now →
          </a>
        </div>
        ` : ''}
        <p style="color:#6A6058;font-size:13px;text-align:center;margin-top:32px;line-height:1.6;">
          If the button doesn't work, copy this link into your browser:<br>
          <a href="${pdfUrl}" style="color:#C8963C;">${pdfUrl}</a>
        </p>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:32px 0;">
        <p style="color:#6A6058;font-size:12px;text-align:center;">
          Made By Hand · madebyhand010@gmail.com
        </p>
      </div>
    `;
  } else {
    // EMAIL 2 — Upsell bundle după delay_minutes
    subject = "⚡ 80% OFF — Exclusive offer just for you (24h only)";
    htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;background:#0C0B09;color:#F0EDE8;padding:40px 32px;border-radius:12px;">
        <div style="text-align:center;margin-bottom:32px;">
          <div style="font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#C8963C;margin-bottom:8px;">MADE BY HAND · EXCLUSIVE OFFER</div>
          <h1 style="font-size:26px;font-weight:700;color:#F0EDE8;margin:0 0 12px;">Get ALL 15 guides for just $37</h1>
          <p style="color:#A09890;font-size:15px;margin:0;">This offer expires in 24 hours and won't be shown again.</p>
        </div>
        <div style="background:#201E1B;border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:24px;margin-bottom:28px;">
          <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-bottom:16px;">
            <span style="color:#6A6058;font-size:22px;text-decoration:line-through;">$142</span>
            <span style="color:#F0EDE8;font-size:40px;font-weight:700;">$37</span>
            <span style="background:#B84040;color:white;font-size:13px;font-weight:700;padding:4px 10px;border-radius:4px;">74% OFF</span>
          </div>
          <p style="color:#A09890;font-size:14px;text-align:center;line-height:1.7;margin:0;">
            Since you just bought <strong style="color:#F0EDE8;">${product}</strong>, you can unlock the entire collection — all 15 step-by-step DIY guides — at a massive discount.
          </p>
        </div>
        <div style="text-align:center;margin:32px 0;">
          <a href="${BASE_URL}/bundle.html" style="display:inline-block;background:#C8963C;color:#0C0B09;font-weight:700;font-size:16px;padding:16px 36px;border-radius:8px;text-decoration:none;letter-spacing:0.02em;">
            Get All 15 Guides for $37 →
          </a>
        </div>
        <hr style="border:none;border-top:1px solid rgba(255,255,255,0.07);margin:32px 0;">
        <p style="color:#6A6058;font-size:12px;text-align:center;">
          Made By Hand · madebyhand010@gmail.com<br>
          This offer is exclusive to recent customers and expires in 24 hours.
        </p>
      </div>
    `;
  }

  // Dacă e delay, folosim Brevo scheduled send
  const sendAt = delay_minutes > 0
    ? new Date(Date.now() + delay_minutes * 60 * 1000).toISOString().replace(/\.\d{3}Z$/, '+00:00')
    : null;

  const payload = {
    sender: { name: "Made By Hand", email: "madebyhand010@gmail.com" },
    to: [{ email }],
    subject,
    htmlContent,
    ...(sendAt ? { scheduledAt: sendAt } : {}),
  };

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      return { statusCode: 500, body: JSON.stringify({ error: data }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true, data }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
