package com.example.utccrecom.controller;

import com.example.utccrecom.entity.Location;
import com.example.utccrecom.service.GeminiService;
import com.example.utccrecom.service.NearbyPlaceService;
import com.example.utccrecom.service.PlaceService;
import com.example.utccrecom.service.SupabaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class SearchController {

    private final GeminiService geminiService;
    private final SupabaseService supabaseService;
    private final PlaceService placeService;
    private final NearbyPlaceService nearbyPlaceService;

    public SearchController(GeminiService geminiService, SupabaseService supabaseService,
                            PlaceService placeService, NearbyPlaceService nearbyPlaceService) {
        this.geminiService = geminiService;
        this.supabaseService = supabaseService;
        this.placeService = placeService;
        this.nearbyPlaceService = nearbyPlaceService;
    }

    @PostMapping("/search")
    public ResponseEntity<?> search(@RequestBody Map<String, String> request) {
        try {
            String searchTerm = request.get("query");

            if (searchTerm == null || searchTerm.trim().isEmpty()) {
                List<Location> allLocations = supabaseService.findAllLocations();
                return ResponseEntity.ok(allLocations);
            }

            // Smart Search: ให้ Gemini เข้าใจ intent และแปลงเป็น keywords
            String promptText = "คุณคือ Smart Search สำหรับมหาวิทยาลัยหอการค้าไทย (UTCC) " +
                    "วิเคราะห์ความต้องการของผู้ใช้และแปลงเป็น keywords ภาษาไทย/อังกฤษ " +
                    "ที่เกี่ยวข้องกับ: ชื่ออาคาร, คณะ, ร้านอาหาร, คาเฟ่, สิ่งอำนวยความสะดวก, หมวดหมู่ " +
                    "ตัวอย่าง: 'ที่นั่งเงียบๆ มีปลั๊ก' → 'Study Area, ห้องสมุด, ปลั๊ก' " +
                    "ตอบกลับเป็น keywords คั่นด้วย comma เท่านั้น ไม่เกิน 5 คำ " +
                    "query: " + searchTerm;

            String keywords = geminiService.extractKeywords(promptText);

            if (keywords == null || keywords.trim().isEmpty() || keywords.length() > 100) {
                keywords = searchTerm;
            }

            List<Location> locations = supabaseService.searchLocations(keywords);
            return ResponseEntity.ok(locations);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Unknown error"));
        }
    }
}