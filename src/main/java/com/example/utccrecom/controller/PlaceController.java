package com.example.utccrecom.controller;

import com.example.utccrecom.entity.Place;
import com.example.utccrecom.service.PlaceService;
import com.example.utccrecom.service.UniversityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
//http://localhost:8080/api/places
@RequestMapping("/api/places")
public class PlaceController {

    @Autowired
    private PlaceService placeService;

    @Autowired
    private UniversityService universityService;

    // Fetch all places (For Map and List)
    @GetMapping
    public List<Place> getAllPlaces() {
        return placeService.getAllPlaces();
    }

    // Fetch a single place by ID
    @GetMapping("/{id}")
    public ResponseEntity<Place> getPlaceById(@PathVariable UUID id) {
        Optional<Place> place = placeService.getPlaceById(id);
        if (place.isPresent()) {
            return ResponseEntity.ok(place.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Search places by name (e.g., /api/places/search?name=Cafe)
    @GetMapping("/search")
    public List<Place> searchPlaces(@RequestParam String name) {
        return placeService.searchPlacesByName(name);
    }

    // Filter places by category
    @GetMapping("/category")
    public List<Place> getPlacesByCategory(@RequestParam String category) {
        return placeService.getPlacesByCategory(category);
    }

    // Create a new place
    @PostMapping
    public Place createPlace(@RequestBody Place place) {
        Place saved = placeService.savePlace(place);
        universityService.clearCache(); // Clear cache after create
        return saved;
    }

    // Update an existing place
    @PutMapping("/{id}")
    public ResponseEntity<Place> updatePlace(@PathVariable UUID id, @RequestBody Place placeDetails) {
        try {
            Place updatedPlace = placeService.updatePlaceData(id, placeDetails);
            universityService.clearCache(); // Clear cache after update
            return ResponseEntity.ok(updatedPlace);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete a place
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlace(@PathVariable UUID id) {
        placeService.deletePlace(id);
        universityService.clearCache(); // Clear cache after delete
        return ResponseEntity.noContent().build();
    }
}
