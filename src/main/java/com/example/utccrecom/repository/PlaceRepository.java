package com.example.utccrecom.repository;

import com.example.utccrecom.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PlaceRepository extends JpaRepository<Place, UUID> {
    List<Place> findByCategory(String category);
    List<Place> findByNameContainingIgnoreCase(String name);
}
