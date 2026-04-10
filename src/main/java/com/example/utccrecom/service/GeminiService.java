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
    private String resolvedModelName = null;

    public GeminiService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    // ฟังก์ชันนี้จะดึงรายชื่อ Model ที่ API Key ของคุณมีสิทธิ์ใช้งานโดยอัตโนมัติ
    private String getAvailableModel() {
        if (resolvedModelName != null) {
            return resolvedModelName;
        }

        String listModelsUrl = "https://generativelanguage.googleapis.com/v1beta/models?key=" + apiKey;
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(listModelsUrl, String.class);
            JsonNode rootNode = objectMapper.readTree(response.getBody());
            JsonNode models = rootNode.path("models");
            
            if (models.isArray()) {
                for (JsonNode model : models) {
                    String name = model.path("name").asText();
                    JsonNode methods = model.path("supportedGenerationMethods");
                    boolean supportsGenerateContent = false;
                    
                    if (methods.isArray()) {
                        for (JsonNode method : methods) {
                            if ("generateContent".equals(method.asText())) {
                                supportsGenerateContent = true;
                                break;
                            }
                        }
                    }
                    
                    // เลือกโมเดลที่มีคำว่า gemini และรองรับการ generateContent
                    if (supportsGenerateContent && name.contains("gemini")) {
                        System.out.println("Auto-selected Gemini model: " + name);
                        resolvedModelName = name;
                        return name;
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error listing models: " + e.getMessage());
        }
        
        // ถ้าหาไม่เจอให้ใช้ค่าเริ่มต้น
        return "models/gemini-1.5-flash";
    }

    public String extractKeywords(String promptText) {
        String modelName = getAvailableModel();
        // url จะมีหน้าตาประมาณ https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
        String url = "https://generativelanguage.googleapis.com/v1beta/" + modelName + ":generateContent?key=" + apiKey;

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
                if (candidates.isArray() && candidates.size() > 0) {
                    JsonNode firstCandidate = candidates.get(0);
                    JsonNode content = firstCandidate.path("content");
                    JsonNode parts = content.path("parts");
                    if (parts.isArray() && parts.size() > 0) {
                        return parts.get(0).path("text").asText().trim();
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Error calling Gemini API: " + e.getMessage());
        }

        return "";
    }
}