# LMS Backend QA Audit

## 1. Test Summary

- Total tests/checks: 3
- Passed: 0
- Failed: 2
- Skipped/blocked: 1
- Coverage: unavailable; no test framework or test suite is configured.

Executed checks:

1. `npm.cmd test` — failed: the script intentionally exits with `Error: no test specified`.
2. Current-app import/smoke test — failed: Node rejects `src/controllers/student.controller.js` with `SyntaxError: Duplicate export of 'getCourseProgress'`.
3. Live API testing — blocked because the current application module cannot load. A previously running process was not used as evidence because it may not represent the current source.

## 2. Critical Findings

| ID | Severity | Area | Endpoint/File | Problem | Status |
|---|---|---|---|---|---|
| BUG-001 | Critical | Startup | `src/controllers/student.controller.js` | Duplicate export prevents the application from loading. | Confirmed |
| BUG-002 | High | Admin auth | `src/controllers/admin.controller.js` | Active-admin login references undefined functions. | Confirmed by code audit |
| BUG-003 | High | Teacher approval | `src/controllers/admin.controller.js` | Approval references an undefined email function after database writes. | Confirmed by code audit |
| BUG-004 | High | Payments | `src/controllers/payment.controller.js` | Repeated checkout creation can create multiple pending payments for one student/course. | Confirmed by code audit |
| BUG-005 | High | Payments | `src/controllers/payment.controller.js` | A post-payment enrollment-write failure can leave a paid payment without enrollment. | Confirmed by code audit |

### BUG-001

- Severity: Critical
- File/endpoint: `src/controllers/student.controller.js`
- Problem: `getCourseProgress` is exported at declaration and again in the final export list.
- Reproduction/test case: `node --input-type=module -e "import('./src/app.js')"`
- Expected: The Express app imports successfully.
- Actual: Node throws `SyntaxError: Duplicate export of 'getCourseProgress'`.
- Recommended fix: Export each binding only once.

### BUG-002

- Severity: High
- File/endpoint: `src/controllers/admin.controller.js`, `POST /api/admin/login`
- Problem: `comparePassword` and `generateAccessToken` are used but not imported.
- Reproduction/test case: Log in with an existing active admin and valid credentials.
- Expected: HTTP 200 with an access token.
- Actual: A `ReferenceError` is thrown after the admin record is found.
- Recommended fix: Import the existing password-comparison and JWT helpers.

### BUG-003

- Severity: High
- File/endpoint: `src/controllers/admin.controller.js`, `PATCH /api/admin/teacher-requests/:id`
- Problem: `sendTeacherApprovalEmail` is called but not imported.
- Reproduction/test case: Approve a pending teacher request as an authorized reviewer.
- Expected: Teacher creation, request approval, and an approval-email attempt complete successfully.
- Actual: The request and teacher can be saved, then the undefined function throws and the endpoint returns HTTP 500.
- Recommended fix: Import the existing teacher approval email service and make the multi-document operation transactional if atomicity is required.

### BUG-004

- Severity: High
- File/endpoint: `src/controllers/payment.controller.js`, `POST /api/students/payments/create-checkout`
- Problem: Only active/completed enrollments are checked; existing pending payments/checkouts are ignored.
- Reproduction/test case: Submit two checkout requests for the same paid course before either payment completes.
- Expected: Reuse or reject an outstanding checkout.
- Actual: Each request creates a new pending `Payment` and Stripe Checkout session.
- Recommended fix: Enforce one pending payment/session per student and course, or reuse a valid existing session.

### BUG-005

- Severity: High
- File/endpoint: `src/controllers/payment.controller.js`, `POST /api/students/payments/webhook`
- Problem: The payment is marked `paid` before enrollment creation. If enrollment creation fails, later webhook retries return `Payment already processed` and do not repair the missing enrollment.
- Reproduction/test case: Cause `Enrollment.create` to fail after `payment.save` (for example, a concurrent unique-index insert).
- Expected: Payment and enrollment state remain recoverable and retries are idempotent.
- Actual: A paid payment can remain without an enrollment.
- Recommended fix: Use a MongoDB transaction or make webhook retries reconcile paid payments lacking enrollments.

## 3. Bugs

| ID | Severity | Area | Endpoint/File | Problem | Status |
|---|---|---|---|---|---|
| BUG-006 | Medium | Validation | `GET /api/courses/:id` | Invalid MongoDB IDs are not validated before querying and can produce a 500 CastError. | Confirmed in prior live check; present in current source |
| BUG-007 | Medium | Public catalog | `GET /api/courses` | Courses linked to inactive categories are not excluded by the base query. | Confirmed by code audit |
| BUG-008 | Medium | Deployment | Student model imports | `Student.model.js` differs from actual `student.model.js`. | Confirmed by code audit |

### BUG-006

- Severity: Medium
- File/endpoint: `src/controllers/course.controller.js`, `GET /api/courses/:id`
- Problem: Route parameter is passed to `Course.findOne` without ObjectId validation.
- Reproduction/test case: Request `/api/courses/not-an-id`.
- Expected: HTTP 400 or 404.
- Actual: A CastError reaches the generic handler and returns HTTP 500.
- Recommended fix: Validate route ObjectIds before database queries.

### BUG-007

- Severity: Medium
- File/endpoint: `src/controllers/course.controller.js`, `GET /api/courses`
- Problem: The filter checks course approval/active flags only. Category population uses `match: { isActive: true }`, which yields a null category rather than excluding the course.
- Reproduction/test case: Approve an active course, then deactivate its category and request the public listing.
- Expected: The course is absent from public discovery.
- Actual: The listing can include the course with a null category.
- Recommended fix: Filter courses by active category before returning the listing.

### BUG-008

- Severity: Medium
- File/endpoint: `src/controllers/student.controller.js`, `src/middlewares/student.middleware.js`, `src/controllers/admin.controller.js`
- Problem: Imports reference `../models/Student.model.js`; the repository file is `student.model.js`.
- Reproduction/test case: Start the app on a case-sensitive filesystem.
- Expected: Module resolution succeeds.
- Actual: Module resolution fails.
- Recommended fix: Use the exact filesystem casing consistently.

## 4. Security Findings

- `POST /api/upload/image` has no authentication requirement and accepts files based on filename extension rather than trusted content inspection. This permits anonymous public-file storage using renamed content. Recommended priority: P1.
- CORS is enabled with defaults for all origins. This is a production-readiness gap if authenticated browser clients are used. Recommended priority: P2.
- No rate limiting is configured for login, password-reset, verification-resend, or payment endpoints. Recommended priority: P2.

## 5. Business Logic Findings

- Course basic, section, lecture, and video updates preserve `approvalStatus` and do not notify admins, matching the stated business rule.
- Progress logic clamps duration/position, preserves maximum watched duration, verifies lecture membership, and only marks completion after full duration. It could not be executed because the application currently fails to import.
- Course completion is calculated from lectures belonging to the requested course, matching the stated rule.

## 6. Missing Features / Gaps

- No automated test framework, test files, fixtures, or coverage configuration exists; `npm test` is a failing placeholder.
- No global Express error middleware handles Multer errors consistently. Invalid or oversized uploads may receive framework-default error responses.
- No database transaction/reconciliation strategy protects multi-document teacher approval and paid-enrollment operations.

## 7. Validation Findings

- Course path parameters are not Joi/ObjectId validated before Mongoose queries (BUG-006).
- Checkout request body reads `courseId` directly without Joi validation. Malformed/missing IDs rely on Mongoose behavior and can return a generic HTTP 500.

## 8. Authorization Findings

- Teacher course mutation handlers consistently check course ownership before modifying sections, lectures, or video URLs.
- Student learning-content and progress handlers check active/completed enrollment before access.
- Full role-boundary execution is blocked by BUG-001 and lack of safe test credentials/fixtures.

## 9. Payment/Stripe Findings

- Checkout amount is derived from `course.price`, not a client-supplied price.
- Webhook route is registered before `express.json()` and uses `express.raw()`. Signature verification is present.
- Duplicate payment/enrollment state handling has the confirmed gaps in BUG-004 and BUG-005.
- Stripe end-to-end execution is blocked: no test Stripe credentials, signed test event, paid test course, or authenticated student fixture was available.

## 10. Progress Tracking Findings

- Static audit confirms validation for nonnegative fields, duration clamping, monotonic `watchedDuration`, lecture/course membership, and server-side completion checks.
- Execution is blocked by BUG-001 plus unavailable enrolled-student/course fixtures.

## 11. Test Coverage Gaps

- Student verification, reset, profile, enrollment, lecture access, and progress flows.
- Teacher application approval/rejection and ownership cases.
- Admin and Super Admin login/profile/role boundaries.
- Free enrollment duplicate handling.
- Stripe checkout, signed webhook, duplicate webhook, and payment failure handling.
- Upload MIME/size/static-access cases.
- Email delivery and recipient assertions.

## 12. Recommended Fix Priority

- P0: BUG-001 — restore application startup.
- P1: BUG-002, BUG-003, BUG-004, BUG-005; restrict and harden uploads.
- P2: BUG-006, BUG-007, BUG-008; add request validation, error middleware, rate limiting, CORS policy, and integration tests.
- P3: Add coverage reporting, fixtures, and production observability/reconciliation.

## 13. Final Verdict

- Production readiness: NO
- Biggest risks: The current source cannot start; admin login and teacher approval fail at runtime; payment flow can create duplicate or orphaned payment/enrollment state.
- Fix first: Resolve the duplicate export, then repair the undefined admin-controller dependencies and make paid-payment/enrollment processing recoverable.

Confirmed bugs are BUG-001 through BUG-008. Security and test-coverage items not marked as bugs are recommendations or blocked verification areas.
