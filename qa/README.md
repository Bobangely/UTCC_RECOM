# QA ที่ลองทำกับโปรเจกต์ UTCC_RECOM

โฟลเดอร์นี้เป็นเอกสารที่ผมลองเขียนระหว่างทดสอบโปรเจกต์ UTCC_RECOM เพื่อฝึกงานด้าน QA/Tester โดยทดสอบจากระบบที่รันในเครื่องจริง แล้วจดผลตามที่เจอ ไม่ได้ตั้งใจให้เป็นเอกสารระดับบริษัทหรือ QA มืออาชีพ

## ส่วนที่ลองทดสอบ

- หน้าสถานที่ภายในมหาวิทยาลัย
- หน้าสถานที่รอบมหาวิทยาลัยและแผนที่
- การค้นหา, กรณีไม่พบข้อมูล, navigation, ภาษา และ Dark Mode
- REST API ของ building, place, nearby place, category, review, chat และ upload
- กรณีปกติ กรณีใส่ข้อมูลผิด และค่าขอบเขตบางส่วน

## วิธีที่ใช้

- เปิดทดสอบหน้าเว็บและดู Network ใน Browser Developer Tools
- เรียก API ด้วย PowerShell, curl และ Postman
- รัน Postman Collection ด้วย Newman
- รัน Maven test เพื่อดู baseline ของโปรเจกต์
- จด bug และทำ regression checklist ไว้สำหรับรอบแก้ไข

## ไฟล์ในโฟลเดอร์นี้

- [Manual Test Cases](./test-cases/manual-test-cases.md)
- [Bug Reports](./bug-reports/bug-reports.md)
- [Postman Collection](./api-testing/UTCC_RECOM.postman_collection.json)
- [Postman Environment](./api-testing/UTCC_RECOM.postman_environment.json)
- [API Test Report](./api-testing/api-test-report.md)
- [Regression Checklist](./regression/regression-checklist.md)
- [Test Summary](./test-summary.md)
- [Testing Evidence](./evidence/README.md)

## ผลที่ได้ในรอบนี้

Newman รันทั้งหมด 14 requests และ 30 assertions ส่วน CRUD ยังไม่ได้รัน เพราะตอนทดสอบ datasource เชื่อมต่อไม่ได้

ปัญหาหลักคือ API ที่ใช้ PostgreSQL ตอบ HTTP 500 เนื่องจาก local environment หา tenant/user ไม่เจอ ผมจึงใส่ผลเป็น `BLOCKED` แทนการเดาว่าฟังก์ชันผ่าน ส่วนหน้าเว็บที่ใช้ข้อมูล fallback ใน JavaScript ยังทดสอบ search, map, ภาษา และ Dark Mode ได้

ความหมายของสถานะที่ใช้:

- `PASS` — รันแล้วได้ผลตามที่คาดไว้
- `FAIL` — รันแล้วผลไม่ตรงกับที่คาดไว้
- `BLOCKED` — ยังรันต่อไม่ได้เพราะ environment หรือระบบที่ต้องใช้มีปัญหา
- `NOT RUN` — เขียนเคสไว้แล้ว แต่ยังไม่ได้รันในรอบนี้

หมายเหตุ: ไฟล์ Postman ไม่มี password, token, Supabase key หรือ Gemini key เก็บไว้ มีแค่ `base_url` และ placeholder เท่านั้น
