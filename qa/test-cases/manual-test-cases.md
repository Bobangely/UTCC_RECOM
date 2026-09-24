# Manual Test Cases

วันที่ทดสอบ: 24 กันยายน 2026

Environment: Windows, local Spring Boot (`http://localhost:8080`), Codex in-app browser

Database: PostgreSQL/Supabase connection unavailable during execution

| ID | Feature | Test Scenario | Preconditions | Test Steps | Test Data | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|---|---|---|
| TC-UI-001 | Home page | เปิดหน้าหลัก | Spring Boot ทำงาน | 1. เปิด `/` | N/A | หน้าเว็บโหลดสำเร็จและมีชื่อ UTCCRECOM | ตอบ HTTP 200 และแสดงหน้า UTCC Places Recommender | PASS |
| TC-UI-002 | Nearby page | เปิดหน้าสถานที่รอบมหาวิทยาลัย | Spring Boot ทำงาน | 1. เปิด `/nearby.html` | N/A | หน้าเว็บโหลดสำเร็จ | ตอบ HTTP 200 และแสดงหัวข้อสถานที่รอบมหาวิทยาลัย | PASS |
| TC-UI-003 | Navigation | ไปจากหน้าหลักไปหน้า Nearby | อยู่หน้าหลัก | 1. กด “สถานที่รอบมหาลัย” | N/A | URL เปลี่ยนเป็น `/nearby.html` | นำทางไป `/nearby.html` สำเร็จ | PASS |
| TC-UI-004 | Settings | เปิด Dark Mode | อยู่หน้าหลัก | 1. เปิด Settings<br>2. เปิด Dark Mode | enabled | ธีมเปลี่ยนเป็น dark | Checkbox เปลี่ยนเป็นเปิดและ `data-theme` เป็น `dark` | PASS |
| TC-UI-005 | Language | เปลี่ยนภาษาไทยเป็นอังกฤษ | อยู่หน้าหลัก | 1. เปิด Settings<br>2. กด EN | EN | ข้อความหลักเปลี่ยนเป็นภาษาอังกฤษ | Heading เปลี่ยนเป็น “Discover Interesting Places Around UTCC” | PASS |
| TC-UI-006 | Settings persistence | ตรวจ theme/language หลังเปลี่ยนหน้า | ตั้ง Dark Mode และ EN แล้ว | 1. ไปหน้า Nearby<br>2. ตรวจ Settings และ heading | dark, EN | ค่าที่เลือกยังคงอยู่ | Nearby แสดง Dark Mode เปิดและข้อความภาษาอังกฤษ | PASS |
| TC-UI-007 | Nearby search | ค้นหาสถานที่ที่มีอยู่ใน fallback data | หน้า Nearby โหลด fallback data | 1. กรอกคำค้นหา<br>2. กดค้นหา | `สุกี้` | แสดงเฉพาะผลลัพธ์ที่เกี่ยวข้อง | แสดง 1 สถานที่ คือ “สุกี้นายพัน” | PASS |
| TC-UI-008 | Nearby search | ค้นหาคำที่ไม่มีผลลัพธ์ | หน้า Nearby โหลด fallback data | 1. กรอกคำค้นหา<br>2. กดค้นหา | `ไม่มีสถานที่ชื่อนี้` | แสดง empty state | แสดง `0 สถานที่` และ “ไม่พบสถานที่ที่คุณค้นหา” | PASS |
| TC-UI-009 | Map | แสดงแผนที่สถานที่รอบมหาวิทยาลัย | เปิดหน้า Nearby | 1. เลื่อนไปส่วนแผนที่ | N/A | มีแผนที่ UTCC และ controls | แผนที่, marker และ Zoom controls แสดงผล | PASS |
| TC-UI-010 | Error feedback | แจ้งผู้ใช้เมื่อ API หลักเชื่อมฐานข้อมูลไม่ได้ | Datasource ใช้งานไม่ได้ | 1. เปิดหน้าหลัก<br>2. รอโหลดรายการ | N/A | แจ้งว่าโหลดข้อมูลจาก server ไม่สำเร็จ | หน้าแสดงข้อความเหมือนข้อมูลว่าง โดยไม่แยกจาก connection error | FAIL |
| TC-UI-011 | University data | โหลดข้อมูลมหาวิทยาลัยจาก API จริง | Datasource ต้องใช้งานได้ | 1. เปิดหน้าหลัก<br>2. ตรวจรายการ | N/A | แสดงรายการจาก `/api/university/items` | API ตอบ 500 เพราะ datasource tenant/user not found | BLOCKED |
| TC-UI-012 | Nearby data | โหลดสถานที่รอบมหาวิทยาลัยจาก API จริง | Datasource ต้องใช้งานได้ | 1. เปิดหน้า Nearby<br>2. ตรวจ network response | N/A | แสดงข้อมูลจาก `/api/nearby-places` | API ตอบ 500; หน้าใช้ fallback data แทน | BLOCKED |
| TC-UI-013 | Place CRUD | เพิ่มสถานที่ภายในมหาวิทยาลัย | Admin mode และ datasource ใช้งานได้ | 1. เปิด Add Place<br>2. กรอกข้อมูล<br>3. บันทึก | `QA_TEST_PLACE` | บันทึกและแสดงรายการใหม่ | Datasource ใช้งานไม่ได้ จึงไม่ส่งข้อมูลทดสอบ | BLOCKED |
| TC-UI-014 | Place CRUD | แก้ไขสถานที่ | มีข้อมูลที่สร้างโดย QA | 1. เปิด Edit<br>2. แก้ชื่อ<br>3. บันทึก | `QA_TEST_PLACE_UPDATED` | ข้อมูลถูกแก้ไข | ไม่มี test record เพราะ create ถูก block | BLOCKED |
| TC-UI-015 | Place CRUD | ลบสถานที่ทดสอบ | มีข้อมูลที่สร้างโดย QA | 1. กด Delete<br>2. ยืนยัน | QA-created ID | ลบเฉพาะข้อมูลทดสอบและหายจากรายการ | ไม่มี test record เพราะ create ถูก block | BLOCKED |
| TC-UI-016 | Review | เพิ่มรีวิวที่ถูกต้อง | Datasource ใช้งานได้และมี nearby place | 1. เปิดรีวิว<br>2. กรอกชื่อ<br>3. เลือกดาว<br>4. ส่ง | `QA Tester`, 5 ดาว | รีวิวถูกบันทึกและแสดงในรายการ | Review API ใช้ datasource ที่ไม่พร้อม | BLOCKED |
| TC-UI-017 | Review | แก้ไขและลบรีวิวของผู้ทดสอบ | มีรีวิวที่สร้างโดย QA | 1. แก้ไขคะแนน/ข้อความ<br>2. บันทึก<br>3. ลบรีวิว | QA-created review ID | แก้ไขและลบได้สำเร็จ | ไม่มี QA review เพราะ create ถูก block | BLOCKED |
| TC-UI-018 | Add place validation | ส่งฟอร์มเพิ่มสถานที่โดยไม่กรอกชื่อ | เปิด Admin mode ได้ | 1. เปิด Add Place<br>2. เว้นชื่อว่าง<br>3. กดบันทึก | name=`empty` | Browser/UI ป้องกันการส่งและแจ้งให้กรอกชื่อ | ยังไม่ได้รัน manual flow ที่เชื่อถือได้ | NOT RUN |
| TC-UI-019 | Rating boundary | กรอก rating ต่ำกว่าค่าต่ำสุด | เปิดฟอร์ม Nearby Place | 1. กรอก rating 0<br>2. บันทึก | rating=`0` | ป้องกันค่าต่ำกว่า 1 หรือแจ้ง validation | ยังไม่ได้รัน และ backend ไม่มี validation annotation | NOT RUN |
| TC-UI-020 | Rating boundary | กรอก rating สูงกว่าค่าสูงสุด | เปิดฟอร์ม Nearby Place | 1. กรอก rating 5.1<br>2. บันทึก | rating=`5.1` | ป้องกันค่าสูงกว่า 5 หรือแจ้ง validation | ยังไม่ได้รัน และ backend ไม่มี validation annotation | NOT RUN |

## Execution Totals

- Total: 20
- PASS: 9
- FAIL: 1
- BLOCKED: 7
- NOT RUN: 3
