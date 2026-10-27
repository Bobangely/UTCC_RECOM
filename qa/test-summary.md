# สรุปผลการทดสอบ

ทดสอบวันที่ 24 กันยายน 2026 บน Windows โดยรัน Spring Boot ที่ `http://localhost:8080` และเปิดหน้าเว็บผ่าน Codex in-app browser

ตอนทดสอบ PostgreSQL/Supabase ยังเชื่อมต่อไม่ได้ จึงมีหลายเคสที่ต้องใส่เป็น `BLOCKED` โดยเฉพาะ API และ CRUD ที่ต้องใช้ข้อมูลจากฐานข้อมูล

## ผลรวม

นับรวม Manual/UI 20 เคส และ API/HTTP 14 requests

- ทั้งหมด: 34
- PASS: 18
- FAIL: 2
- BLOCKED: 11
- NOT RUN: 3

## Manual / UI

- ทั้งหมด: 20
- PASS: 9
- FAIL: 1
- BLOCKED: 7
- NOT RUN: 3

ส่วนที่ทดสอบผ่านคือการเปิดหน้าเว็บ, navigation, Dark Mode, เปลี่ยนภาษา, การจำค่าตั้งค่า, แผนที่, search และ empty state โดยข้อมูลที่ใช้ค้นหาในหน้า Nearby เป็น fallback dataset ใน JavaScript ไม่ใช่ข้อมูลจาก live API

## API

- Requests ที่รัน: 14
- PASS: 9
- FAIL: 1
- BLOCKED: 4

Negative test ที่ลองมี invalid UUID, ไม่ส่ง query parameter, ไม่ส่งข้อความให้ chat, ส่งข้อความที่มีแต่ช่องว่าง, ใช้ method ที่ไม่รองรับ และไม่ส่ง maps URL ซึ่งระบบตอบ 400/405 ตามที่คาดไว้

API ที่ต้องอ่านข้อมูลจากฐานข้อมูลตอบ HTTP 500 เพราะ datasource เชื่อมต่อ PostgreSQL tenant ไม่ได้ ส่วน upload endpoint ตอบ HTTP 500 พร้อม stack trace เมื่อส่ง request ที่ไม่ใช่ multipart จึงบันทึกไว้เป็น bug

Newman รัน 14 requests และ 30 assertions ผ่าน 20 และไม่ผ่าน 10 จุด ผลที่ไม่ผ่านมาจาก database blocker และ upload bug ข้างต้น จึงไม่ได้แก้ assertion เพื่อให้รายงานดูผ่าน

## Maven baseline

คำสั่งที่ใช้ในรอบเดิม: `.\mvnw.cmd test`

- Tests run: 1
- Failures: 0
- Errors: 0
- Build result: SUCCESS

แม้ Maven test จะผ่าน แต่ใน log ยังมี datasource error ตอน `DatabaseSeeder` ทำงาน ดังนั้นผลนี้บอกได้แค่ว่า test เดิมผ่าน ไม่ได้แปลว่า database และ API พร้อมใช้งานทั้งหมด

## Bug ที่จดไว้

- Critical: 0
- High: 1
- Medium: 2
- Low: 0

## สรุปที่เข้าใจจากการทดสอบ

หน้าเว็บส่วนที่เป็น static และฟังก์ชันที่ใช้ข้อมูล fallback ยังใช้งานได้ตามปกติ แต่ API ที่ต้องต่อฐานข้อมูลและ CRUD ยังยืนยันผลไม่ได้ ต้องแก้ datasource configuration แล้วค่อยรันซ้ำ ส่วนรายละเอียดแต่ละเคสอยู่ใน [Manual Test Cases](./test-cases/manual-test-cases.md), [API Report](./api-testing/api-test-report.md) และ [Bug Reports](./bug-reports/bug-reports.md)
