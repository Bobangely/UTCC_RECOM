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

    public List<NearbyPlace> getAllNearbyPlaces() {
        return nearbyPlaceRepository.findAll();
    }

    public Optional<NearbyPlace> getNearbyPlaceById(UUID id) {
        return nearbyPlaceRepository.findById(id);
    }

    public List<NearbyPlace> getNearbyPlacesByCategory(String category) {
        if ("all".equalsIgnoreCase(category)) {
            return nearbyPlaceRepository.findAll();
        }
        return nearbyPlaceRepository.findByCategory(category);
    }

    public List<NearbyPlace> searchByName(String name) {
        return nearbyPlaceRepository.findByNameContainingIgnoreCase(name);
    }

    @Transactional
    public NearbyPlace saveNearbyPlace(NearbyPlace place) {
        return nearbyPlaceRepository.save(place);
    }

    @Transactional
    public NearbyPlace updateNearbyPlace(UUID id, NearbyPlace details) {
        NearbyPlace existing = nearbyPlaceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Place not found with id: " + id));

        // Partial update: only overwrite non-null fields
        if (details.getName() != null) existing.setName(details.getName());
        if (details.getDescription() != null) existing.setDescription(details.getDescription());
        if (details.getCategory() != null) existing.setCategory(details.getCategory());
        if (details.getDistance() != null) existing.setDistance(details.getDistance());
        if (details.getRating() != null) existing.setRating(details.getRating());
        if (details.getMapsUrl() != null) existing.setMapsUrl(details.getMapsUrl());
        if (details.getLatitude() != null) existing.setLatitude(details.getLatitude());
        if (details.getLongitude() != null) existing.setLongitude(details.getLongitude());
        if (details.getTags() != null && !details.getTags().isEmpty()) {
            existing.getTags().clear();
            existing.getTags().addAll(details.getTags());
        }
        if (details.getImages() != null && !details.getImages().isEmpty()) {
            existing.getImages().clear();
            existing.getImages().addAll(details.getImages());
        }

        return nearbyPlaceRepository.save(existing);
    }

    public void deleteNearbyPlace(UUID id) {
        nearbyPlaceRepository.deleteById(id);
    }
}
