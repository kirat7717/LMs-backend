import { sendMail } from "./email.service.js";
import 'dotenv/config'
const emailTemplate = ({
  title,
  greeting,
  content,
  buttonText,
  buttonUrl,
  warning,
}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body style="
  margin:0;
  padding:0;
  background:#f4f7fb;
  font-family:Arial, Helvetica, sans-serif;
">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 15px;">
    <tr>
      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          style="
            max-width:600px;
            background:#ffffff;
            border-radius:12px;
            overflow:hidden;
            box-shadow:0 4px 15px rgba(0,0,0,0.08);
          "
        >

          <!-- HEADER -->
          <tr>
            <td style="
              background:#2563eb;
              padding:28px;
              text-align:center;
            ">
              <h1 style="
                margin:0;
                color:#ffffff;
                font-size:24px;
              ">
                LMS Platform
              </h1>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding:40px 35px;">

              <h2 style="
                margin:0 0 20px;
                color:#111827;
                font-size:22px;
              ">
                ${title}
              </h2>

              <p style="
                color:#374151;
                font-size:16px;
                line-height:1.6;
              ">
                ${greeting}
              </p>

              ${content}

              ${
                buttonUrl
                  ? `
                    <div style="text-align:center; margin:30px 0;">
                      <a
                        href="${buttonUrl}"
                        style="
                          display:inline-block;
                          padding:14px 28px;
                          background:#2563eb;
                          color:#ffffff;
                          text-decoration:none;
                          border-radius:8px;
                          font-size:16px;
                          font-weight:bold;
                        "
                      >
                        ${buttonText}
                      </a>
                    </div>
                  `
                  : ""
              }

              ${
                warning
                  ? `
                    <div style="
                      margin-top:25px;
                      padding:15px;
                      background:#fff7ed;
                      border-left:4px solid #f97316;
                      border-radius:5px;
                    ">
                      <p style="
                        margin:0;
                        color:#9a3412;
                        font-size:14px;
                        line-height:1.5;
                      ">
                        ${warning}
                      </p>
                    </div>
                  `
                  : ""
              }

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="
              padding:20px;
              text-align:center;
              background:#f9fafb;
              border-top:1px solid #e5e7eb;
            ">

              <p style="
                margin:0;
                color:#6b7280;
                font-size:13px;
              ">
                © ${new Date().getFullYear()} LMS Platform
              </p>

              <p style="
                margin:8px 0 0;
                color:#9ca3af;
                font-size:12px;
              ">
                This is an automated email. Please do not reply.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

// ==================== REGISTRATION EMAIL ====================

export const sendStudentRegistrationEmail = async (student) => {
  
  return await sendMail({
    to: student.email,
    subject: "Welcome to LMS Platform 🎉",
    html: emailTemplate({
      title: "Welcome to LMS Platform!",
      greeting: `Hi <strong>${student.name}</strong>,`,
     content: `
  <p style="color:#374151; line-height:1.6;">
    Your student account has been created successfully.
  </p>

  <p style="color:#374151; line-height:1.6;">
    A verification link has been sent to your email address.
    Please use that link to verify and activate your student account.
  </p>
`,
    }),
  });
};

// ==================== EMAIL VERIFICATION ====================

// ==================== STUDENT ACCOUNT VERIFICATION EMAIL ====================

// ==================== STUDENT ACCOUNT VERIFICATION EMAIL ====================

export const sendStudentVerificationEmail = async (student, token) => {
  const verificationUrl =
    `${process.env.BASE_URL}/api/students/verify-account?token=${token}`;

  return await sendMail({
    to: student.email,
    subject: "Verify Your LMS Student Account ✉️",
    html: emailTemplate({
      title: "Verify Your Student Account",
      greeting: `Hi <strong>${student.name}</strong>,`,
      content: `
        <p style="color:#374151; line-height:1.6;">
          Your LMS student account has been created successfully.
        </p>

        <p style="color:#374151; line-height:1.6;">
          Click the button below to verify and activate your student account.
        </p>
      `,
      buttonText: "Verify My Account",
      buttonUrl: verificationUrl,
      warning:
        "This verification link will expire in 30 minutes. If you did not create this account, you can safely ignore this email.",
    }),
  });
};
// ==================== PASSWORD CHANGED EMAIL ====================

export const sendStudentPasswordChangedEmail = async (student) => {
  return await sendMail({
    to: student.email,
    subject: "Your LMS Password Was Changed 🔐",
    html: emailTemplate({
      title: "Password Changed Successfully",
      greeting: `Hi <strong>${student.name}</strong>,`,
      content: `
        <p style="color:#374151; line-height:1.6;">
          Your LMS password has been changed successfully.
        </p>

        <p style="color:#374151; line-height:1.6;">
          If you made this change, no further action is required.
        </p>
      `,
      warning:
        "If you did not make this change, please secure your account immediately.",
    }),
  });
};

// ==================== PASSWORD RESET EMAIL ====================

export const sendStudentPasswordResetEmail = async (student, token) => {
  const resetUrl =
    `${process.env.BASE_URL}/api/students/reset-password?token=${token}`;

  return await sendMail({
    to: student.email,
    subject: "Reset Your LMS Password 🔑",
    html: emailTemplate({
      title: "Password Reset Request",
      greeting: `Hi <strong>${student.name}</strong>,`,
      content: `
        <p style="color:#374151; line-height:1.6;">
          We received a request to reset your LMS password.
        </p>

        <p style="color:#374151; line-height:1.6;">
          Click the button below to create a new password.
        </p>
      `,
      buttonText: "Reset My Password",
      buttonUrl: resetUrl,
      warning:
        "This password reset link will expire in 15 minutes. If you did not request a password reset, you can safely ignore this email.",
    }),
  });
};

// ==================== PROFILE UPDATED EMAIL ====================

export const sendStudentProfileUpdatedEmail = async (student) => {
  return await sendMail({
    to: student.email,
    subject: "Your LMS Profile Was Updated ✏️",
    html: emailTemplate({
      title: "Profile Updated Successfully",
      greeting: `Hi <strong>${student.name}</strong>,`,
      content: `
        <p style="color:#374151; line-height:1.6;">
          Your LMS profile has been updated successfully.
        </p>

        <p style="color:#374151; line-height:1.6;">
          If you made this change, no further action is required.
        </p>
      `,
      warning:
        "If you did not make this change, please secure your account immediately.",
    }),
  });
};

// ==================== EMAIL CHANGED ====================

export const sendStudentEmailChangedEmail = async (
  student,
  oldEmail
) => {
  return await sendMail({
    to: oldEmail,
    subject: "Your LMS Email Was Changed 📧",
    html: emailTemplate({
      title: "Email Address Changed",
      greeting: `Hi <strong>${student.name}</strong>,`,
      content: `
        <p style="color:#374151; line-height:1.6;">
          Your LMS account email address was changed successfully.
        </p>

        <p style="color:#374151; line-height:1.6;">
          A verification email has been sent to your new email address.
        </p>
      `,
      warning:
        "If you did not make this change, please secure your account immediately.",
    }),
  });
};
// ==================== COURSE ENROLLMENT SUCCESS EMAIL ====================

export const sendCourseEnrollmentSuccessEmail = async (
  student,
  course,
  payment
) => {
  return await sendMail({
    to: student.email,
    subject: "Course Enrollment Successful 🎉",
    html: emailTemplate({
      title: "Course Enrollment Successful",
      greeting: `Hi <strong>${student.name}</strong>,`,
      content: `
        <p style="color:#374151; line-height:1.6;">
          Your payment for <strong>${course.title}</strong> was successful.
        </p>

        <p style="color:#374151; line-height:1.6;">
          You have successfully enrolled in this course and can now start learning.
        </p>

        <p style="color:#374151; line-height:1.6;">
          <strong>Course:</strong> ${course.title}<br/>
          <strong>Amount Paid:</strong> ₹${payment.amount}<br/>
          <strong>Payment Status:</strong> Successful
        </p>
      `,
      buttonText: "Start Learning",
      buttonUrl: `${process.env.FRONTEND_URL}/courses/${course._id}`,
    }),
  });
};