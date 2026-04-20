package com.example.utccrecom.service;

import com.example.utccrecom.entity.Review;
import com.example.utccrecom.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public List<Review> getReviewsByPlace(String placeId, String placeType) {
        return reviewRepository.findByPlaceIdAndPlaceTypeOrderByCreatedAtDesc(placeId, placeType);
    }

    public List<Review> getReviewsByPlaceId(String placeId) {
        return reviewRepository.findByPlaceIdOrderByCreatedAtDesc(placeId);
    }

    @Transactional
    public Review saveReview(Review review) {
        if (review == null) throw new IllegalArgumentException("Review must not be null");
        return reviewRepository.save(review);
    }

    @Transactional
    public void deleteReview(UUID id) {
        if (id == null) throw new IllegalArgumentException("ID must not be null");
        reviewRepository.deleteById(id);
    }

    @Transactional
    public void deleteReviewsByPlace(String placeId) {
        reviewRepository.deleteByPlaceId(placeId);
    }
}
