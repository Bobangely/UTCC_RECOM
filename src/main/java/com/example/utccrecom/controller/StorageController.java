package com.example.utccrecom.controller;

import com.example.utccrecom.service.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class StorageController {

    @Autowired
    private StorageService storageService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            String publicUrl = storageService.uploadImage(file);
            Map<String, String> response = new HashMap<>();
            response.put("url", publicUrl);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to upload file: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @PostMapping("/upload/multiple")
    public ResponseEntity<Map<String, Object>> uploadMultipleImages(@RequestParam("files") MultipartFile[] files) {
        try {
            List<String> publicUrls = storageService.uploadImages(files);
            Map<String, Object> response = new HashMap<>();
            response.put("urls", publicUrls);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to upload files: " + e.getMessage());
            return ResponseEntity.status(500).body(errorResponse);
        }
    }
}
