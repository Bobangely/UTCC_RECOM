# Regression Checklist

ใช้ checklist นี้หลังแก้ datasource configuration หรือแก้ defect เพื่อยืนยันว่าฟังก์ชันหลักยังทำงานเหมือนเดิม

| ID | Core Feature | Expected Behavior | Result |
|---|---|---|---|
| REG-001 | Home page | `/` โหลดสำเร็จและแสดงส่วนค้นหา/แผนที่ | PASS |
| REG-002 | Nearby page | `/nearby.html` โหลดสำเร็จ | PASS |
| REG-003 | Navigation | ไปกลับระหว่าง Home และ Nearby ได้ | PASS |
| REG-004 | Dark Mode | เปิด Dark Mode แล้วธีมเปลี่ยนและคงค่าเมื่อเปลี่ยนหน้า | PASS |
| REG-005 | Language | เปลี่ยนเป็น EN แล้วข้อความหลักเปลี่ยนภาษา | PASS |
| REG-006 | Nearby search | ค้นหา `สุกี้` แล้วได้ “สุกี้นายพัน” จาก fallback data | PASS |
| REG-007 | Search empty state | คำค้นที่ไม่มีข้อมูลแสดง empty state | PASS |
| REG-008 | University API | `GET /api/university/items` คืน 200 และ JSON array | BLOCKED |
| REG-009 | Nearby API | `GET /api/nearby-places` คืน 200 และ JSON array | BLOCKED |
| REG-010 | Place CRUD | เพิ่ม แก้ไข และลบ QA test place ได้ | BLOCKED |
| REG-011 | Review lifecycle | เพิ่ม แก้ไข และลบ QA review ได้ | BLOCKED |
| REG-012 | Invalid chat request | message ว่างคืน HTTP 400 พร้อม `message is required` | PASS |

## Retest Order

1. แก้และยืนยัน datasource configuration โดยไม่ commit secret
2. รัน Postman Collection
3. รัน CRUD lifecycle ด้วยข้อมูลชื่อ `QA_TEST_*`
4. ลบเฉพาะข้อมูลที่ QA สร้าง
5. รัน REG-001 ถึง REG-012 อีกครั้ง
6. อัปเดตผลและ Test Summary
