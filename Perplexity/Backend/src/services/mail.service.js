import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GOOGLE_USER,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        clientId: process.env.GOOGLE_CLIENT_ID,
    },
});

transporter.verify()
    .then(() => console.log("📧 Mail service authenticated and ready"))
    .catch((err) => console.error("❌ Mail Service Error:", err.message));

export async function sendEmail({
    to,
    subject,
    text,
    html,
}) {
    const mailOptions = {
        from: process.env.GOOGLE_USER,
        to,
        subject,
        text,
        html,
    };
    try {
        const details = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully", details);
    } catch (error) {
        console.log(error);
    }
}