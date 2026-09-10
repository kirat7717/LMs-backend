import { sendMail } from "./email.service.js";

// ==================== COMMON EMAIL TEMPLATE ====================

const emailTemplate = ({ title, message, buttonText, buttonUrl }) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
      </head>

      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="max-width: 600px; margin: auto; padding: 20px;">

          <h2>${title}</h2>

          <p>${message}</p>

          ${
            buttonText && buttonUrl
              ? `
                <p>
                  <a
                    href="${buttonUrl}"
                    style="
                      display: inline-block;
                      padding: 10px 18px;
                      background: #000;
                      color: #fff;
                      text-decoration: none;
                      border-radius: 5px;
                    "
                  >
                    ${buttonText}
                  </a>
                </p>
              `
              : ""
          }

          <p>
            If you did not expect this email, you can safely ignore it.
          </p>

          <p>Regards,<br />LMS Team</p>

        </div>
      </body>
    </html>
  `;
};

// ==================== ADMIN INVITATION EMAIL ====================

const sendAdminInvitationEmail = async (admin, setupToken) => {
  // Create password setup URL
  const setupUrl = `${process.env.BASE_URL}/admin/set-password?token=${setupToken}`;

  // Prepare invitation email
  const html = emailTemplate({
    title: "You have been added as an Admin",
    message: `
      Hello ${admin.name},<br /><br />

      You have been appointed as an Admin of the LMS platform.
      Please set your password to activate your Admin account.
    `,
    buttonText: "Set Your Password",
    buttonUrl: setupUrl,
  });

  // Send invitation email
  return await sendMail({
    to: admin.email,
    subject: "LMS Admin Account Invitation",
    html,
  });
};

// ==================== ADMIN PASSWORD RESET EMAIL ====================

const sendAdminPasswordResetEmail = async (admin, resetToken) => {
  // Create password reset URL
  const resetUrl = `${process.env.BASE_URL}/admin/reset-password?token=${resetToken}`;

  // Prepare reset email
  const html = emailTemplate({
    title: "Reset Your Admin Password",
    message: `
      Hello ${admin.name},<br /><br />

      We received a request to reset your Admin account password.
      Use the button below to create a new password.
    `,
    buttonText: "Reset Password",
    buttonUrl: resetUrl,
  });

  // Send password reset email
  return await sendMail({
    to: admin.email,
    subject: "LMS Admin Password Reset",
    html,
  });
};

// ==================== ADMIN PASSWORD CHANGED EMAIL ====================

const sendAdminPasswordChangedEmail = async (admin) => {
  // Prepare password changed notification
  const html = emailTemplate({
    title: "Admin Password Changed",
    message: `
      Hello ${admin.name},<br /><br />

      Your LMS Admin account password has been changed successfully.
    `,
  });

  // Send password changed email
  return await sendMail({
    to: admin.email,
    subject: "LMS Admin Password Changed",
    html,
  });
};

// ==================== ADMIN PROFILE UPDATED EMAIL ====================

const sendAdminProfileUpdatedEmail = async (admin) => {
  // Prepare profile update notification
  const html = emailTemplate({
    title: "Admin Profile Updated",
    message: `
      Hello ${admin.name},<br /><br />

      Your LMS Admin profile has been updated successfully.
    `,
  });

  // Send profile update email
  return await sendMail({
    to: admin.email,
    subject: "LMS Admin Profile Updated",
    html,
  });
};

export {
  sendAdminInvitationEmail,
  sendAdminPasswordResetEmail,
  sendAdminPasswordChangedEmail,
  sendAdminProfileUpdatedEmail,
};