# Testing Evidence

โฟลเดอร์นี้เก็บโน้ตผลที่เห็นตอนทดสอบ เพื่อใช้ย้อนดูว่าตัวเลขใน report มาจากไหน โดยไม่เก็บ secret หรือข้อมูลล็อกอินของระบบ

## ไฟล์หลักฐาน

- [API baseline execution](./API-baseline-2026-09-24.md)
- [UI manual execution](./UI-manual-2026-09-24.md)
- [Newman execution summary](./newman-summary-2026-09-24.md)

## สิ่งที่ระวังตอนเก็บหลักฐาน

- ไม่บันทึก `.env`, password, token, Supabase key หรือ Gemini key
- ตั้งชื่อไฟล์ให้ตรงกับ test case หรือ bug report
- ถ้าเก็บ screenshot เพิ่ม จะตั้งชื่อให้ผูกกับ test case เช่น `TC-UI-007-search-pass.png`
- ถ้ามีข้อมูลทดสอบ ให้ใช้ prefix `QA_TEST_` และลบเฉพาะข้อมูลที่ผู้ทดสอบสร้างเอง
