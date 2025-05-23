import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false,
//   auth: {
//     user: "hasanfaysal17@gmail.com",
//     pass: "fipdebpxcfhphwju",
//   },
// });
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  //   secure: false,
  auth: {
    user: "749bb983c2d76d",
    pass: "41926c512703af",
  },
});

const sendEmail = async (data, req, res) => {
  const info = await transporter.sendMail({
    from: "Hasan Sheikh <hasanfaysal17@gmail.com>",
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.html,
  });
  console.log("Message sent: %s", info.messageId);
};

export default sendEmail;
