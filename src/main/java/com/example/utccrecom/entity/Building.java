package com.example.utccrecom.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "buildings")
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private String buildingKey;   // เช่น "อาคาร 24"

    private String title;
    
    @Column(name = "\"desc\"", columnDefinition = "TEXT")
    private String desc;
    
    private String image;
    
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "building_images", joinColumns = @JoinColumn(name = "building_id"))
    @Column(name = "image_url")
    private List<String> images = new ArrayList<>();
    
    private String floors;
    private String faculty;
    private String hours;
    
    @Column(columnDefinition = "TEXT")
    private String facilities;

    public Building() {}

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getBuildingKey() { return buildingKey; }
    public void setBuildingKey(String buildingKey) { this.buildingKey = buildingKey; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDesc() { return desc; }
    public void setDesc(String desc) { this.desc = desc; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public List<String> getImages() { return images; }
    public void setImages(List<String> images) { this.images = images; }

    public String getFloors() { return floors; }
    public void setFloors(String floors) { this.floors = floors; }

    public String getFaculty() { return faculty; }
    public void setFaculty(String faculty) { this.faculty = faculty; }

    public String getHours() { return hours; }
    public void setHours(String hours) { this.hours = hours; }

    public String getFacilities() { return facilities; }
    public void setFacilities(String facilities) { this.facilities = facilities; }
}
