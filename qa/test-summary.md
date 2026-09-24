# Test Summary

## Test Environment

- Date: 24 September 2026
- OS: Windows
- Browser: Codex in-app browser
- Backend: Java 17, Spring Boot 3.2.5, local port 8080
- Database: PostgreSQL/Supabase — unavailable with current local configuration
- API Tools: PowerShell `Invoke-WebRequest`, curl, Postman Collection และ Newman

## Test Execution Summary

ผลรวมด้านล่างนับ Manual/UI 20 cases และ API/HTTP 14 requests

- Total Test Cases/Requests: 34
- Passed: 18
- Failed: 2
- Blocked: 11
- Not Run: 3

## Manual / UI Testing

- Total: 20
- Passed: 9
- Failed: 1
- Blocked: 7
- Not Run: 3

ฟังก์ชันที่ยืนยันได้คือ page load, navigation, dark mode, language switch, setting persistence, map, search และ empty state โดย search บน Nearby ใช้ fallback dataset ใน JavaScript ไม่ใช่ผลจาก live API

## API Testing

- Requests Tested: 14
- Passed: 9
- Failed: 1
- Blocked: 4

Negative tests สำหรับ invalid UUID, missing query parameter, missing chat message, whitespace-only message, unsupported method และ missing maps URL ให้สถานะ 400/405 ตามที่ตรวจจากระบบจริง

API ที่ต้องใช้ฐานข้อมูลถูก block เพราะ datasource configuration ปัจจุบันเชื่อมต่อ PostgreSQL tenant ไม่ได้

Newman รัน 14 requests และ 30 assertions โดยผ่าน 20 assertions และไม่ผ่าน 10 assertions ผลที่ไม่ผ่านตรงกับ database blocker และ upload defect ที่บันทึกไว้ ไม่ได้แก้ expected status ให้ผ่านแบบหลอก ๆ

## Automated Baseline

Command: `.\mvnw.cmd test`

- Tests run: 1
- Failures: 0
- Errors: 0
- Build result: SUCCESS

อย่างไรก็ตาม Spring context log มี datasource error ระหว่าง `DatabaseSeeder` แต่ test ยังผ่าน จึงไม่ควรใช้ผล Maven test เพียงอย่างเดียวเพื่อสรุปว่า database/API พร้อมใช้งาน

## Defects

- Critical: 0
- High: 1
- Medium: 2
- Low: 0

## Overall Result

ส่วน static UI และฟังก์ชันที่ใช้ข้อมูลใน browser ทำงานได้ตามกรณีที่ทดสอบ แต่ core API ที่พึ่งพาฐานข้อมูลยังไม่พร้อมใน environment นี้ จึงยังไม่สามารถยืนยัน CRUD และ review lifecycle ได้

ก่อนนำผลไปใส่ Resume ควรแก้ datasource configuration แล้วรัน Postman Collection, CRUD tests, retest และ regression checklist อีกครั้ง จากนั้นอัปเดตตัวเลขในรายงานตามผลจริง
