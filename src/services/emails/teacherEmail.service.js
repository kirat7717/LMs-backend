import { sendMail } from "./email.service.js";

const emailTemplate = ({ title, message }) => {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h2>${title}</h2>
      <p>${message}</p>

      <p>
        Regards,<br />
        LMS Team
      </p>
    </div>
  `;
};

// Teacher registration request received
export const sendTeacherRegistrationEmail = async (teacherRequest) => {
  return await sendMail({
    to: teacherRequest.email,
    subject: "Teacher Registration Request Received",
    html: emailTemplate({
      title: "Teacher Registration Received",
      message: `
        Hi ${teacherRequest.name},<br /><br />

        Your teacher registration request has been successfully submitted.
        Our admin team will review your request and notify you about the decision.
      `,
    }),
  });
};

// Notify all active admins about new teacher request
export const sendAdminTeacherRequestEmail = async (
  teacherRequest,
  adminEmail
) => {
  return await sendMail({
    to: adminEmail,
    subject: "New Teacher Registration Request",
    html: emailTemplate({
      title: "New Teacher Request",
      message: `
        A new teacher registration request has been submitted.<br /><br />

        <strong>Name:</strong> ${teacherRequest.name}<br />
        <strong>Email:</strong> ${teacherRequest.email}<br />
        <strong>Qualification:</strong> ${teacherRequest.qualification}<br />
        <strong>Experience:</strong> ${teacherRequest.experience} years
      `,
    }),
  });
};

// Notify teacher when registration request is approved
export const sendTeacherApprovalEmail = async (teacher) => {
  return await sendMail({
    to: teacher.email,
    subject: "Teacher Registration Approved",
    html: emailTemplate({
      title: "Teacher Registration Approved",
      message: `
        Hi ${teacher.name},<br /><br />

        Congratulations! Your teacher registration request has been approved
        by our admin team.<br /><br />

        You can now log in to your LMS teacher account and start using the
        teacher features.
      `,
    }),
  });
};

// Notify teacher when registration request is rejected
export const sendTeacherRejectionEmail = async (
  teacherRequest,
  rejectionReason
) => {
  return await sendMail({
    to: teacherRequest.email,
    subject: "Teacher Registration Request Rejected",
    html: emailTemplate({
      title: "Teacher Registration Request Rejected",
      message: `
        Hi ${teacherRequest.name},<br /><br />

        Unfortunately, your teacher registration request has been rejected
        by our admin team.<br /><br />

        <strong>Reason:</strong> ${
          rejectionReason || "No reason provided"
        }<br /><br />

        If you believe this was a mistake, please contact the LMS administration team.
      `,
    }),
  });
};

// Teacher forgot-password email
export const sendTeacherPasswordResetEmail = async (
  teacher,
  resetToken
) => {
  const resetLink = `${process.env.CLIENT_URL}/teacher/reset-password?token=${resetToken}`;

  return await sendMail({
    to: teacher.email,
    subject: "Teacher Password Reset",
    html: emailTemplate({
      title: "Reset Your Teacher Password",
      message: `
        Hi ${teacher.name},<br /><br />

        We received a request to reset your teacher account password.<br /><br />

        <a href="${resetLink}">Reset Password</a><br /><br />

        This link will expire soon. If you did not request this,
        you can safely ignore this email.
      `,
    }),
  });
};

// Notify teacher after password change
export const sendTeacherPasswordChangedEmail = async (teacher) => {
  return await sendMail({
    to: teacher.email,
    subject: "Teacher Password Changed",
    html: emailTemplate({
      title: "Password Changed Successfully",
      message: `
        Hi ${teacher.name},<br /><br />

        Your teacher account password has been changed successfully.<br /><br />

        If you did not make this change, please contact the LMS administration team immediately.
      `,
    }),
  });
};

// Notify teacher after profile update
export const sendTeacherProfileUpdatedEmail = async (teacher) => {
  return await sendMail({
    to: teacher.email,
    subject: "Teacher Profile Updated",
    html: emailTemplate({
      title: "Profile Updated Successfully",
      message: `
        Hi ${teacher.name},<br /><br />

        Your teacher profile has been updated successfully.
      `,
    }),
  });
};