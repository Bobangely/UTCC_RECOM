# API Test Report

วันที่ทดสอบ: 24 กันยายน 2026

Base URL: `http://localhost:8080`

การรันรอบนี้ตรวจ baseline ด้วย PowerShell/curl และรัน collection ซ้ำด้วย Newman จริง โดยเลือกเฉพาะ Page Availability, Read APIs และ Negative API Tests ไม่ได้รัน CRUD folder เพราะ datasource ยังไม่พร้อม

| ID | Method | Endpoint | Scenario | Expected | Actual | Status |
|---|---|---|---|---|---|---|
| API-001 | GET | `/api/university/items` | ดึงข้อมูลมหาวิทยาลัย | 200 + JSON array | 500 datasource connection error | BLOCKED |
| API-002 | GET | `/api/places` | ดึงสถานที่ทั้งหมด | 200 + JSON array | 500 datasource connection error | BLOCKED |
| API-003 | GET | `/api/nearby-places` | ดึงสถานที่รอบมหาวิทยาลัย | 200 + JSON array | 500 datasource connection error | BLOCKED |
| API-004 | GET | `/api/nearby-categories` | ดึงหมวดหมู่เรียงตาม sort order | 200 + JSON array | 500 datasource connection error | BLOCKED |
| API-005 | GET | `/api/places/not-a-uuid` | UUID ผิดรูปแบบ | 400 | 400 | PASS |
| API-006 | GET | `/api/places/search` | ไม่ส่ง query `name` | 400 | 400 | PASS |
| API-007 | GET | `/api/nearby-places/search` | ไม่ส่ง query `name` | 400 | 400 | PASS |
| API-008 | POST | `/api/chat` | Body ไม่มี message | 400 + error message | 400 + `message is required` | PASS |
| API-009 | POST | `/api/chat` | message มีแต่ช่องว่าง | 400 + error message | 400 + `message is required` | PASS |
| API-010 | PATCH | `/api/chat` | HTTP method ไม่รองรับ | 405 | 405 | PASS |
| API-011 | GET | `/api/util/resolve-maps-url` | ไม่ส่ง query `url` | 400 | 400 | PASS |
| API-012 | POST | `/api/upload/multiple` | ไม่ส่ง multipart body/files | 400 client error | 500 + full stack trace | FAIL |
| API-013 | GET | `/` | ตรวจหน้าเว็บหลัก | 200 HTML | 200 HTML | PASS |
| API-014 | GET | `/nearby.html` | ตรวจหน้า Nearby | 200 HTML | 200 HTML | PASS |

## Totals

- Requests Tested: 14
- PASS: 9
- FAIL: 1
- BLOCKED: 4

## Newman Run Result

- Requests executed: 14
- Assertions executed: 30
- Assertions passed: 20
- Assertions failed: 10
- Total duration: 13 seconds
- Average response time: 854 ms
- Minimum response time: 2 ms
- Maximum response time: 3.6 seconds

สาเหตุของ assertion failures:

- 8 failures มาจาก 4 read APIs ที่ตอบ 500 และ response ไม่ใช่ JSON array ตาม contract ที่คาดไว้
- 2 failures มาจาก upload endpoint ที่ตอบ 500 และมี Java stack trace ใน response

ดู [Newman execution summary](../evidence/newman-summary-2026-09-24.md)

## Response-time Notes

Negative requests API-005 ถึง API-012 ตอบกลับประมาณ 1–213 ms ใน local run ยกเว้นการเชื่อม datasource ซึ่งอาจรอ timeout หลายวินาที

## Postman Collection

Collection มี requests ที่รันแล้วด้านบน พร้อม assertions สำหรับ status, JSON content และ response time รวมถึง CRUD lifecycle template สำหรับ `Place`

CRUD folder ยังไม่ได้รัน เพราะ database unavailable ทุกข้อมูลทดสอบใช้ชื่อขึ้นต้นด้วย `QA_TEST_` และ delete request จะอ้างเฉพาะ ID ที่สร้างใน collection variable

## Retest Needed

1. แก้ PostgreSQL/Supabase configuration โดยไม่ commit secret
2. Import environment และ collection เข้า Postman
3. รัน Read APIs และ Negative Tests
4. รัน CRUD Lifecycle บน test database เท่านั้น
5. Export Postman run result มาเก็บใน `qa/evidence/`
6. อัปเดต Actual Result และตัวเลขสรุป
