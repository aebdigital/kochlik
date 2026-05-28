import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Vyplňte prosím všetky povinné polia.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Zadajte prosím platný email.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.SMTP2GO_API_KEY;
    const sender = process.env.SMTP2GO_SENDER;
    const recipient = process.env.CONTACT_FORM_RECIPIENT;

    if (!apiKey || !sender || !recipient) {
      console.error('Missing SMTP2GO environment variables');
      return NextResponse.json(
        { error: 'Konfigurácia servera nie je úplná. Kontaktujte nás telefonicky.' },
        { status: 500 }
      );
    }

    const htmlBody = `
      <h2>Nová správa z kontaktného formulára</h2>
      <table style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr>
          <td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Meno:</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${name}</td>
        </tr>
        <tr>
          <td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Email:</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
        </tr>
        <tr>
          <td style="padding:8px 12px;font-weight:bold;border-bottom:1px solid #eee;">Správa:</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${message.replace(/\n/g, '<br>')}</td>
        </tr>
      </table>
    `;

    const response = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: apiKey,
        to: [recipient],
        sender: sender,
        subject: `Nová správa od ${name} – kochlik.sk`,
        html_body: htmlBody,
        text_body: `Meno: ${name}\nEmail: ${email}\nSpráva: ${message}`,
        custom_headers: [
          {
            header: 'Reply-To',
            value: email,
          },
        ],
      }),
    });

    const result = await response.json();

    if (!response.ok || result.data?.error) {
      console.error('SMTP2GO error:', result);
      return NextResponse.json(
        { error: 'Nepodarilo sa odoslať správu. Skúste to znova neskôr.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Správa bola úspešne odoslaná!' });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Nastala neočakávaná chyba. Skúste to znova neskôr.' },
      { status: 500 }
    );
  }
}
