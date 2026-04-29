package com.example.utccrecom.controller;

import com.example.utccrecom.entity.NearbyPlace;
import com.example.utccrecom.entity.Place;
import com.example.utccrecom.service.GeminiService;
import com.example.utccrecom.service.NearbyPlaceService;
import com.example.utccrecom.service.PlaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final GeminiService geminiService;
    private final PlaceService placeService;
    private final NearbyPlaceService nearbyPlaceService;

    public ChatController(GeminiService geminiService, PlaceService placeService, NearbyPlaceService nearbyPlaceService) {
        this.geminiService = geminiService;
        this.placeService = placeService;
        this.nearbyPlaceService = nearbyPlaceService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, Object> request) {
        String message = (String) request.get("message");
        if (message == null || message.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "message is required"));
        }

        // รับ history จากหน้าเว็บ
        @SuppressWarnings("unchecked")
        List<Map<String, String>> history = (List<Map<String, String>>) request.getOrDefault("history", List.of());

        // สร้าง context จากข้อมูลสถานที่จริงใน DB
        List<Place> places = placeService.getAllPlaces();
        List<NearbyPlace> nearbyPlaces = nearbyPlaceService.getAllNearbyPlaces();

        String placesContext = places.stream()
                .map(p -> p.getName() + " (" + p.getCategory() + ")" +
                        (p.getDescription() != null ? ": " + p.getDescription() : "") +
                        (p.getRating() != null ? " คะแนน: " + p.getRating() : "") +
                        (p.getTags() != null && !p.getTags().isEmpty() ? " แท็ก: " + String.join(", ", p.getTags()) : ""))
                .collect(Collectors.joining(" | "));

        String nearbyContext = nearbyPlaces.stream()
                .map(p -> p.getName() + " (" + p.getCategory() + ")" +
                        (p.getDescription() != null ? ": " + p.getDescription() : "") +
                        (p.getDistance() != null ? " ระยะ: " + p.getDistance() : "") +
                        (p.getPrice() != null ? " ราคา: " + parsePrice(p.getPrice()) : "") +
                        (p.getRating() != null ? " คะแนน: " + p.getRating() : "") +
                        (p.getTags() != null && !p.getTags().isEmpty() ? " แท็ก: " + String.join(", ", p.getTags()) : ""))
                .collect(Collectors.joining(" | "));

        String fullContext = "สถานที่ในมหาวิทยาลัย: " + placesContext +
                " || สถานที่รอบมหาวิทยาลัย: " + nearbyContext;

        String reply = geminiService.chat(message, fullContext, history);

        if (reply == null || reply.isEmpty()) {
            reply = "ขออภัย ไม่สามารถตอบได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง";
        } else if (reply.equals("__RATE_LIMITED__")) {
            reply = "ขออภัย ระบบ AI ถูกใช้งานหนักเกินไปในขณะนี้ กรุณารอสักครู่แล้วลองใหม่อีกครั้ง";
        }

        return ResponseEntity.ok(Map.of("reply", reply));
    }

    private String parsePrice(String priceJson) {
        if (priceJson == null || priceJson.isBlank()) return "";
        try {

            String trimmed = priceJson.trim();
            if (trimmed.startsWith("[")) {
                StringBuilder sb = new StringBuilder();
                String[] parts = trimmed.replaceAll("[\\[\\]{}\"]", "").split(",");
                for (String part : parts) {
                    part = part.trim();
                    if (part.startsWith("min:") || part.startsWith("min :")) {
                        sb.append("เริ่มต้น บาท");
                    } else if (part.contains("min")) {
                        String val = part.replaceAll("[^0-9]", "");
                        if (!val.isEmpty()) sb.append(val).append("-");
                    } else if (part.contains("max")) {
                        String val = part.replaceAll("[^0-9]", "");
                        if (!val.isEmpty()) sb.append(val).append(" บาท ");
                    } else if (part.contains("value")) {
                        String val = part.replaceAll("[^0-9]", "");
                        if (!val.isEmpty()) sb.append(val).append(" บาท ");
                    }
                }
                String result = sb.toString().trim();
                return result.isEmpty() ? priceJson : result;
            }
            return priceJson;
        } catch (Exception e) {
            return priceJson;
        }
    }
}
