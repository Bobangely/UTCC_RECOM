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

    public void deleteNearbyPlace(UUID id) {
        nearbyPlaceRepository.deleteById(id);
    }
}
