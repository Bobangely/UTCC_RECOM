package com.example.utccrecom.controller;

import com.example.utccrecom.entity.NearbyPlace;
import com.example.utccrecom.service.NearbyPlaceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/nearby-places")
public class NearbyPlaceController {

    @Autowired
    private NearbyPlaceService nearbyPlaceService;


    @GetMapping
    public List<NearbyPlace> getAll() {
        return nearbyPlaceService.getAllNearbyPlaces();
    }


    @GetMapping("/{id}")
    public ResponseEntity<NearbyPlace> getById(@PathVariable UUID id) {
        return nearbyPlaceService.getNearbyPlaceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/search")
    public List<NearbyPlace> search(@RequestParam String name) {
        return nearbyPlaceService.searchByName(name);
    }

    @GetMapping("/category")
    public List<NearbyPlace> getByCategory(@RequestParam String category) {
        return nearbyPlaceService.getByCategory(category);
    }

    @PostMapping
    public NearbyPlace create(@RequestBody NearbyPlace place) {
        return nearbyPlaceService.saveNearbyPlace(place);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NearbyPlace> update(@PathVariable UUID id,
                                               @RequestBody NearbyPlace details) {
        try {
            return ResponseEntity.ok(nearbyPlaceService.updateNearbyPlace(id, details));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        nearbyPlaceService.deleteNearbyPlace(id);
        return ResponseEntity.noContent().build();
    }
}
