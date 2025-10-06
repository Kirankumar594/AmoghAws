import nodemailer from "nodemailer"; 


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS|| "ipeaxpsvalhryoar", // App password for Gmail
  },
});

export const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"Amogh Diagnostic" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};
