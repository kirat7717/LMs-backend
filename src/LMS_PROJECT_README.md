# LMS Backend

## 1. Project Overview

This project is a **Learning Management System (LMS) Backend** built as a REST API.

The backend manages:

- Student accounts and learning
- Teacher applications and course management
- Admin management and approvals
- Super Admin management
- Course categories
- Course enrollment
- Lecture progress tracking
- Protected lecture video access
- Email verification and password reset
- Admin/Teacher notification emails
- Stripe payments
- Image and video uploads
- Role-based authorization
- API validation
- Dashboards

---

# 2. Technology Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT**
- **Joi**
- **Nodemailer**
- **Stripe**
- **Multer**
- **Swagger / OpenAPI**
- **Postman**

---

# 3. User Roles

The LMS has four main roles:

```text
Student
Teacher
Admin
Super Admin
```

Each role has different permissions.

### Student

Students can:

- Register
- Verify their account
- Login
- Manage their profile
- Browse courses
- Enroll in free courses
- Purchase paid courses
- Access enrolled course content
- Watch protected lecture videos
- Track learning progress
- View their dashboard

### Teacher

Teachers can:

- Submit a Teacher application
- Login after approval
- Manage their profile
- Create courses
- Update their own courses
- Add/update/delete sections
- Add/update/delete lectures
- Upload lecture videos
- View their courses
- View Teacher dashboard information

### Admin

Admins can:

- Login
- Manage their profile
- View dashboard
- Review Teacher applications
- Approve/reject Teacher applications
- Block/unblock Teachers
- Block/unblock Students
- Review courses
- Approve/reject courses
- Create/update/delete categories

### Super Admin

Super Admins can:

- Login
- Manage their profile
- View system dashboard
- Create/invite Admin accounts
- Perform the administrative management functions available to the Super Admin role

---

# 4. Authentication

Protected APIs use JWT Bearer Authentication.

```http
Authorization: Bearer <token>
```

The token must belong to the role required by the endpoint.

Examples:

```text
studentToken
teacherToken
adminToken
superAdminToken
```

Authentication and authorization are separate concepts:

```text
Authentication
    ↓
Who is the user?

Authorization
    ↓
What is this user allowed to do?
```

---

# 5. Student Account Verification

Student registration starts with an unverified account.

```text
Student Registration
        ↓
Create Student
        ↓
isVerified = false
        ↓
Generate verification token
        ↓
Send verification email
        ↓
Student opens verification link
        ↓
Verify token
        ↓
isVerified = true
```

`isVerified` represents email/account verification status.

It is separate from:

```text
isActive
isBlocked
approvalStatus
```

These fields represent different account/business states.

---

# 6. Resend Verification Email

If a Student does not receive the verification email or the previous token expires:

```text
Request Resend Verification
        ↓
Find account
        ↓
Generate new token
        ↓
Generate new expiry
        ↓
Send verification email
        ↓
Student uses new verification link
```

The new verification token replaces the previous verification token.

---

# 7. Password Reset Flow

The password reset process is token based.

```text
Forgot Password
      ↓
Find account
      ↓
Generate reset token
      ↓
Set token expiry
      ↓
Send reset email
      ↓
User opens reset link
      ↓
Submit new password
      ↓
Validate token + expiry
      ↓
Hash new password
      ↓
Save password
      ↓
Clear reset token
```

Passwords are never sent through email.

Passwords are stored as hashed values.

---

# 8. Teacher Registration Flow

Teacher registration is an application process.

A Teacher applicant does not immediately become an active Teacher.

```text
Teacher Application
        ↓
Validate application
        ↓
Create TeacherRequest
        ↓
status = pending
        ↓
Send registration email
        ↓
Admin / Super Admin reviews
          ↙        ↘
      Approve       Reject
         ↓            ↓
 Create Teacher   Save rejection
         ↓            ↓
 Teacher Login    Decision email
```

After approval, the applicant can login as a Teacher.

---

# 9. Teacher Course Flow

A Teacher creates and manages their own courses.

```text
Teacher Login
      ↓
Create Course
      ↓
approvalStatus = pending
      ↓
Add Sections
      ↓
Add Lectures
      ↓
Upload Videos
      ↓
Admin / Super Admin Review
        ↙        ↘
    Approved    Rejected
       ↓
Public Course Catalogue
```

New Teacher-created courses start as:

```text
approvalStatus = pending
```

Only approved and active courses should appear in the public course catalogue.

Normal Teacher course/content updates preserve the existing approval status.

---

# 10. Course Structure

The course structure is:

```text
Course
   ↓
Sections
   ↓
Lectures
   ↓
Video
```

A course can contain multiple sections.

A section can contain multiple lectures.

Lectures contain information such as:

- Title
- Thumbnail
- Video URL
- Duration

---

# 11. Teacher Video Upload

Video upload is a separate protected Teacher API.

```text
POST /api/teachers/upload-video
```

The Teacher sends:

```text
multipart/form-data
video = <video file>
```

Supported video formats:

```text
.mp4
.webm
.mov
```

Maximum size:

```text
100 MB
```

The API uploads the video and returns a `videoUrl`.

It does not require:

```text
courseId
sectionId
lectureId
```

It does not create or update a lecture.

### Video workflow

```text
Teacher
   ↓
Upload Video
   ↓
Receive videoUrl
   ↓
Use videoUrl in lecture payload
   ↓
Create / Update Lecture
```

When replacing a lecture video:

```text
Upload new video
      ↓
Receive new videoUrl
      ↓
Update lecture with new videoUrl
```

---

# 12. Image Upload

Image upload is a separate API:

```text
POST /api/upload/image
```

Request:

```text
multipart/form-data
image = <image file>
```

Supported image formats:

```text
.jpg
.jpeg
.png
```

Maximum size:

```text
5 MB
```

The image upload can be used for:

- Student avatar
- Teacher avatar
- Admin avatar
- Course thumbnail
- Lecture thumbnail

---

# 13. Image vs Video Upload

| Feature | Image Upload | Video Upload |
|---|---|---|
| Endpoint | `/api/upload/image` | `/api/teachers/upload-video` |
| Authentication | Public | Teacher JWT |
| Field | `image` | `video` |
| Formats | JPG/JPEG/PNG | MP4/WEBM/MOV |
| Max Size | 5 MB | 100 MB |
| Purpose | Images | Lecture videos |

---

# 14. Public Course Catalogue

Public users can browse approved and active courses.

```text
GET /api/courses
GET /api/courses/{id}
GET /api/categories
```

Course listing supports:

```text
search
category
page
limit
```

The public course response should not expose protected lecture video access.

---

# 15. Free Course Enrollment

For a free course:

```text
Student
   ↓
Browse Course
   ↓
POST /api/students/enroll/{courseId}
   ↓
Check Course
   ↓
Check existing Enrollment
   ↓
Create Enrollment
   ↓
Enrollment = active
   ↓
Student gets learning access
```

A paid course should not be directly enrolled through this endpoint.

---

# 16. Paid Course Payment Flow

Paid courses use Stripe.

```text
Student
   ↓
Select Paid Course
   ↓
Create Checkout Session
   ↓
Local Payment = pending
   ↓
Stripe Checkout
   ↓
Student completes payment
   ↓
Stripe sends Webhook
   ↓
Verify webhook signature
   ↓
Verify Payment / Student / Course
   ↓
Create Enrollment
   ↓
Payment = paid
   ↓
Enrollment = active
   ↓
Enrollment success email
   ↓
Student gets course access
```

The backend uses the Stripe webhook as the payment confirmation mechanism.

The browser success redirect should not be treated as proof that payment was successfully processed.

---

# 17. Stripe Webhook

Webhook endpoint:

```text
POST /api/students/payments/webhook
```

The webhook does not use JWT.

Stripe signature verification is used.

The Express application receives the raw Stripe request body so that the signature can be verified correctly.

The webhook verifies the relationship between:

```text
Stripe Session
Payment
Student
Course
```

After successful processing:

```text
Payment → paid
Enrollment → active
Email → sent
```

The webhook route must be registered before normal `express.json()` middleware.

---

# 18. Student Learning Flow

```text
Register
   ↓
Verify Account
   ↓
Login
   ↓
Receive JWT
   ↓
Browse Courses
   ↓
Free Enrollment OR Paid Checkout
   ↓
Enrollment Active
   ↓
Get Enrolled Course
   ↓
Get Lecture
   ↓
Get Protected Video
   ↓
Watch Video
   ↓
Update Progress
   ↓
Course Completion
```

---

# 19. Protected Lecture Video

Students cannot access protected lecture videos simply through a public URL.

The Student must:

```text
Have valid JWT
       ↓
Be enrolled in course
       ↓
Course must be available
       ↓
Lecture must belong to course/section
       ↓
Return protected video
```

Student video endpoint:

```text
GET /api/students/courses/{courseId}/sections/{sectionId}/lectures/{lectureId}/video
```

The frontend can use the authenticated response for video playback.

---

# 20. Course Progress

Student progress is updated using:

```text
PATCH /api/students/courses/{courseId}/progress
```

Example:

```json
{
  "lectureId": "<lectureId>",
  "watchedDuration": 60,
  "lastPosition": 60,
  "isCompleted": false
}
```

The backend stores lecture progress and calculates overall course progress.

Progress can be retrieved using:

```text
GET /api/students/courses/{courseId}/progress
```

Typical flow:

```text
Watch Lecture
     ↓
Update watchedDuration
     ↓
Update lastPosition
     ↓
Completion Check
     ↓
Recalculate Course Progress
```

---

# 21. Dashboards

The project provides dashboards for the main management/learning roles.

### Student Dashboard

Provides learning-related information such as:

- Total courses
- Active courses
- Completed courses
- Continue learning
- Recent courses
- Progress

### Teacher Dashboard

Provides information related to:

- Teacher courses
- Course statistics
- Student/enrollment information
- Course progress

### Admin Dashboard

Provides platform management information such as:

- Students
- Teachers
- Courses
- Approval states
- Platform statistics

### Super Admin Dashboard

Provides higher-level system information including:

- Students
- Teachers
- Courses
- Admin management
- Platform statistics

---

# 22. Admin Management Flow

Admins manage important platform operations.

```text
Admin Login
    ↓
Dashboard
    ↓
Teacher Requests
    ↓
Approve / Reject
    ↓
Teachers
    ↓
Block / Unblock
    ↓
Students
    ↓
Block / Unblock
    ↓
Courses
    ↓
Approve / Reject
    ↓
Categories
    ↓
Create / Update / Delete
```

---

# 23. Super Admin and Admin Invitation

Super Admin can create/invite Admin accounts.

```text
Super Admin
     ↓
Create Admin
     ↓
Admin account created
     ↓
Setup token generated
     ↓
Invitation email
     ↓
Admin opens setup link
     ↓
Set Admin Password
     ↓
Admin Login
```

The invited Admin completes the password setup before normal Admin login.

---

# 24. API Groups

The main API groups are:

```text
/api/students
/api/teachers
/api/admin
/api/super-admin
/api/courses
/api/categories
/api/upload
/api/students/payments
```

---

# 25. Main API Inventory

## Student

```text
POST  /api/students/register
GET   /api/students/verify-account
POST  /api/students/resend-verification
POST  /api/students/login
POST  /api/students/forgot-password
POST  /api/students/reset-password

GET   /api/students/profile
PUT   /api/students/profile

POST  /api/students/enroll/{courseId}
GET   /api/students/enrollments
GET   /api/students/enrollments/{courseId}

GET   /api/students/courses/{courseId}/sections/{sectionId}/lectures/{lectureId}
GET   /api/students/courses/{courseId}/sections/{sectionId}/lectures/{lectureId}/video

PATCH /api/students/courses/{courseId}/progress
GET   /api/students/courses/{courseId}/progress

GET   /api/students/dashboard
```

## Teacher

```text
POST   /api/teachers/register
POST   /api/teachers/login
POST   /api/teachers/forgot-password
POST   /api/teachers/reset-password

GET    /api/teachers/profile
PATCH  /api/teachers/profile
POST   /api/teachers/logout

GET    /api/teachers/dashboard

GET    /api/teachers/courses
GET    /api/teachers/courses/{courseId}

POST   /api/teachers
PATCH  /api/teachers/{courseId}

POST   /api/teachers/{courseId}/sections
PATCH  /api/teachers/{courseId}/sections/{sectionId}
DELETE /api/teachers/{courseId}/sections/{sectionId}

POST   /api/teachers/{courseId}/sections/{sectionId}/lectures
PATCH  /api/teachers/{courseId}/sections/{sectionId}/lectures/{lectureId}
DELETE /api/teachers/{courseId}/sections/{sectionId}/lectures/{lectureId}

POST   /api/teachers/upload-video
```

## Admin

```text
POST   /api/admin/set-password
POST   /api/admin/login

GET    /api/admin/profile
PATCH  /api/admin/profile

GET    /api/admin/dashboard

GET    /api/admin/teacher-requests
PATCH  /api/admin/teacher-requests/{id}

GET    /api/admin/teachers
PATCH  /api/admin/teachers/{id}/status

GET    /api/admin/students
PATCH  /api/admin/students/{id}/status

GET    /api/admin/courses
PATCH  /api/admin/courses/{id}

POST   /api/admin/categories
GET    /api/admin/categories
PATCH  /api/admin/categories/{id}
DELETE /api/admin/categories/{id}
```

## Super Admin

```text
POST  /api/super-admin/login
POST  /api/super-admin/forgot-password
POST  /api/super-admin/reset-password

GET   /api/super-admin/profile
PATCH /api/super-admin/profile

POST  /api/super-admin/admins

GET   /api/super-admin/dashboard
```

## Public

```text
GET /api/courses
GET /api/courses/{id}
GET /api/categories
```

## Upload

```text
POST /api/upload/image
POST /api/teachers/upload-video
```

## Payments

```text
POST /api/students/payments/create-checkout-session
POST /api/students/payments/webhook
```

---

# 26. Validation

Joi is used for request validation.

Validation includes things such as:

- Required fields
- String length
- Email format
- Password validation
- MongoDB ObjectId validation
- Numeric values
- Enum values
- Pagination
- Course fields
- Section fields
- Lecture fields
- Payment/course IDs

Invalid request data normally results in:

```text
HTTP 400
```

---

# 27. Authorization and Ownership

Authentication confirms the user's identity.

Authorization confirms the user's role/permission.

Teacher course/content APIs additionally verify ownership.

Example:

```text
Teacher JWT
    ↓
Teacher role check
    ↓
Find course
    ↓
Verify course belongs to authenticated Teacher
    ↓
Allow operation
```

A Teacher should not be able to modify another Teacher's course.

---

# 28. Role Permission Matrix

| Functionality | Student | Teacher | Admin | Super Admin |
|---|:---:|:---:|:---:|:---:|
| Student authentication/profile | Yes | No | No | No |
| Student enrollment/learning | Yes | No | No | No |
| Student progress | Yes | No | No | No |
| Teacher application | No | Yes | Review | Review |
| Teacher course management | No | Yes | No | No |
| Course approval | No | No | Yes | Yes |
| Teacher management | No | No | Yes | Yes |
| Student block/unblock | No | No | Yes | Yes |
| Category CRUD | No | No | Yes | Yes |
| Admin profile/dashboard | No | No | Yes | No |
| Super Admin profile/dashboard | No | No | No | Yes |
| Create Admin | No | No | No | Yes |

---

# 29. Email Workflows

Email side effects are used for important account and business events.

### Student

```text
Registration
    → Verification Email

Resend Verification
    → Verification Email

Forgot Password
    → Password Reset Email
```

### Teacher

```text
Teacher Application
    → Registration/notification email

Application Approved/Rejected
    → Decision Email

Forgot Password
    → Password Reset Email

Password Reset
    → Password-related confirmation email

Profile Update
    → Profile update email
```

### Course

```text
Teacher creates course
    → Teacher notification
    → Admin notification
```

### Enrollment

```text
Successful paid enrollment
    → Enrollment success email
```

### Admin

```text
Super Admin creates Admin
    → Admin invitation email

Admin completes password setup
    → Setup/password confirmation flow
```

---

# 30. Response Convention

Most APIs use a structure similar to:

### Success

```json
{
  "success": true,
  "message": "Human-readable message",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Reason for failure"
}
```

The exact `data` structure depends on the endpoint.

---

# 31. Security Rules

The project follows these important rules:

1. Passwords are hashed before storage.
2. Passwords are never returned to clients.
3. JWT is required for protected APIs.
4. Role-based authorization protects role-specific APIs.
5. Teacher ownership is checked for Teacher course/content operations.
6. Stripe webhook signatures are verified.
7. Stripe secrets must remain on the backend.
8. Verification/reset/setup tokens have expiry.
9. Protected lecture videos are not intended to be publicly exposed.
10. Paid enrollment is confirmed through the Stripe webhook.

---

# 32. Frontend Integration Rules

Frontend developers should:

1. Use the correct role token.
2. Send the JWT using the Bearer format.
3. Use IDs returned by previous APIs for dependent requests.
4. Use `/api/courses` for public course browsing.
5. Use the appropriate enrollment flow based on course price.
6. Use Stripe Checkout for paid courses.
7. Wait for backend payment confirmation.
8. Use `/api/upload/image` for image uploads.
9. Use `/api/teachers/upload-video` for Teacher video uploads.
10. Use the returned `videoUrl` when creating/updating lectures.
11. Use the protected Student video endpoint for lecture playback.
12. Update course progress while the Student watches lectures.
13. Never expose backend secrets in frontend code.

---

# 33. Development and Testing

The project APIs can be tested using:

- Postman
- cURL
- Swagger UI

Testing should verify:

```text
Request
   ↓
Validation
   ↓
Authentication
   ↓
Authorization
   ↓
Business Logic
   ↓
Database State
   ↓
Email / External Side Effect
   ↓
Response
```

Important business flows should be verified end-to-end instead of checking only the HTTP response.

Examples:

```text
Registration
→ DB account
→ verification token
→ email

Teacher approval
→ Teacher account
→ active/blocked state
→ decision email

Course approval
→ approvalStatus
→ public catalogue visibility

Paid payment
→ Stripe
→ webhook
→ Payment = paid
→ Enrollment = active
→ enrollment email
```

---

# 34. Project Completion Summary

The LMS Backend provides the core backend functionality required for:

```text
Authentication
       +
Email Verification
       +
Password Reset
       +
Role-Based Authorization
       +
Teacher Applications
       +
Course Management
       +
Course Approval
       +
Category Management
       +
Free Enrollment
       +
Stripe Paid Enrollment
       +
Protected Video Access
       +
Progress Tracking
       +
Dashboards
       +
File Uploads
       +
Email Notifications
```

---

# 35. Final Handoff Notes

This README describes the current LMS Backend project and its major API/business flows.

For frontend integration, the backend API routes, request payloads, authentication requirements, validation rules, and response structures should be treated as the integration contract.

If an API implementation changes, the README and API documentation should be updated together.

The project can be handed over with:

```text
Backend Source Code
+
Environment Configuration
+
Swagger Documentation
+
Postman Collection
+
README
```

Sensitive values such as:

```text
JWT secrets
MongoDB credentials
SMTP credentials
Stripe secret keys
Stripe webhook secrets
```

must not be committed to the repository.
