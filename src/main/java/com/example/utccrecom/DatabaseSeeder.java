package com.example.utccrecom;

import com.example.utccrecom.entity.Building;
import com.example.utccrecom.entity.NearbyCategory;
import com.example.utccrecom.entity.NearbyPlace;
import com.example.utccrecom.repository.BuildingRepository;
import com.example.utccrecom.repository.NearbyCategoryRepository;
import com.example.utccrecom.repository.NearbyPlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private NearbyPlaceRepository nearbyPlaceRepository;

    @Autowired
    private NearbyCategoryRepository nearbyCategoryRepository;

    @Override
    public void run(String... args) {
        try { seedBuildings(); } catch (Exception e) {
            System.err.println("⚠️  Failed to seed buildings: " + e.getMessage());
        }
        try { seedCategories(); } catch (Exception e) {
            System.err.println("⚠️  Failed to seed categories: " + e.getMessage());
        }
        try { seedNearbyPlaces(); } catch (Exception e) {
            System.err.println("⚠️  Failed to seed nearby places: " + e.getMessage());
        }
    }

    // ── Buildings ─────────────────────────────────────────────
    private void seedBuildings() {
        if (buildingRepository.count() == 0) {
            System.out.println("Seeding buildings...");
            buildingRepository.save(createBuilding("อาคาร 1", "อาคาร 1",
                    "อาคารเรียนรวมสำหรับนักศึกษาชั้นปีต้น มีห้องเรียนขนาดใหญ่สำหรับวิชาพื้นฐาน",
                    "5 ชั้น", "เรียนรวม / วิชาพื้นฐาน", "07:00 – 20:00", "ห้องเรียนขนาดใหญ่, ห้องน้ำ",
                    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600"));
            buildingRepository.save(createBuilding("อาคาร 10", "อาคาร 10 (อเนกประสงค์)",
                    "ตึกเรียนสำหรับวิชาพื้นฐาน มีโรงอาหารขนาดย่อม และจุดนั่งทำงานหรืออ่านหนังสือใต้ตึกที่เย็นสบาย",
                    "5 ชั้น", "อาคารรวม", "07:00 – 20:00", "โรงอาหาร, ที่อ่านหนังสือ",
                    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=600"));
            buildingRepository.save(createBuilding("อาคาร 24", "อาคาร 24 (ตึกเรือใบ)",
                    "อาคารสัญลักษณ์ของ ม.หอการค้าไทย ทรงเรือใบโดดเด่น เป็นที่ตั้งสำนักทะเบียน ห้องสมุด และคาเฟ่ชื่อดัง",
                    "12 ชั้น", "สำนักทะเบียน / ห้องสมุด", "07:00 – 21:00",
                    "ห้องสมุด, คาเฟ่, ATM, สำนักทะเบียน, ลิฟต์",
                    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&q=80&w=600"));
        }
    }

    // ── Nearby Categories ──────────────────────────
    private void seedCategories() {
        if (nearbyCategoryRepository.count() == 0) {
            System.out.println("Seeding nearby categories...");
            nearbyCategoryRepository.save(new NearbyCategory("all",       "ทั้งหมด",             "bx-grid-alt",       0));
            nearbyCategoryRepository.save(new NearbyCategory("Restaurant","ร้านอาหาร",           "bx-restaurant",     1));
            nearbyCategoryRepository.save(new NearbyCategory("Cafe",      "คาเฟ่",               "bx-coffee",         2));
            nearbyCategoryRepository.save(new NearbyCategory("Study Area","ร้านอินเทอร์เน็ต", "bx-desktop",        3));
            nearbyCategoryRepository.save(new NearbyCategory("หอพัก",    "หอพัก",               "bx-building-house", 4));
            nearbyCategoryRepository.save(new NearbyCategory("Other",     "ร้านสะดวกซื้อ",        "bx-store",          5));
            nearbyCategoryRepository.save(new NearbyCategory("Transport", "ขนส่ง / MRT",         "bx-bus",            6));
            System.out.println("✅ Seeded " + nearbyCategoryRepository.count() + " categories.");
        }
    }

    // ── Nearby Places (3 examples) ────────────────────────────
    private void seedNearbyPlaces() {
        if (nearbyPlaceRepository.count() == 0) {
            System.out.println("Seeding 3 nearby place examples...");

            // ร้านอาหาร
            nearbyPlaceRepository.save(createNearbyPlace(
                    "สุกี้นายพัน",
                    "Restaurant",
                    "ร้านสุกี้ขวัญใจนักศึกษา ม.หอการค้า น้ำจิ้มสูตรกวางตุ้งเด็ดมาก มีหมู ไก่ ทะเล และเมนูทานเล่น ราคานักศึกษา",
                    "~100 ม.", 4.5,
                    "https://maps.google.com/?q=สุกี้นายพัน+มหาวิทยาลัยหอการค้าไทย",
                    Arrays.asList("สุกี้", "ราคาถูก", "ขวัญใจนักศึกษา"),
                    Arrays.asList("https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&q=80&w=600")
            ));

            // คาเฟ่
            nearbyPlaceRepository.save(createNearbyPlace(
                    "เพื่อนแท้ Café (Peuan Tae)",
                    "Cafe",
                    "คาเฟ่ชิลล์เปิดดึก เหมาะนั่งคุยหลังเลิกเรียน มีไข่กระทะ ขนมปังปิ้ง เครื่องดื่มราคาย่อมเยา บรรยากาศอบอุ่น",
                    "~100 ม.", 4.4,
                    "https://maps.google.com/?q=เพื่อนแท้+คาเฟ่+UTCC",
                    Arrays.asList("เปิดดึก", "ขนมปังปิ้ง", "บรรยากาศดี"),
                    Arrays.asList("https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600")
            ));

            // หอพัก
            nearbyPlaceRepository.save(createNearbyPlace(
                    "หอพักสตรีบ้านวิภาวดี",
                    "หอพัก",
                    "หอพักสตรีที่ใกล้มหาวิทยาลัยหอการค้าไทยที่สุด ระยะเดินเพียง 36 เมตร มีรักษาความปลอดภัย สิ่งอำนวยความสะดวกครบครัน",
                    "36 ม.", 4.2,
                    "https://maps.google.com/?q=หอพักสตรีบ้านวิภาวดี+UTCC",
                    Arrays.asList("หอพักสตรี", "ใกล้มาก", "ปลอดภัย"),
                    Arrays.asList("https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=600")
            ));

            System.out.println("✅ Seeded " + nearbyPlaceRepository.count() + " nearby places.");
        }
    }

    // ── Helpers ───────────────────────────────────────────────
    private NearbyPlace createNearbyPlace(String name, String category, String description,
                                          String distance, double rating, String mapsUrl,
                                          java.util.List<String> tags, java.util.List<String> images) {
        NearbyPlace p = new NearbyPlace();
        p.setName(name);
        p.setCategory(category);
        p.setDescription(description);
        p.setDistance(distance);
        p.setRating(rating);
        p.setMapsUrl(mapsUrl);
        p.setTags(tags);
        p.setImages(images);
        return p;
    }

    private Building createBuilding(String key, String title, String desc, String floors,
                                     String faculty, String hours, String facilities, String image) {
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
