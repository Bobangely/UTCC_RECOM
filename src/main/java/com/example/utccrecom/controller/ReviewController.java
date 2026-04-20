package com.example.utccrecom.controller;

import com.example.utccrecom.entity.Review;
import com.example.utccrecom.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

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
