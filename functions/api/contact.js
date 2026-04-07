export async function onRequestPost(context) {
  const headers = {
    "Access-Control-Allow-Origin": "https://nearblack.com",
    "Content-Type": "application/json",
  };

  try {
    const body = await context.request.json();
    const { name, business, email, url, engagement, message } = body;

    if (!url || !email) {
      return new Response(JSON.stringify({ error: "Website URL and email are required." }), { status: 400, headers });
    }

    const firstName = name ? escape(name.split(" ")[0]) : "";
    const logoUrl = "https://nearblack.com/assets/icon-32.png";

    // Internal notification email
    const internalHtml = `
<div style="background:#0a0a0a;padding:0;margin:0;width:100%">
  <div style="max-width:560px;margin:0 auto;padding:60px 40px;font-family:-apple-system,Helvetica Neue,Arial,sans-serif">
    <img src="${logoUrl}" width="32" height="32" alt="N" style="display:block;margin-bottom:40px;border-radius:6px" />
    <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#666;margin-bottom:8px">New Inquiry</div>
    <div style="font-size:28px;font-weight:600;color:#f6f3ec;letter-spacing:-0.5px;line-height:1.2">${escape(name || "Someone")} · ${escape(business || "No business name")}</div>
    <div style="width:40px;height:1px;background:#333;margin:32px 0"></div>
    <table style="border-collapse:collapse;width:100%">
      <tr>
        <td style="padding:12px 0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#666;width:120px;vertical-align:top;font-family:-apple-system,Helvetica Neue,Arial,sans-serif">Name</td>
        <td style="padding:12px 0;font-size:15px;color:#f6f3ec;font-family:-apple-system,Helvetica Neue,Arial,sans-serif">${escape(name || "Not provided")}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#666;width:120px;vertical-align:top;font-family:-apple-system,Helvetica Neue,Arial,sans-serif">Business</td>
        <td style="padding:12px 0;font-size:15px;color:#f6f3ec;font-family:-apple-system,Helvetica Neue,Arial,sans-serif">${escape(business || "Not provided")}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#666;width:120px;vertical-align:top;font-family:-apple-system,Helvetica Neue,Arial,sans-serif">Email</td>
        <td style="padding:12px 0;font-size:15px;color:#f6f3ec;font-family:-apple-system,Helvetica Neue,Arial,sans-serif"><a href="mailto:${escape(email)}" style="color:#f6f3ec;text-decoration:underline;text-underline-offset:3px">${escape(email)}</a></td>
      </tr>
      <tr>
        <td style="padding:12px 0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#666;width:120px;vertical-align:top;font-family:-apple-system,Helvetica Neue,Arial,sans-serif">Website</td>
        <td style="padding:12px 0;font-size:15px;color:#f6f3ec;font-family:-apple-system,Helvetica Neue,Arial,sans-serif"><a href="${escape(url)}" style="color:#f6f3ec;text-decoration:underline;text-underline-offset:3px">${escape(url)}</a></td>
      </tr>
      <tr>
        <td style="padding:12px 0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#666;width:120px;vertical-align:top;font-family:-apple-system,Helvetica Neue,Arial,sans-serif">Engagement</td>
        <td style="padding:12px 0;font-size:15px;color:#f6f3ec;font-family:-apple-system,Helvetica Neue,Arial,sans-serif">${escape(engagement || "Not sure yet")}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#666;width:120px;vertical-align:top;font-family:-apple-system,Helvetica Neue,Arial,sans-serif">Message</td>
        <td style="padding:12px 0;font-size:15px;color:#ccc;line-height:1.6;font-family:-apple-system,Helvetica Neue,Arial,sans-serif">${escape(message || "No message").replace(/\n/g, "<br>")}</td>
      </tr>
    </table>
    <div style="width:40px;height:1px;background:#333;margin:32px 0"></div>
    <a href="mailto:${escape(email)}" style="display:inline-block;padding:14px 32px;background:#f6f3ec;color:#0a0a0a;font-size:12px;font-weight:600;letter-spacing:1px;text-transform:uppercase;text-decoration:none;border-radius:999px;font-family:-apple-system,Helvetica Neue,Arial,sans-serif">Reply to ${firstName || "them"}</a>
  </div>
</div>`;

    // Client confirmation email
    const confirmHtml = `
<div style="background:#0a0a0a;padding:0;margin:0;width:100%">
  <div style="max-width:560px;margin:0 auto;padding:60px 40px;font-family:-apple-system,Helvetica Neue,Arial,sans-serif">
    <img src="${logoUrl}" width="32" height="32" alt="N" style="display:block;margin-bottom:48px;border-radius:6px" />
    <div style="font-size:24px;font-weight:600;color:#f6f3ec;letter-spacing:-0.5px;line-height:1.3">We got your inquiry${firstName ? ", " + firstName : ""}.</div>
    <div style="width:40px;height:1px;background:#333;margin:28px 0"></div>
    <p style="font-size:15px;color:#999;line-height:1.7;margin:0 0 20px">Thanks for reaching out to NearBlack. Someone on our team will get back to you within a few hours, always within a day.</p>
    <p style="font-size:15px;color:#999;line-height:1.7;margin:0 0 28px">Here's what we received:</p>
    <div style="background:#111;border-radius:8px;padding:24px 28px;margin-bottom:28px">
      <table style="border-collapse:collapse;width:100%">
        <tr>
          <td style="padding:8px 0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#666;width:110px;vertical-align:top;font-family:-apple-system,Helvetica Neue,Arial,sans-serif">Website</td>
          <td style="padding:8px 0;font-size:15px;color:#f6f3ec;font-family:-apple-system,Helvetica Neue,Arial,sans-serif">${escape(url)}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#666;width:110px;vertical-align:top;font-family:-apple-system,Helvetica Neue,Arial,sans-serif">Engagement</td>
          <td style="padding:8px 0;font-size:15px;color:#f6f3ec;font-family:-apple-system,Helvetica Neue,Arial,sans-serif">${escape(engagement || "Not sure yet")}</td>
        </tr>
      </table>
    </div>
    <p style="font-size:15px;color:#999;line-height:1.7;margin:0 0 40px">We'll take a look at your site and come back with a quote and a timeline. No calls, no questionnaires. Just a straightforward reply.</p>
    <div style="width:40px;height:1px;background:#333;margin:0 0 32px"></div>
    <div style="font-size:14px;color:#f6f3ec;font-weight:500">The NearBlack Team</div>
    <a href="https://nearblack.com" style="font-size:13px;color:#666;text-decoration:none;margin-top:4px;display:inline-block">nearblack.com</a>
  </div>
</div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${context.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "NearBlack <hello@nearblack.com>",
        to: ["hello@nearblack.com"],
        reply_to: email,
        subject: `New inquiry from ${name || "someone"} · ${business || "no business name"}`,
        html: internalHtml,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(JSON.stringify({ error: "Failed to send email." }), { status: 500, headers });
    }

    // Confirmation email to the submitter
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${context.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "NearBlack <hello@nearblack.com>",
        to: [email],
        subject: `We got your inquiry${firstName ? ", " + firstName : ""}. Here's what happens next.`,
        html: confirmHtml,
      }),
    });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Server error." }), { status: 500, headers });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "https://nearblack.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

function escape(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
