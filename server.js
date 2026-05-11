const express = require('express');
const cors = require('cors');
const { Resend } = require('resend');

const app = express();
app.use(express.json());
app.use(cors());

const resend = new Resend(process.env.RESEND_API_KEY);

// ── HEALTH CHECK ── //
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Abhisheik portfolio backend is running.' });
});

// ── CONTACT FORM ENDPOINT ── //
app.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  try {
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'abhisheik912@gmail.com',
      reply_to: email,
      subject: subject ? `[Portfolio] ${subject}` : `[Portfolio] New message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
            New message from your portfolio
          </h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; width: 100px;"><strong>Name</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;"><strong>Email</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">
                <a href="mailto:${email}" style="color: #2563eb;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b;"><strong>Subject</strong></td>
              <td style="padding: 8px 0; color: #1e293b;">${subject || '—'}</td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 3px solid #2563eb;">
            <p style="color: #64748b; margin: 0 0 8px;"><strong>Message</strong></p>
            <p style="color: #1e293b; line-height: 1.7; margin: 0;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #94a3b8;">
            Sent from abhisheik-devops-portfolio contact form. Reply directly to this email to respond to ${name}.
          </p>
        </div>
      `
    });

    res.json({ success: true, message: 'Email sent successfully.' });

  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
});

// ── START SERVER ── //
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});