# UTCC Recommendation Website

เว็บไซต์แนะนำอาคาร สถานที่ภายในมหาวิทยาลัย และสถานที่รอบมหาวิทยาลัยหอการค้าไทย พัฒนาด้วย Java Spring Boot และหน้าเว็บ HTML/CSS/JavaScript โดยข้อมูลหลักเชื่อมต่อกับ PostgreSQL/Supabase

## Features

- ค้นหาและกรองสถานที่ตามหมวดหมู่
- แสดงอาคารและสถานที่ภายในมหาวิทยาลัย
- แสดงร้านอาหาร คาเฟ่ หอพัก และบริการรอบมหาวิทยาลัยบนแผนที่
- เพิ่ม แก้ไข และลบข้อมูลสถานที่
- รีวิวและให้คะแนนสถานที่
- AI chatbot และ AI สรุปรีวิว
- รองรับภาษาไทย/อังกฤษ, Dark Mode และการตั้งค่าการแสดงผล

## Technology

- Java 17 และ Spring Boot 3.2
- Spring Data JPA
- PostgreSQL / Supabase
- HTML, CSS และ JavaScript
- Maven

## Software Testing

โปรเจกต์นี้มีชุดผลงาน QA ระดับเริ่มต้นที่สร้างจากการตรวจและทดสอบระบบจริง ประกอบด้วย Manual Test Cases, API Testing, Bug Reports, Regression Checklist และ Test Summary

ผลการทดสอบจะระบุ `PASS`, `FAIL`, `BLOCKED` และ `NOT RUN` ตามสิ่งที่เกิดขึ้นจริง โดยไม่สร้างผลทดสอบหรือบั๊กขึ้นมาเอง

ดูรายละเอียดได้ที่ [QA Documentation](./qa/README.md)

## Running the Project

โปรเจกต์ต้องมี environment variables สำหรับ Supabase, PostgreSQL และ Gemini API ก่อนเริ่มระบบ

```powershell
.\mvnw.cmd spring-boot:run
```

เมื่อระบบเริ่มทำงานแล้ว เปิด `http://localhost:8080`

> ไม่ควร commit รหัสผ่าน, access token, service-role key หรือค่า secret ลงใน repository
