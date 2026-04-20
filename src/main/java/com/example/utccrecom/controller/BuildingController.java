package com.example.utccrecom.controller;

import com.example.utccrecom.entity.Building;
import com.example.utccrecom.service.BuildingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/buildings")
public class BuildingController {

    @Autowired
    private BuildingService buildingService;

    @GetMapping
    public List<Building> getAllBuildings() {
        return buildingService.getAllBuildings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Building> getBuildingById(@PathVariable UUID id) {
        Optional<Building> building = buildingService.getBuildingById(id);
        return building.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/key/{buildingKey}")
    public ResponseEntity<Building> getBuildingByKey(@PathVariable String buildingKey) {
        Optional<Building> building = buildingService.getBuildingByKey(buildingKey);
        return building.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Building createBuilding(@RequestBody Building building) {
        return buildingService.saveBuilding(building);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Building> updateBuilding(@PathVariable UUID id, @RequestBody Building details) {
        Optional<Building> optional = buildingService.getBuildingById(id);
        if (optional.isPresent()) {
            Building existing = optional.get();
            existing.setTitle(details.getTitle());
            existing.setDesc(details.getDesc());
            existing.setImage(details.getImage());
            if (details.getImages() != null) {
                existing.getImages().clear();
                existing.getImages().addAll(details.getImages());
            }
            existing.setFloors(details.getFloors());
            existing.setFaculty(details.getFaculty());
            existing.setHours(details.getHours());
            existing.setFacilities(details.getFacilities());
            
            return ResponseEntity.ok(buildingService.saveBuilding(existing));
        }
        return ResponseEntity.notFound().build();
    }
    
    // update by building key (for simpler frontend integration)
    @PutMapping("/key/{buildingKey}")
    public ResponseEntity<Building> updateBuildingByKey(@PathVariable String buildingKey, @RequestBody Building details) {
        Building updated = buildingService.updateBuildingData(buildingKey, details);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBuilding(@PathVariable UUID id) {
        buildingService.deleteBuilding(id);
        return ResponseEntity.noContent().build();
    }
}
