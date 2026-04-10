package com.example.utccrecom.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "nearby_places")
public class NearbyPlace {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String category;

    private String distance;

    private Double rating;

    @Column(columnDefinition = "TEXT")
    private String mapsUrl;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "nearby_place_tags",
            joinColumns = @JoinColumn(name = "nearby_place_id"))
    @Column(name = "tag")
    private List<String> tags = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "nearby_place_images",
            joinColumns = @JoinColumn(name = "nearby_place_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();

    // Constructors
    public NearbyPlace() {}

    // Getters & Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDistance() { return distance; }
    public void setDistance(String distance) { this.distance = distance; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getMapsUrl() { return mapsUrl; }
    public void setMapsUrl(String mapsUrl) { this.mapsUrl = mapsUrl; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }
}
