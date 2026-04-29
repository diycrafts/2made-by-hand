// ═══════════════════════════════════════════════════════
// NETLIFY FUNCTION: send-email.js
// Trimite email prin Brevo API dupa plata
// ═══════════════════════════════════════════════════════

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: '' };

  try {
    const { email, product, price, delay_minutes } = JSON.parse(event.body);

    if (!email || !email.includes('@')) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid email' }) };
    }

    // Delay: schedule via setTimeout (Netlify functions run up to 26s)
    // For 5 min delay we use a simple approach: call this endpoint twice
    // First call: immediate confirmation email
    // Second call (from client after 5min): upsell email

    const emailType = delay_minutes > 0 ? 'upsell' : 'confirmation';

    let subject, htmlContent;

    if (emailType === 'confirmation') {
      subject = `Your DIY Guide is ready to download! 🎉`;
      htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0C0B09;font-family:'Outfit',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">
    
    <div style="text-align:center;margin-bottom:32px;">
      <p style="font-size:11px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#C8963C;margin:0 0 8px;">MADE BY HAND</p>
      <div style="width:40px;height:1px;background:#C8963C;margin:0 auto;"></div>
    </div>

    <h1 style="font-family:Georgia,serif;font-size:32px;font-weight:400;color:#F0EDE8;text-align:center;line-height:1.1;margin:0 0 16px;">
      Your guide is ready! 🎉
    </h1>
    
    <p style="font-size:15px;color:#A09890;text-align:center;line-height:1.7;margin:0 0 32px;">
      Thank you for your purchase. Your <strong style="color:#F0EDE8;">${product}</strong> guide is available for download on the page you just came from — just click the download button.
    </p>

    <div style="background:#201E1B;border:1px solid rgba(255,255,255,0.08);padding:24px;margin-bottom:32px;">
      <p style="font-size:12px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:#C8963C;margin:0 0 12px;">What you purchased</p>
      <p style="font-size:17px;font-family:Georgia,serif;color:#F0EDE8;margin:0 0 4px;">${product}</p>
      <p style="font-size:13px;color:#6A6058;margin:0;">Step-by-step PDF guide · Instant download · Yours forever</p>
    </div>

    <p style="font-size:13px;color:#6A6058;text-align:center;line-height:1.6;margin:0 0 24px;">
      If you have any questions, reply to this email and we'll help you right away.
    </p>

    <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;text-align:center;">
      <p style="font-size:11px;color:#3A3530;margin:0;">© 2026 Made By Hand · Digital PDF Downloads</p>
    </div>

  </div>
</body>
</html>`;
    } else {
      subject = `⚡ 80% OFF — Exclusive offer just for you (24h only)`;
      htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0C0B09;font-family:Arial,sans-serif;">
  <div style="max-width:520px;margin:0 auto;padding:40px 20px;">

    <div style="text-align:center;margin-bottom:28px;">
      <p style="font-size:11px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#C8963C;margin:0 0 8px;">MADE BY HAND · EXCLUSIVE OFFER</p>
      <div style="width:40px;height:1px;background:#C8963C;margin:0 auto;"></div>
    </div>

    <div style="background:#B84040;padding:10px 20px;text-align:center;margin-bottom:24px;">
      <p style="font-size:12px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:white;margin:0;">
        ⚡ This offer expires in 24 hours
      </p>
    </div>

    <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#F0EDE8;text-align:center;line-height:1.2;margin:0 0 16px;">
      You've been selected for<br/>
      <span style="color:#C8963C;font-style:italic;">80% OFF</span> our complete<br/>
      DIY Bundle
    </h1>

    <p style="font-size:14px;color:#A09890;text-align:center;line-height:1.7;margin:0 0 24px;">
      Get all <strong style="color:#F0EDE8;">15 step-by-step DIY guides</strong> — concrete, mosaic, garden &amp; more — for one exclusive price.
    </p>

    <div style="background:#201E1B;border:1px solid rgba(200,150,60,0.25);padding:24px;margin-bottom:24px;text-align:center;">
      <p style="font-size:13px;color:#6A6058;text-decoration:line-through;margin:0 0 4px;">Individual value: $142.00</p>
      <p style="font-family:Georgia,serif;font-size:42px;color:#FFFFFF;margin:0 0 4px;font-weight:400;">$37.00</p>
      <p style="font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#C8963C;margin:0;">All 15 guides · Instant download · Yours forever</p>
    </div>

    <div style="text-align:center;margin-bottom:20px;">
      <a href="https://classy-quokka-8dbf45.netlify.app/bundle.html"
         style="display:inline-block;background:#C8963C;color:#0C0B09;font-size:13px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;padding:16px 40px;text-decoration:none;">
        Get All 15 Guides for $37 →
      </a>
    </div>

    <p style="font-size:11px;color:#3A3530;text-align:center;margin:0 0 20px;">
      Exclusive to recent customers only. Expires in 24 hours.
    </p>

    <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:20px;text-align:center;">
      <p style="font-size:10px;color:#3A3530;margin:0;">© 2026 Made By Hand · You received this because you recently purchased a guide.</p>
    </div>

  </div>
</body>
</html>`;
    }

    // Send via Brevo API
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Made By Hand', email: 'madebyhand010@gmail.com' },
        to: [{ email }],
        subject,
        htmlContent,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(err);
    }

    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };

  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
