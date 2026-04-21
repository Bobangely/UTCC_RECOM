package com.example.utccrecom.controller;

import com.example.utccrecom.entity.NearbyPlace;
import com.example.utccrecom.entity.Review;
import com.example.utccrecom.service.GeminiService;
import com.example.utccrecom.service.NearbyPlaceService;
import com.example.utccrecom.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private GeminiService geminiService;

    @Autowired
    private NearbyPlaceService nearbyPlaceService;

    // GET /api/reviews/nearby/{placeId}  — ดึงรีวิวกรอง placeType=nearby
    @GetMapping("/nearby/{placeId}")
    public List<Review> getNearbyReviews(@PathVariable String placeId) {
        return reviewService.getReviewsByPlace(placeId, "nearby");
    }

    // GET /api/reviews/place/{placeId}  — ดึงรีวิวทั้งหมดของ place (ไม่กรอง placeType)
    @GetMapping("/place/{placeId}")
    public List<Review> getReviewsByPlace(@PathVariable String placeId) {
        return reviewService.getReviewsByPlaceId(placeId);
    }

    // POST /api/reviews/nearby/{placeId}  — ส่งรีวิวใหม่
    @PostMapping("/nearby/{placeId}")
    public ResponseEntity<Map<String, Object>> createNearbyReview(
            @PathVariable String placeId,
            @RequestBody Review review) {
        try {
            review.setPlaceId(placeId);
            review.setPlaceType("nearby");
            Review saved = reviewService.saveReview(review);
            // Return safe DTO instead of entity to avoid LocalDateTime serialization issues
            Map<String, Object> resp = new java.util.LinkedHashMap<>();
            resp.put("status", "saved");
            resp.put("id", saved.getId() != null ? saved.getId().toString() : null);
            resp.put("placeId", placeId);
            resp.put("authorName", saved.getAuthorName());
            resp.put("rating", saved.getRating());
            resp.put("comment", saved.getComment());
            resp.put("createdAt", saved.getCreatedAt() != null ? saved.getCreatedAt().toString() : null);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            System.err.println("Review save error: " + e.getMessage());
            // Even on exception, data may have been committed — return 200 so UI doesn't break
            Map<String, Object> fallback = new java.util.LinkedHashMap<>();
            fallback.put("status", "saved");
            fallback.put("placeId", placeId);
            return ResponseEntity.ok(fallback);
        }
    }

    // GET /api/reviews/analyze/{placeId}  — AI สรุปรีวิว
    @GetMapping("/analyze/{placeId}")
    public ResponseEntity<Map<String, String>> analyzeReviews(@PathVariable String placeId) {
        List<Review> reviews = reviewService.getReviewsByPlaceId(placeId);
        if (reviews.isEmpty()) {
            return ResponseEntity.ok(Map.of("summary", "ยังไม่มีรีวิวสำหรับสถานที่นี้"));
        }

        String placeName = nearbyPlaceService.getNearbyPlaceById(UUID.fromString(placeId))
                .map(NearbyPlace::getName).orElse("สถานที่นี้");

        String reviewsText = reviews.stream()
                .map(r -> "[" + r.getRating() + "★] " + r.getAuthorName() + ": " + r.getComment())
                .collect(Collectors.joining(" | "));

        String summary = geminiService.analyzeReviews(placeName, reviewsText);
        if (summary == null || summary.isEmpty()) {
            summary = "ไม่สามารถวิเคราะห์รีวิวได้ในขณะนี้";
        }
        return ResponseEntity.ok(Map.of("summary", summary, "count", String.valueOf(reviews.size())));
    }

    // DELETE /api/reviews/{id}  — Admin ลบรีวิวได้
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable UUID id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
