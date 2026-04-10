package com.example.utccrecom.service;

import com.example.utccrecom.entity.NearbyPlace;
import com.example.utccrecom.repository.NearbyPlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class NearbyPlaceService {

    @Autowired
    private NearbyPlaceRepository nearbyPlaceRepository;

    // ── Read ─────────────────────────────────────────────────

    public List<NearbyPlace> getAllNearbyPlaces() {
        return nearbyPlaceRepository.findAll();
    }

    public Optional<NearbyPlace> getNearbyPlaceById(UUID id) {
        return nearbyPlaceRepository.findById(id);
    }

    public List<NearbyPlace> searchByName(String name) {
        return nearbyPlaceRepository.findByNameContainingIgnoreCase(name);
    }

    public List<NearbyPlace> getByCategory(String category) {
        return nearbyPlaceRepository.findByCategory(category);
    }

    // ── Write ─────────────────────────────────────────────────

    @Transactional
    public NearbyPlace saveNearbyPlace(NearbyPlace place) {
        return nearbyPlaceRepository.save(place);
    }

    @Transactional
    public NearbyPlace updateNearbyPlace(UUID id, NearbyPlace details) {
        NearbyPlace existing = nearbyPlaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("NearbyPlace not found: " + id));

        existing.setName(details.getName());
        existing.setDescription(details.getDescription());
        existing.setCategory(details.getCategory());
        existing.setDistance(details.getDistance());
        existing.setRating(details.getRating());
        existing.setMapsUrl(details.getMapsUrl());

        if (details.getTags() != null) {
            existing.getTags().clear();
            existing.getTags().addAll(details.getTags());
        }
        if (details.getImages() != null) {
            existing.getImages().clear();
            existing.getImages().addAll(details.getImages());
        }

        return nearbyPlaceRepository.save(existing);
    }

    @Transactional
    public void deleteNearbyPlace(UUID id) {
        nearbyPlaceRepository.deleteById(id);
    }
}
