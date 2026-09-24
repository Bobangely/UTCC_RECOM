# Bug Reports

บันทึกเฉพาะปัญหาที่พบและทำซ้ำได้ในการทดสอบวันที่ 24 กันยายน 2026

## BUG-001 — Database-backed APIs return HTTP 500 in the current environment

**Feature:** Database connection / core APIs

**Severity:** High

**Priority:** High

**Environment:** Windows, Spring Boot 3.2.5, PostgreSQL/Supabase configuration from local `.env`

**Preconditions:** Start the application with the current local environment configuration

**Steps to Reproduce:**

1. Run `.\mvnw.cmd spring-boot:run`.
2. Send `GET http://localhost:8080/api/places`.
3. Repeat with `/api/university/items`, `/api/nearby-places`, and `/api/nearby-categories`.

**Expected Result:**

The APIs connect to the configured datasource and return JSON data with HTTP 200.

**Actual Result:**

Each endpoint returns HTTP 500. The server log reports that the configured PostgreSQL tenant/user cannot be found. The secret value is intentionally not included in this report.

**Evidence:**

- [API execution evidence](../evidence/API-baseline-2026-09-24.md)
- `TC-UI-011` and `TC-UI-012`

**Status:** BLOCKED — datasource credentials/tenant configuration must be corrected before retest

---

## BUG-002 — Upload endpoint returns HTTP 500 for a non-multipart request

**Feature:** Multiple image upload API

**Severity:** Medium

**Priority:** Medium

**Environment:** Local Spring Boot at `http://localhost:8080`

**Preconditions:** Application is running

**Steps to Reproduce:**

1. Send `POST /api/upload/multiple` without multipart content and without a `files` field.
2. Inspect the response.

**Expected Result:**

The server should reject the invalid client request with a 4xx status such as HTTP 400 and a concise validation error.

**Actual Result:**

The server returns HTTP 500 Internal Server Error. The response includes a full Java stack trace beginning with `MultipartException: Current request is not a multipart request`.

**Evidence:**

- `API-012` in [API Test Report](../api-testing/api-test-report.md)
- [API execution evidence](../evidence/API-baseline-2026-09-24.md)

**Status:** OPEN

---

## BUG-003 — UI shows an empty-data state when the live API fails

**Feature:** Main page data loading / error feedback

**Severity:** Medium

**Priority:** Medium

**Environment:** Browser, datasource unavailable

**Preconditions:** Application is running and `/api/university/items` returns HTTP 500

**Steps to Reproduce:**

1. Open `http://localhost:8080/`.
2. Wait for the recommended places section to finish loading.
3. Compare the UI message with the network response.

**Expected Result:**

The user should see a clear message that data could not be loaded from the server, with an option to retry if possible.

**Actual Result:**

The page shows an empty-data message similar to “ไม่พบข้อมูลในระบบ / ลองค้นหาด้วยคำอื่น”, even though the real cause is an HTTP 500 connection failure. On the Nearby page, fallback data can also appear without identifying it as fallback data.

**Evidence:**

- `TC-UI-010`
- `/api/university/items` and `/api/nearby-places` returned HTTP 500 during the same run

**Status:** OPEN

## Code-review observations (not filed as executed bugs)

- Admin mode uses a password constant in frontend JavaScript and stores the enabled state in `localStorage`. This should be reviewed as a security/design concern, but it was not recorded as a confirmed manual defect in this run.
- Entity fields have few database constraints and no Jakarta Bean Validation annotations in request handling. Boundary/invalid-body behavior should be tested again after the datasource is available.
