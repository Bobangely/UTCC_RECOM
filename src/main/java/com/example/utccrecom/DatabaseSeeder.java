package com.example.utccrecom;

import com.example.utccrecom.entity.Building;
import com.example.utccrecom.entity.Place;
import com.example.utccrecom.repository.BuildingRepository;
import com.example.utccrecom.repository.PlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private PlaceRepository placeRepository;

    @Override
    public void run(String... args) {
        try {
            seedBuildings();
        } catch (Exception e) {
            System.err.println("⚠️  Failed to seed buildings (table may not exist yet): " + e.getMessage());
        }
        try {
            seedPlaces();
        } catch (Exception e) {
            System.err.println("⚠️  Failed to seed places (table may not exist yet): " + e.getMessage());
        }
    }

    private void seedBuildings() {
        if (buildingRepository.count() == 0) {
            System.out.println("Seeding Buildings into Postgres...");
            
            buildingRepository.save(createBuilding("อาคาร 1", "อาคาร 1", "อาคารเรียนรวมสำหรับนักศึกษาชั้นปีต้น มีห้องเรียนขนาดใหญ่สำหรับวิชาพื้นฐาน", "5 ชั้น", "เรียนรวม / วิชาพื้นฐาน", "07:00 – 20:00", "ห้องเรียนขนาดใหญ่, ห้องน้ำ", "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600"));
            buildingRepository.save(createBuilding("อาคาร 10", "อาคาร 10 (อเนกประสงค์)", "ตึกเรียนสำหรับวิชาพื้นฐาน มีโรงอาหารขนาดย่อม และจุดนั่งทำงานหรืออ่านหนังสือใต้ตึกที่เย็นสบาย", "5 ชั้น", "อาคารรวม", "07:00 – 20:00", "โรงอาหาร, ที่อ่านหนังสือ", "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600"));
            buildingRepository.save(createBuilding("อาคาร 24", "อาคาร 24 (ตึกเรือใบ)", "อาคารสัญลักษณ์ของ ม.หอการค้าไทย ทรงเรือใบโดดเด่น เป็นที่ตั้งสำนักทะเบียน ห้องสมุด และคาเฟ่ชื่อดัง", "12 ชั้น", "สำนักทะเบียน / ห้องสมุด", "07:00 – 21:00", "ห้องสมุด, คาเฟ่, ATM, สำนักทะเบียน, ลิฟต์", "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600"));
            // Additional buildings can be added here
        }
    }

    private void seedPlaces() {
        if (placeRepository.count() == 0) {
            System.out.println("Seeding Places into Postgres...");

            Place p1 = new Place();
            p1.setName("ร้านข้าวป้าแจ่ม");
            p1.setCategory("Restaurant");
            p1.setDescription("ข้าวแกงยอดฮิตเด็กหอการค้า ให้เยอะ ราคาประหยัด");
            p1.setTags(Arrays.asList("ข้าวแกง", "ราคาถูก"));
            p1.setRating(4.8);
            p1.setDistance("ระยะทาง 50 ม.");
            p1.setImages(Collections.singletonList("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600"));
            p1.setAddress("ซอยวิภาวดี 2");
            placeRepository.save(p1);

            Place p2 = new Place();
            p2.setName("Coffee Today");
            p2.setCategory("Cafe");
            p2.setDescription("กาแฟอร่อย ไวไฟแรง เหมาะสำหรับอ่านหนังสือ");
            p2.setTags(Arrays.asList("กาแฟ", "อ่านหนังสือ", "แอร์เย็น"));
            p2.setRating(4.5);
            p2.setDistance("ระยะทาง 100 ม.");
            p2.setImages(Collections.singletonList("https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600"));
            p2.setAddress("หน้าตึก 24");
            placeRepository.save(p2);
        }
    }

    private Building createBuilding(String key, String title, String desc, String floors, String faculty, String hours, String facilities, String image) {
        Building b = new Building();
        b.setBuildingKey(key);
        b.setTitle(title);
        b.setDesc(desc);
        b.setFloors(floors);
        b.setFaculty(faculty);
        b.setHours(hours);
        b.setFacilities(facilities);
        b.setImage(image);
        return b;
    }
}
