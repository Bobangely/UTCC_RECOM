package com.example.utccrecom.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties; // Import JsonIgnoreProperties

// Location class is now immutable after creation via @JsonCreator
@JsonIgnoreProperties(ignoreUnknown = true) // Ignore any JSON fields not defined in this class
public class Location {

    private String id;
    private String name;
    private String description;
    private String imageUrl;

    // This constructor tells Jackson how to create a Location object from JSON
    @JsonCreator
    public Location(
            @JsonProperty("id") String id,
            @JsonProperty("title") String name, // Read from "title" in JSON, map to Java field 'name'
            @JsonProperty("desc") String description, // Read from "desc" in JSON, map to Java field 'description'
            @JsonProperty("image") String imageUrl // Read from "image" in JSON, map to Java field 'imageUrl'
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imageUrl = imageUrl;
    }

    // --- Getters ---
    // These methods tell Jackson what to write back into the final JSON
    // Jackson will infer the JSON property names from these getter names (id, name, description, imageUrl)
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    // --- Setters are removed to make the object immutable and resolve JSON deserialization ambiguity ---
}