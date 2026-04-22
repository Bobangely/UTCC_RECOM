package com.example.utccrecom.controller;

import com.example.utccrecom.entity.Building;
import com.example.utccrecom.repository.BuildingRepository;
import com.example.utccrecom.service.GeminiService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class SearchController {

    private final GeminiService geminiService;
    private final BuildingRepository buildingRepository;

    public SearchController(GeminiService geminiService, BuildingRepository buildingRepository) {
        this.geminiService = geminiService;
        this.buildingRepository = buildingRepository;
    }

    @PostMapping("/search")
    public ResponseEntity<?> search(@RequestBody Map<String, String> request) {
        try {
            String searchTerm = request.get("query");

            if (searchTerm == null || searchTerm.trim().isEmpty()) {
                return ResponseEntity.ok(buildingRepository.findAll());
            }

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

            List<Building> results = searchBuildings(keywords);
            return ResponseEntity.ok(results);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Unknown error"));
        }
    }

    private List<Building> searchBuildings(String keywords) {
        return Arrays.stream(keywords.split(","))
                .map(String::trim)
                .filter(kw -> !kw.isEmpty())
                .flatMap(kw -> buildingRepository.findAll().stream()
                        .filter(b -> (b.getTitle() != null && b.getTitle().toLowerCase().contains(kw.toLowerCase())) ||
                                     (b.getDesc() != null && b.getDesc().toLowerCase().contains(kw.toLowerCase()))))
                .distinct()
                .collect(Collectors.toList());
    }
}
