package com.example.utccrecom.service;

import com.example.utccrecom.entity.Building;
import com.example.utccrecom.repository.BuildingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class BuildingService {

    @Autowired
    private BuildingRepository buildingRepository;

    public List<Building> getAllBuildings() {
        return buildingRepository.findAll();
    }

    public Optional<Building> getBuildingById(UUID id) {
        return buildingRepository.findById(id);
    }

    public Optional<Building> getBuildingByKey(String buildingKey) {
        return buildingRepository.findByBuildingKey(buildingKey);
    }

    @Transactional
    public Building saveBuilding(Building building) {
        return buildingRepository.save(building);
    }

    @Transactional
    public Building updateBuildingData(String buildingKey, Building details) {
        Building existing = buildingRepository.findByBuildingKey(buildingKey).orElseGet(() -> {
            Building b = new Building();
            b.setBuildingKey(buildingKey);
            return b;
        });

        existing.setTitle(details.getTitle());
        existing.setDesc(details.getDesc());
        existing.setImage(details.getImage());
        existing.setFloors(details.getFloors());
        existing.setFaculty(details.getFaculty());
        existing.setHours(details.getHours());
        existing.setFacilities(details.getFacilities());

        if (details.getImages() != null) {
            existing.getImages().clear();
            existing.getImages().addAll(details.getImages());
        }

        return buildingRepository.save(existing);
    }

    public void deleteBuilding(UUID id) {
        buildingRepository.deleteById(id);
    }
}
