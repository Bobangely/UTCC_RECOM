package com.example.utccrecom.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // ใช้โมเดล gemini-1.5-flash ที่เป็นมาตรฐาน ปัจจุบัน และเสถียรที่สุดใน v1beta
    // gemini-2.0-flash-exp เป็นรุ่นทดลอง และไม่มีใน API v1 ปกติ ทำให้เกิด Error 404
    private final String MODEL_NAME = "gemini-1.5-flash";

    public GeminiService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String extractKeywords(String promptText) {
        // ใช้ API version v1beta ซึ่งรองรับโมเดล gemini-1.5-flash แน่นอน
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL_NAME + ":generateContent?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // โครงสร้าง Request Body (ถูกต้องแล้ว)
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", promptText);

        Map<String, Object> partMap = new HashMap<>();
        partMap.put("parts", List.of(textPart));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(partMap));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                // ดึงข้อมูลออกมาอย่างปลอดภัย (ตรวจสอบ path ก่อนหลีกเลี่ยง NullPointerException)
                JsonNode candidates = rootNode.path("candidates");
                if (candidates.isArray() && !candidates.isEmpty()) {
                     return candidates.get(0)
                        .path("content").path("parts").get(0)
                        .path("text").asText().trim();
                }
            }
        } catch (Exception e) {
            // ไม่ปริ้นท์ stack trace ยาวๆ เพื่อให้ Log สะอาด แต่จะบอกสั้นๆ ว่าเกิดอะไรขึ้น
            System.err.println("Gemini API Request Failed: " + e.getMessage().substring(0, Math.min(e.getMessage().length(), 100)) + "...");
            return "";
        }
        return "";
    }
}