import nodemailer from "nodemailer";

if (!process.env.GMAIL_SENDER_EMAIL || !process.env.GMAIL_SENDER_PASSWORD) {
  throw new Error("Gmail email or password missing.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_SENDER_EMAIL,
    pass: process.env.GMAIL_SENDER_PASSWORD,
  },
});

/**
 * Sends an email regarding an emergency request.
 *
 * @param {string} email - The recipient's email address.
 * @param {Object} requestBody - The body of the request containing name and address.
 */
export async function sendEmail(
  email: string,
  requestBody: { name: string; address: string }
) {
  const { name, address } = requestBody; // Destructure name and address from request body

  // Construct the email HTML content
  const emailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Emergency Request from ${name}</h2>
      <p>Hello,</p>
      <p>You are receiving this email because you are in the community of <strong>${name}</strong>.</p>
      <p><strong>${name}</strong> has requested emergency assistance at the following address:</p>
      <p><strong>Address:</strong> ${address}</p>
      <p>Please take appropriate action to assist if possible.</p>
      <p>Thank you,<br>FAGL First Aid Geolocation</p>
    </div>
  `;

  // Define the mail options
  const mailOptions = {
    from: process.env.GMAIL_SENDER_EMAIL,
    to: email,
    subject: "FAGL First Aid Geolocation | Emergency Request",
    html: emailHtml,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${email}`);
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error);
  }
}
