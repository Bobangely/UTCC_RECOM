package com.example.utccrecom.controller;

import com.example.utccrecom.entity.Place;
import com.example.utccrecom.service.PlaceService;
import com.example.utccrecom.service.UniversityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
//http://localhost:8080/api/places
@RequestMapping("/api/places")
public class PlaceController {

    @Autowired
    private PlaceService placeService;

    @Autowired
    private UniversityService universityService;

    // ดึงสถานที่ทั้งหมด
    @GetMapping
    public List<Place> getAllPlaces() {
        return placeService.getAllPlaces();
    }

    // ดึงสถานที่เดียวตาม ID
    @GetMapping("/{id}")
    public ResponseEntity<Place> getPlaceById(@PathVariable UUID id) {
        Optional<Place> place = placeService.getPlaceById(id);
        if (place.isPresent()) {
            return ResponseEntity.ok(place.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ค้นหาสถานที่ตามชื่อ
    @GetMapping("/search")
    public List<Place> searchPlaces(@RequestParam String name) {
        return placeService.searchPlacesByName(name);
    }

    // กรองสถานที่ตามหมวดหมู่
    @GetMapping("/category")
    public List<Place> getPlacesByCategory(@RequestParam String category) {
        return placeService.getPlacesByCategory(category);
    }

    // สร้างสถานที่ใหม่
    @PostMapping
    public Place createPlace(@RequestBody Place place) {
        Place saved = placeService.savePlace(place);
        universityService.clearCache(); // ล้าง cache หลังสร้างข้อมูล
        return saved;
    }

    // อัปเดตสถานที่ที่มีอยู่
    @PutMapping("/{id}")
    public ResponseEntity<Place> updatePlace(@PathVariable UUID id, @RequestBody Place placeDetails) {
        try {
            Place updatedPlace = placeService.updatePlaceData(id, placeDetails);
            universityService.clearCache(); // ล้าง cache หลังอัปเดตข้อมูล
            return ResponseEntity.ok(updatedPlace);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ลบสถานที่
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlace(@PathVariable UUID id) {
        placeService.deletePlace(id);
        universityService.clearCache(); // ล้าง cache หลังลบข้อมูล
        return ResponseEntity.noContent().build();
    }
}
