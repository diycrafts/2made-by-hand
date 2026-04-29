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
      // UPSELL EMAIL — sent 5 minutes after purchase
      subject = `⚡ You've been selected — 80% OFF our complete DIY bundle`;
      htmlContent = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0C0B09;font-family:'Outfit',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:40px 20px;">

    <div style="text-align:center;margin-bottom:32px;">
      <p style="font-size:11px;font-weight:500;letter-spacing:0.2em;text-transform:uppercase;color:#C8963C;margin:0 0 8px;">MADE BY HAND · EXCLUSIVE OFFER</p>
      <div style="width:40px;height:1px;background:#C8963C;margin:0 auto;"></div>
    </div>

    <div style="background:#B84040;padding:10px 20px;text-align:center;margin-bottom:28px;">
      <p style="font-size:12px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:white;margin:0;">
        ⚡ LIMITED TIME — This offer expires in 24 hours
      </p>
    </div>

    <h1 style="font-family:Georgia,serif;font-size:30px;font-weight:400;color:#F0EDE8;text-align:center;line-height:1.15;margin:0 0 16px;">
      You've been selected for<br/>
      <span style="color:#C8963C;font-style:italic;">80% OFF</span> our complete<br/>
      DIY Garden Bundle
    </h1>

    <p style="font-size:15px;color:#A09890;text-align:center;line-height:1.7;margin:0 0 28px;">
      Because you just purchased one of our guides, we're offering you our 
      <strong style="color:#F0EDE8;">complete collection of 15 DIY garden &amp; home guides</strong> 
      at a price we've never offered before.
    </p>

    <div style="background:#201E1B;border:1px solid rgba(200,150,60,0.25);padding:28px;margin-bottom:28px;">
      <p style="font-size:12px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;color:#C8963C;margin:0 0 16px;">What's included in the bundle</p>
      
      <div style="display:grid;gap:8px;">
        ${[
          'Concrete House Number Sign',
          'Concrete Bird Bath with Fabric Drape',
          'River Stone Candle Holder',
          'Balloon Vase with Gold Interior',
          'Rope Texture Planter',
          'Hand Planter',
          'Bottle Glass Garden Edging',
          'Dry Creek Stream & Garden Bridge',
          'Mosaic Patio Table',
          'Leaf Imprint Stepping Stones',
          'Glass Mosaic Stepping Stones',
          'Concrete Candle Holder',
          'Woven Texture Concrete Planter',
          'Natural Stone Accent Wall',
          'Concrete Fire Bowl',
        ].map(g => `<p style="font-size:13px;color:#A09890;margin:0;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);">✓ &nbsp;${g}</p>`).join('')}
      </div>

      <div style="margin-top:20px;padding-top:20px;border-top:1px solid rgba(255,255,255,0.08);">
        <div style="display:flex;justify-content:space-between;align-items:baseline;">
          <p style="font-size:13px;color:#6A6058;margin:0;">Normal price (individual)</p>
          <p style="font-size:16px;color:#6A6058;text-decoration:line-through;margin:0;">$142.00</p>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-top:8px;">
          <p style="font-size:13px;color:#C8963C;font-weight:600;margin:0;">Your exclusive bundle price</p>
          <p style="font-family:Georgia,serif;font-size:32px;color:#C8963C;margin:0;font-weight:400;">$27.00</p>
        </div>
      </div>
    </div>

    <div style="text-align:center;margin-bottom:24px;">
      <a href="https://classy-quokka-8dbf45.netlify.app/shop.html" 
         style="display:inline-block;background:#C8963C;color:#0C0B09;font-size:13px;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;padding:16px 40px;text-decoration:none;">
        Claim 80% OFF — Get All 15 Guides for $27
      </a>
    </div>

    <p style="font-size:12px;color:#3A3530;text-align:center;line-height:1.6;margin:0 0 24px;">
      This offer is exclusive to recent customers only and expires in 24 hours.<br/>
      After that, guides return to their individual prices.
    </p>

    <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;text-align:center;">
      <p style="font-size:11px;color:#3A3530;margin:0;">© 2026 Made By Hand · You received this because you recently purchased a guide.</p>
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
        sender: { name: 'Made By Hand', email: 'noreply@made-by-hand.com' },
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
