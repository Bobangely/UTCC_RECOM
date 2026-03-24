package com.example.utccrecom.repository;

import com.example.utccrecom.entity.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByPlaceId(String placeId);
    List<Review> findByUserId(String userId);
}
