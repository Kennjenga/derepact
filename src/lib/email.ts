import nodemailer from "nodemailer";

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.BASE_URL}/verify-email?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    html: `
      <p>Thank you for signing up! Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `,
  };

  await transporter.sendMail(mailOptions);
}
