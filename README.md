UTCC Recommendation Website

เว็บไซต์แนะนำอาคาร สถานที่ภายในมหาวิทยาลัย และสถานที่รอบมหาวิทยาลัยหอการค้าไทย พัฒนาด้วย Java Spring Boot และหน้าเว็บ HTML/CSS/JavaScript โดยข้อมูลหลักเชื่อมต่อกับ PostgreSQL/Supabase

Features

- ค้นหาและกรองสถานที่ตามหมวดหมู่
- แสดงอาคารและสถานที่ภายในมหาวิทยาลัย
- แสดงร้านอาหาร คาเฟ่ หอพัก และบริการรอบมหาวิทยาลัยบนแผนที่
- เพิ่ม แก้ไข และลบข้อมูลสถานที่
- รีวิวและให้คะแนนสถานที่
- AI chatbot และ AI สรุปรีวิว
- รองรับภาษาไทย/อังกฤษ, Dark Mode และการตั้งค่าการแสดงผล

## Demo

### หน้าหลัก

![หน้าหลักของ UTCC RECOM](Demo/01-home.png)

### แผนผังและสถานที่ภายในมหาวิทยาลัย

<p align="center">
  <img src="Demo/02-campus-map.png" alt="แผนผังมหาวิทยาลัย" width="49%">
  <img src="Demo/03-campus-places-and-chatbot.png" alt="รายการสถานที่และ AI chatbot" width="49%">
</p>

### สถานที่รอบมหาวิทยาลัย

<p align="center">
  <img src="Demo/05-nearby-map.png" alt="แผนที่สถานที่รอบมหาวิทยาลัย" width="49%">
  <img src="Demo/06-nearby-places.png" alt="รายการสถานที่รอบมหาวิทยาลัย" width="49%">
</p>

### การค้นหาและการตั้งค่า

<p align="center">
  <img src="Demo/07-search-result.png" alt="ผลการค้นหาสถานที่" width="49%">
  <img src="Demo/08-dark-mode.png" alt="การแสดงผลแบบ Dark Mode" width="49%">
</p>

หน้าตั้งค่าสามารถเปลี่ยนภาษา รูปแบบการแสดงผล และเปิด Dark Mode ได้ ดูตัวอย่างเพิ่มเติมที่ [Demo](./Demo/)

โดยใช้ Technology

- Java 17 และ Spring Boot 3.2
- Spring Data JPA
- PostgreSQL / Supabase
- HTML, CSS และ JavaScript
- Maven

Software Testing

มีชุดงาน QA ระดับเริ่มต้นจากการตรวจและทดสอบระบบจริง ด้วย Manual Test Cases, API Testing, Bug Reports, Regression Checklist และ Test Summary

ผลการทดสอบจะระบุ `PASS`, `FAIL`, `BLOCKED` และ `NOT RUN` 

รายละเอียด [QA Documentation](./qa/README.md)

Running the Project

โปรเจกต์ต้องมี environment variables สำหรับ Supabase, PostgreSQL และ Gemini API ก่อนเริ่มระบบ

```powershell
.\mvnw.cmd spring-boot:run
```

 `http://localhost:8080`
