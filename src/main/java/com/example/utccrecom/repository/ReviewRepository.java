package com.example.utccrecom.repository;

import com.example.utccrecom.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByPlaceId(String placeId);
    List<Review> findByUserId(String userId);
}
