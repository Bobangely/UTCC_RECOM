package com.example.utccrecom.repository;

import com.example.utccrecom.entity.NearbyPlace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NearbyPlaceRepository extends JpaRepository<NearbyPlace, UUID> {
    List<NearbyPlace> findByCategory(String category);
    List<NearbyPlace> findByNameContainingIgnoreCase(String name);
}
