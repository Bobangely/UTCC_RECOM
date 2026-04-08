package com.example.utccrecom.service;

import com.example.utccrecom.entity.Place;
import com.example.utccrecom.repository.PlaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    public Place savePlace(Place place) {
        return placeRepository.save(place);
    }

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
