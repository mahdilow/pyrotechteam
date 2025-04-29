import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, phone, subject } = req.body;

  if (!name || (!email && !phone) || !subject) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Create a transporter with your Google account credentials
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Compose the email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "pyrotech.dev@proton.me",
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email || "Not provided"}</p>
        <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
        <p><strong>Subject:</strong> ${subject}</p>
      `,
      replyTo: email || process.env.EMAIL_USER,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
