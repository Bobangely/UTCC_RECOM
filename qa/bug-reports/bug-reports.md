# Bug Reports

รายการนี้จดจากปัญหาที่เจอและลองทำซ้ำได้ในวันที่ 24 กันยายน 2026 ส่วนข้อสังเกตจากการอ่านโค้ดแยกไว้ท้ายไฟล์และยังไม่นับเป็น bug ที่ทดสอบแล้ว

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

API ควรเชื่อมต่อ datasource และตอบข้อมูล JSON พร้อม HTTP 200

**Actual Result:**

ทุก endpoint ตอบ HTTP 500 และใน server log แจ้งว่าหา PostgreSQL tenant/user ไม่เจอ โดยไม่ได้ใส่ค่า secret ลงในรายงานนี้

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

Server ควรปฏิเสธ request ที่ไม่ถูกต้องด้วย 4xx เช่น HTTP 400 และตอบข้อความสั้น ๆ ว่าส่งข้อมูลไม่ครบ

**Actual Result:**

Server ตอบ HTTP 500 และส่ง Java stack trace กลับมา โดยเริ่มจาก `MultipartException: Current request is not a multipart request`

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

หน้าเว็บควรบอกว่าโหลดข้อมูลจาก server ไม่สำเร็จ และถ้าทำได้ควรมีปุ่มให้ลองใหม่

**Actual Result:**

The page shows an empty-data message similar to “ไม่พบข้อมูลในระบบ / ลองค้นหาด้วยคำอื่น”, even though the real cause is an HTTP 500 connection failure. On the Nearby page, fallback data can also appear without identifying it as fallback data.

**Evidence:**

- `TC-UI-010`
- `/api/university/items` and `/api/nearby-places` returned HTTP 500 during the same run

**Status:** OPEN

## ข้อสังเกตจากการอ่านโค้ด (ยังไม่ได้นับเป็น bug)

- Admin mode มี password อยู่ใน frontend JavaScript และเก็บสถานะไว้ใน `localStorage` จุดนี้น่าจะต้องตรวจเรื่อง security เพิ่ม แต่รอบนี้ยังไม่ได้ยืนยันเป็น manual bug
- Entity หลาย field ยังไม่มี Jakarta Bean Validation ตอนรับ request ควรลอง invalid body และ boundary cases อีกครั้งหลัง datasource ใช้งานได้
