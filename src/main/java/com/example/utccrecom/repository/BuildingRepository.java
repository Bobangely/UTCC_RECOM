package com.example.utccrecom.repository;

import com.example.utccrecom.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BuildingRepository extends JpaRepository<Building, UUID> {
    Optional<Building> findByBuildingKey(String buildingKey);
    boolean existsByBuildingKey(String buildingKey);
}
