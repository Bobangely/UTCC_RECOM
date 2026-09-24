# UTCC_RECOM QA Portfolio

## Purpose

โฟลเดอร์นี้รวบรวมเอกสารทดสอบที่ทำกับโปรเจกต์ UTCC_RECOM จริง เพื่อแสดงขั้นตอนการฝึกงานด้าน QA/Tester ตั้งแต่การสำรวจระบบ ออกแบบ test case รันทดสอบ บันทึก defect และเตรียม regression test

งานชุดนี้เป็นผลงานระดับเริ่มต้น ไม่ได้อ้างว่าเป็นประสบการณ์ QA ระดับมืออาชีพ

## Test Scope

- หน้าแนะนำสถานที่ภายในมหาวิทยาลัย
- หน้าสถานที่รอบมหาวิทยาลัยและแผนที่
- Search, empty state, navigation, language และ dark mode
- REST APIs สำหรับ building, place, nearby place, category, review, chat และ upload
- Positive, negative และ boundary scenarios ตามพฤติกรรมที่มีอยู่จริง

## Testing Performed

- Manual functional testing
- Positive and negative testing
- Basic boundary test design
- REST API testing
- Bug reporting
- Regression checklist preparation

## Tools Used

- Browser และ Browser Developer Tools
- PowerShell / curl สำหรับเรียก API baseline
- Maven
- Postman Collection และ Newman runner
- Git / GitHub

## Documents

- [Manual Test Cases](./test-cases/manual-test-cases.md)
- [Bug Reports](./bug-reports/bug-reports.md)
- [Postman Collection](./api-testing/UTCC_RECOM.postman_collection.json)
- [Postman Environment](./api-testing/UTCC_RECOM.postman_environment.json)
- [API Test Report](./api-testing/api-test-report.md)
- [Regression Checklist](./regression/regression-checklist.md)
- [Test Summary](./test-summary.md)
- [Testing Evidence](./evidence/README.md)

Newman รัน 14 requests และ 30 assertions จริงในรอบนี้ โดยไม่รัน CRUD folder เพราะ datasource ยังไม่พร้อม

## Current Limitation

วันที่ 24 กันยายน 2026 แอปเริ่มทำงานและเปิด static pages ได้ แต่ datasource ที่ตั้งค่าไว้ตอบกลับว่า PostgreSQL tenant/user ไม่พบ ทำให้ API ที่ต้องอ่านหรือเขียนฐานข้อมูลตอบ HTTP 500

กรณีที่ต้องใช้ฐานข้อมูลจึงถูกบันทึกเป็น `BLOCKED` ไม่ได้บันทึกเป็น `PASS` ส่วนหน้า nearby ยังแสดง fallback data ภายใน JavaScript ได้ จึงทดสอบ search และ UI บางส่วนได้โดยไม่ถือว่าเป็นข้อมูลจาก API

## Status Meaning

- `PASS` — รันแล้วและผลตรงกับ expected result
- `FAIL` — รันแล้วและพบผลต่างจาก expected result
- `BLOCKED` — รันต่อไม่ได้เพราะ environment หรือ dependency
- `NOT RUN` — ออกแบบไว้แล้วแต่ยังไม่ได้รัน

## Safety

Postman environment มีเพียง `base_url` และ placeholder เท่านั้น ไม่มี password, token, Supabase key หรือ Gemini key
