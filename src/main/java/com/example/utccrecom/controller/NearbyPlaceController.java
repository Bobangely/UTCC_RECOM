package com.example.utccrecom.controller;

import com.example.utccrecom.entity.NearbyPlace;
import com.example.utccrecom.service.NearbyPlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/nearby-places")
public class NearbyPlaceController {

    @Autowired
    private NearbyPlaceService nearbyPlaceService;

    @GetMapping
    public List<NearbyPlace> getAllNearbyPlaces() {
        return nearbyPlaceService.getAllNearbyPlaces();
    }

    @GetMapping("/{id}")
    public ResponseEntity<NearbyPlace> getNearbyPlaceById(@PathVariable UUID id) {
        Optional<NearbyPlace> place = nearbyPlaceService.getNearbyPlaceById(id);
        return place.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<NearbyPlace> searchNearbyPlaces(@RequestParam String name) {
        return nearbyPlaceService.searchByName(name);
    }

    @GetMapping("/category/{category}")
    public List<NearbyPlace> getNearbyPlacesByCategory(@PathVariable String category) {
        return nearbyPlaceService.getNearbyPlacesByCategory(category);
    }

    @PostMapping
    public NearbyPlace createNearbyPlace(@RequestBody NearbyPlace place) {
        return nearbyPlaceService.saveNearbyPlace(place);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NearbyPlace> updateNearbyPlace(@PathVariable UUID id, @RequestBody NearbyPlace details) {
        try {
            NearbyPlace updatedPlace = nearbyPlaceService.updateNearbyPlace(id, details);
            return ResponseEntity.ok(updatedPlace);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNearbyPlace(@PathVariable UUID id) {
        nearbyPlaceService.deleteNearbyPlace(id);
        return ResponseEntity.noContent().build();
    }
}
