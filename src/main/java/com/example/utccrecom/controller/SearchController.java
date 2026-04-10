package com.example.utccrecom.controller;

import com.example.utccrecom.entity.Location; // แก้กลับมาใช้ Location เหมือนเดิม
import com.example.utccrecom.service.GeminiService; // Import GeminiService
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

    private final GeminiService geminiService; // เปลี่ยนเป็น GeminiService
    private final SupabaseService supabaseService;

    public SearchController(GeminiService geminiService, SupabaseService supabaseService) {
        this.geminiService = geminiService;
        this.supabaseService = supabaseService;
    }

    @PostMapping("/search")
    public ResponseEntity<?> search(@RequestBody Map<String, String> request) {
        try {
            String searchTerm = request.get("query");

            if (searchTerm == null || searchTerm.trim().isEmpty()) {
                List<Location> allLocations = supabaseService.findAllLocations();
                return ResponseEntity.ok(allLocations);
            } else {
                // Prompt ที่เฉพาะเจาะจงให้ตอบกลับมาเป็น keyword คั่นด้วย comma เท่านั้น
                String promptText = "You are a search assistant for a university. Extract keywords related to university life, " +
                        "such as building names, faculties, course subjects, or activities, from the following query. " +
                        "Return ONLY the keywords as a comma-separated list, nothing else. The query is: " + searchTerm;

                // ใช้ GeminiService ดึงข้อมูลผ่าน REST API โดยตรง!
                String keywords = geminiService.extractKeywords(promptText);

                if (keywords == null || keywords.trim().isEmpty()) {
                    return ResponseEntity.ok(List.of()); 
                }

                // ค้นหาใน Supabase ด้วย keywords ที่ได้มา
                List<Location> locations = supabaseService.searchLocations(keywords);
                return ResponseEntity.ok(locations);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}