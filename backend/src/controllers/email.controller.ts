// import nodemailer from 'nodemailer';

// export async function sendMail(to: string, subject: string, html: string) {
//     let transporter = nodemailer.createTransport({
//         host: process.env.SMTP_HOST || "default host",
//         port: Number(process.env.SMTP_PORT) || 587,
//         secure: false, // true for 465, false for other ports
//         auth: {
//             user: process.env.SMTP_USER || "default user",
//             pass: process.env.SMTP_PASS || "default pass"
//         }
//     });
    

//     let info = await transporter.sendMail({
//         from: 'hyperiontech.capstone@gmail.com',
//         to,
//         subject,
//         html
//     });

//     console.log("Message sent: %s", info.messageId);
// }
