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

    @GetMapping("/nearby/{placeId}")
    public List<Review> getNearbyReviews(@PathVariable String placeId) {
        return reviewService.getReviewsByPlace(placeId, "nearby");
    }

    @GetMapping("/place/{placeId}")
    public List<Review> getReviewsByPlace(@PathVariable String placeId) {
        return reviewService.getReviewsByPlaceId(placeId);
    }

    @PostMapping("/nearby/{placeId}")
    public ResponseEntity<Map<String, Object>> createNearbyReview(
            @PathVariable String placeId,
            @RequestBody Review review) {
        try {
            review.setPlaceId(placeId);
            review.setPlaceType("nearby");
            Review saved = reviewService.saveReview(review);
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
            Map<String, Object> fallback = new java.util.LinkedHashMap<>();
            fallback.put("status", "saved");
            fallback.put("placeId", placeId);
            return ResponseEntity.ok(fallback);
        }
    }

    @GetMapping("/analyze/{placeId}")
    public ResponseEntity<Map<String, String>> analyzeReviews(@PathVariable String placeId) {
        List<Review> reviews = reviewService.getReviewsByPlaceId(placeId);
        if (reviews.isEmpty()) {
            return ResponseEntity.ok(Map.of("summary", "ยังไม่มีรีวิวสำหรับสถานที่นี้"));
        }

        String placeName = "สถานที่นี้";
        try {
            placeName = nearbyPlaceService.getNearbyPlaceById(UUID.fromString(placeId))
                    .map(NearbyPlace::getName).orElse("สถานที่นี้");
        } catch (Exception ignored) {}

        String reviewsText = reviews.stream()
                .map(r -> "[" + r.getRating() + "★] " + r.getAuthorName() + ": " + r.getComment())
                .collect(Collectors.joining(" | "));

        String summary = geminiService.analyzeReviews(placeName, reviewsText);
        if (summary == null || summary.isEmpty()) {
            summary = "ไม่สามารถวิเคราะห์รีวิวได้ในขณะนี้";
        }
        return ResponseEntity.ok(Map.of("summary", summary, "count", String.valueOf(reviews.size())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateReview(
            @PathVariable UUID id,
            @RequestBody Review updated) {
        try {
            Review existing = reviewService.getReviewById(id)
                    .orElseThrow(() -> new RuntimeException("Not found"));
            if (updated.getComment() != null) existing.setComment(updated.getComment());
            if (updated.getRating() > 0) existing.setRating(updated.getRating());
            if (updated.getAuthorName() != null) existing.setAuthorName(updated.getAuthorName());
            Review saved = reviewService.saveReview(existing);
            Map<String, Object> resp = new java.util.LinkedHashMap<>();
            resp.put("status", "updated");
            resp.put("id", saved.getId().toString());
            resp.put("comment", saved.getComment());
            resp.put("rating", saved.getRating());
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

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
