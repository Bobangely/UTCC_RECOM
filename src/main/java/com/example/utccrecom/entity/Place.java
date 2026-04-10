package com.example.utccrecom.entity;

import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "places")
public class Place {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String address;
    
    private Double latitude;
    private Double longitude;
    
    private String category;
    
    private String distance;
    private Double rating;
    
    @Column(columnDefinition = "TEXT")
    private String mapsUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "place_tags", joinColumns = @JoinColumn(name = "place_id"))
    @Column(name = "tag")
    private List<String> tags;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "place_images", joinColumns = @JoinColumn(name = "place_id"))
    @Column(name = "image_url")
    private List<String> images;

    public Place() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public List<String> getTags() {
        return tags;
    }

    public void setTags(List<String> tags) {
        this.tags = tags;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public String getDistance() {
        return distance;
    }

    public void setDistance(String distance) {
        this.distance = distance;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getMapsUrl() {
        return mapsUrl;
    }

    public void setMapsUrl(String mapsUrl) {
        this.mapsUrl = mapsUrl;
    }
}
