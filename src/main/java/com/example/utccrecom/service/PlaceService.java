package com.example.utccrecom.service;

import com.example.utccrecom.entity.Place;
import com.example.utccrecom.repository.PlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PlaceService {

    @Autowired
    private PlaceRepository placeRepository;

    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    public Optional<Place> getPlaceById(UUID id) {
        return placeRepository.findById(id);
    }

    @Transactional
    public Place savePlace(Place place) {
        return placeRepository.save(place);
    }

    @Transactional
    public Place updatePlaceData(UUID id, Place placeDetails) {
        Place existingPlace = placeRepository.findById(id).orElseThrow(() -> new RuntimeException("Place not found"));
        
        existingPlace.setName(placeDetails.getName());
        existingPlace.setDescription(placeDetails.getDescription());
        existingPlace.setAddress(placeDetails.getAddress());
        existingPlace.setLatitude(placeDetails.getLatitude());
        existingPlace.setLongitude(placeDetails.getLongitude());
        existingPlace.setCategory(placeDetails.getCategory());
        existingPlace.setDistance(placeDetails.getDistance());
        existingPlace.setRating(placeDetails.getRating());
        existingPlace.setMapsUrl(placeDetails.getMapsUrl());
        
        if (placeDetails.getTags() != null) {
            existingPlace.getTags().clear();
            existingPlace.getTags().addAll(placeDetails.getTags());
        }
        
        if (placeDetails.getImages() != null) {
            existingPlace.getImages().clear();
            existingPlace.getImages().addAll(placeDetails.getImages());
        }

        return placeRepository.save(existingPlace);
    }

    @Transactional
    public void deletePlace(UUID id) {
        placeRepository.deleteById(id);
    }

    public List<Place> searchPlacesByName(String name) {
        return placeRepository.findByNameContainingIgnoreCase(name);
    }

    public List<Place> getPlacesByCategory(String category) {
        return placeRepository.findByCategory(category);
    }
}
