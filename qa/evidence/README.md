# Testing Evidence

โฟลเดอร์นี้เก็บหลักฐานการทดสอบที่ไม่มี secret หรือข้อมูลรับรองระบบ

## Available Evidence

- [API baseline execution](./API-baseline-2026-09-24.md)
- [UI manual execution](./UI-manual-2026-09-24.md)
- [Newman execution summary](./newman-summary-2026-09-24.md)

## Evidence Rules

- ไม่บันทึก `.env`, password, token, Supabase key หรือ Gemini key
- ตั้งชื่อไฟล์ให้ตรงกับ test case หรือ bug report
- Screenshot ในรอบถัดไปควรใช้ชื่อ เช่น `TC-UI-007-search-pass.png`
- ถ้ามีข้อมูลทดสอบ ให้ใช้ prefix `QA_TEST_` และลบเฉพาะข้อมูลที่ผู้ทดสอบสร้างเอง
