package com.example.utccrecom.entity;

import jakarta.persistence.*;
import java.util.UUID;


@Entity
@Table(name = "nearby_categories")
public class NearbyCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;


    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String label;

    private String icon;

    private int sortOrder;

    public NearbyCategory() {}

    public NearbyCategory(String name, String label, String icon, int sortOrder) {
        this.name = name;
        this.label = label;
        this.icon = icon;
        this.sortOrder = sortOrder;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }

    public int getSortOrder() { return sortOrder; }
    public void setSortOrder(int sortOrder) { this.sortOrder = sortOrder; }
}
