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

// ==================== SUPER ADMIN PASSWORD RESET EMAIL ====================

const sendSuperAdminPasswordResetEmail = async (
  superAdmin,
  resetToken
) => {
  // Create password reset URL
  const resetUrl = `${process.env.BASE_URL}/super-admin/reset-password?token=${resetToken}`;

  // Prepare reset email
  const html = emailTemplate({
    title: "Reset Your Super Admin Password",
    message: `
      Hello ${superAdmin.name},<br /><br />

      We received a request to reset your Super Admin account password.
      Use the button below to create a new password.
    `,
    buttonText: "Reset Password",
    buttonUrl: resetUrl,
  });

  // Send password reset email
  return await sendMail({
    to: superAdmin.email,
    subject: "LMS Super Admin Password Reset",
    html,
  });
};

// ==================== SUPER ADMIN PASSWORD CHANGED EMAIL ====================

const sendSuperAdminPasswordChangedEmail = async (superAdmin) => {
  // Prepare password changed notification
  const html = emailTemplate({
    title: "Super Admin Password Changed",
    message: `
      Hello ${superAdmin.name},<br /><br />

      Your LMS Super Admin account password has been changed successfully.
    `,
  });

  // Send password changed email
  return await sendMail({
    to: superAdmin.email,
    subject: "LMS Super Admin Password Changed",
    html,
  });
};

// ==================== SUPER ADMIN PROFILE UPDATED EMAIL ====================

const sendSuperAdminProfileUpdatedEmail = async (superAdmin) => {
  // Prepare profile update notification
  const html = emailTemplate({
    title: "Super Admin Profile Updated",
    message: `
      Hello ${superAdmin.name},<br /><br />

      Your LMS Super Admin profile has been updated successfully.
    `,
  });

  // Send profile update email
  return await sendMail({
    to: superAdmin.email,
    subject: "LMS Super Admin Profile Updated",
    html,
  });
};

export {
  sendSuperAdminPasswordResetEmail,
  sendSuperAdminPasswordChangedEmail,
  sendSuperAdminProfileUpdatedEmail,
};