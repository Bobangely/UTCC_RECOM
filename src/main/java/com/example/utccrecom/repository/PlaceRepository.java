package com.example.utccrecom.repository;

import com.example.utccrecom.entity.Place;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaceRepository extends MongoRepository<Place, String> {
    List<Place> findByCategory(String category);
    List<Place> findByNameContainingIgnoreCase(String name);
}
