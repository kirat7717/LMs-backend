import { sendMail } from "./email.service.js";

// Common course email template
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

// Notify teacher after course submission
export const sendCourseSubmissionEmail = async (course, teacher) => {
  return await sendMail({
    to: teacher.email,
    subject: "Course Submitted for Approval",
    html: emailTemplate({
      title: "Course Submitted Successfully",
      message: `
        Hi ${teacher.name},<br /><br />

        Your course <strong>${course.title}</strong> has been submitted
        successfully and is currently pending admin approval.<br /><br />

        You will receive another email once the admin team reviews your course.
      `,
    }),
  });
};

// Notify admin when a new course is submitted
export const sendAdminNewCourseEmail = async (course, teacher, adminEmail) => {
  return await sendMail({
    to: adminEmail,
    subject: "New Course Submitted for Review",
    html: emailTemplate({
      title: "New Course Requires Review",
      message: `
        A new course has been submitted and requires your review.<br /><br />

        <strong>Course:</strong> ${course.title}<br />
        <strong>Teacher:</strong> ${teacher.name}<br />
        <strong>Teacher Email:</strong> ${teacher.email}<br /><br />

        Please review the complete course, including its sections and lectures,
        before approving or rejecting it.
      `,
    }),
  });
};

// Notify teacher after course approval
export const sendCourseApprovalEmail = async (course, teacher) => {
  return await sendMail({
    to: teacher.email,
    subject: "Course Approved",
    html: emailTemplate({
      title: "Course Approved Successfully",
      message: `
        Hi ${teacher.name},<br /><br />

        Congratulations! Your course
        <strong>${course.title}</strong> has been approved by the admin team.<br /><br />

        Your course is now available to students.
      `,
    }),
  });
};

// Notify teacher after course rejection
export const sendCourseRejectionEmail = async (
  course,
  teacher,
  rejectionReason
) => {
  return await sendMail({
    to: teacher.email,
    subject: "Course Rejected",
    html: emailTemplate({
      title: "Course Rejected",
      message: `
        Hi ${teacher.name},<br /><br />

        Unfortunately, your course
        <strong>${course.title}</strong> has been rejected by the admin team.<br /><br />

        <strong>Reason:</strong> ${
          rejectionReason || "No reason provided"
        }<br /><br />

        Please review the feedback and update your course accordingly.
      `,
    }),
  });
};

// Notify teacher after course update
export const sendCourseUpdateEmail = async (course, teacher) => {
  return await sendMail({
    to: teacher.email,
    subject: "Course Updated Successfully",
    html: emailTemplate({
      title: "Course Updated Successfully",
      message: `
        Hi ${teacher.name},<br /><br />

        Your course <strong>${course.title}</strong> has been updated
        successfully.<br /><br />

        Your course information has been updated successfully.
      `,
    }),
  });
};
export const sendSectionAddedEmail = async (course, teacher, section) => {
  return await sendMail({
    to: teacher.email,
    subject: "New Section Added to Your Course",
    html: emailTemplate({
      title: "New Section Added Successfully",
      message: `
        Hi ${teacher.name},<br /><br />

        A new section <strong>${section.title}</strong> has been added
        successfully to your course <strong>${course.title}</strong>.<br /><br />

        ${
          section.lectures?.length
            ? `Lecture added: <strong>${section.lectures[0].title}</strong>.<br /><br />`
            : ""
        }

        Your course has been updated successfully.
      `,
    }),
  });
};