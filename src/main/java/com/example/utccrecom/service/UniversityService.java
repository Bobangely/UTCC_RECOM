package com.example.utccrecom.service;

import com.example.utccrecom.dto.UniversityItem;
import com.example.utccrecom.entity.Building;
import com.example.utccrecom.entity.Place;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class UniversityService {

    private static final Logger logger = LoggerFactory.getLogger(UniversityService.class);

    @Autowired
    private BuildingService buildingService;

    @Autowired
    private PlaceService placeService;

    // แคช 30 วินาที
    @Cacheable(value = "universityItems", unless = "#result == null")
    public List<UniversityItem> getUniversityItems() {
        List<Building> buildings = buildingService.getAllBuildings();
        List<Place> places = placeService.getAllPlaces(); // เปลี่ยนจาก nearbyPlaceService.getAllNearbyPlaces()

        logger.info("Found {} buildings", buildings.size());
        logger.info("พบ {} places", places.size()); // เปลี่ยนข้อความ log

        List<UniversityItem> universityItems = Stream.concat(
                buildings.stream().map(this::mapBuildingToUniversityItem),
                places.stream().map(this::mapPlaceToUniversityItem) // เปลี่ยนเป็น mapPlaceToUniversityItem
        ).collect(Collectors.toList());

        logger.info("Total university items: {}", universityItems.size());

        return universityItems;
    }

    // ล้าง cache เมื่อข้อมูลเปลี่ยนแปลง
    @CacheEvict(value = "universityItems", allEntries = true)
    public void clearCache() {
        logger.info("University items cache cleared");
    }

    private UniversityItem mapBuildingToUniversityItem(Building building) {
        UniversityItem item = new UniversityItem();
        item.setId(building.getId());
        item.setType("building");
        item.setTitle(building.getTitle());
        item.setBuildingKey(building.getBuildingKey());
        item.setDescription(building.getDesc());
        item.setImageUrl(building.getImage());
        item.setImages(building.getImages());
        item.setCategory("University"); // อาคารเป็นส่วนหนึ่งของมหาวิทยาลัย
        item.setFloors(building.getFloors());
        item.setFaculty(building.getFaculty());
        item.setHours(building.getHours());
        item.setFacilities(building.getFacilities());

        return item;
    }

    private UniversityItem mapPlaceToUniversityItem(Place place) {
        UniversityItem item = new UniversityItem();
        item.setId(place.getId());
        item.setType("place");
        item.setTitle(place.getName());
        item.setDescription(place.getDescription());
        if (place.getImages() != null && !place.getImages().isEmpty()) {
            item.setImageUrl(place.getImages().get(0));
        }
        item.setImages(place.getImages());
        item.setCategory(place.getCategory());
        return item;
    }
}
