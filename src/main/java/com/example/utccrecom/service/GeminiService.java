package com.example.utccrecom.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
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

    private final String MODEL_NAME = "gemini-2.5-flash-lite";
    private final String API_URL_TEMPLATE = "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s";

    public GeminiService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    private String callGemini(String promptText) {
        String url = String.format(API_URL_TEMPLATE, MODEL_NAME, apiKey);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

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
                JsonNode candidates = rootNode.path("candidates");
                if (candidates.isArray() && !candidates.isEmpty()) {
                    return candidates.get(0)
                            .path("content").path("parts").get(0)
                            .path("text").asText().trim();
                }
            }
        } catch (Exception e) {
            String errMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            System.err.println("Gemini API Failed: " + errMsg.substring(0, Math.min(errMsg.length(), 100)));
        }
        return "";
    }

    // 1. Smart Search — แปลง query เป็น keywords
    public String extractKeywords(String promptText) {
        return callGemini(promptText);
    }

    // 2. Chatbot — ตอบคำถามเกี่ยวกับสถานที่ใน UTCC พร้อม history
    public String chat(String userMessage, String placesContext, List<Map<String, String>> history) {
        String systemPrompt = "คุณคือผู้ช่วย AI ของมหาวิทยาลัยหอการค้าไทย (UTCC) ชื่อว่า UTCC Assistant " +
                "ตอบเป็นภาษาไทยเท่านั้น กระชับ เป็นมิตร และเป็นประโยชน์ " +
                "ตอบเฉพาะเรื่องสถานที่ ร้านอาหาร คาเฟ่ อาคาร และบริการในมหาวิทยาลัยหอการค้าไทยเท่านั้น " +
                "ถ้าถามเรื่องอื่นให้บอกว่าไม่สามารถตอบได้ " +
                "ถ้าผู้ใช้บอกว่าไม่รู้จะกินอะไร ไม่รู้จะไปไหน หรือขอให้สุ่ม " +
                "ให้สุ่มแนะนำสถานที่จากข้อมูลที่มี 1 แห่ง พร้อมบอกเหตุผลสั้นๆ ว่าทำไมถึงแนะนำ " +
                "ข้อมูลสถานที่ที่มีในระบบ: " + placesContext;

        String url = String.format(API_URL_TEMPLATE, MODEL_NAME, apiKey);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // สร้าง contents array พร้อม history
        List<Map<String, Object>> contents = new java.util.ArrayList<>();

        // system message เป็น user turn แรก
        contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", systemPrompt))));
        contents.add(Map.of("role", "model", "parts", List.of(Map.of("text", "เข้าใจแล้วครับ ยินดีช่วยเหลือ"))));

        // เพิ่ม history (เก็บแค่ 10 รอบล่าสุดเพื่อไม่ให้ token เกิน)
        List<Map<String, String>> recentHistory = history.size() > 10
                ? history.subList(history.size() - 10, history.size())
                : history;

        for (Map<String, String> turn : recentHistory) {
            String role = "user".equals(turn.get("role")) ? "user" : "model";
            contents.add(Map.of("role", role, "parts", List.of(Map.of("text", turn.get("text")))));
        }

        // เพิ่ม message ปัจจุบัน
        contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", userMessage))));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", contents);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode rootNode = objectMapper.readTree(response.getBody());
                JsonNode candidates = rootNode.path("candidates");
                if (candidates.isArray() && !candidates.isEmpty()) {
                    return candidates.get(0).path("content").path("parts").get(0).path("text").asText().trim();
                }
            }
        } catch (Exception e) {
            String errMsg = e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName();
            System.err.println("Gemini Chat Failed: " + errMsg.substring(0, Math.min(errMsg.length(), 100)));
        }
        return "";
    }

    // 3. วิเคราะห์รีวิว — สรุปความเห็นจากรีวิวทั้งหมด
    public String analyzeReviews(String placeName, String reviewsText) {
        String prompt = "สรุปรีวิวของ '" + placeName + "' เป็นภาษาไทย กระชับ ไม่เกิน 3 ประโยค "
                + "แบ่งเป็น จุดเด่น / จุดด้อย / สรุปโดยรวม "
                + "ห้ามใส่หัวข้อซ้ำชื่อร้าน ตอบตรงๆ เลย รีวิว: " + reviewsText;
        return callGemini(prompt);
    }
}