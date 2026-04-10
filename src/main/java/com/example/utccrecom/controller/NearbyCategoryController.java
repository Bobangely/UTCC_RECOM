package com.example.utccrecom.controller;

import com.example.utccrecom.entity.NearbyCategory;
import com.example.utccrecom.repository.NearbyCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/api/nearby-categories")
public class NearbyCategoryController {

    @Autowired
    private NearbyCategoryRepository categoryRepository;


    @GetMapping
    public List<NearbyCategory> getAll() {
        return categoryRepository.findAllByOrderBySortOrderAsc();
    }


    @GetMapping("/{id}")
    public ResponseEntity<NearbyCategory> getById(@PathVariable UUID id) {
        return categoryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PostMapping
    public NearbyCategory create(@RequestBody NearbyCategory category) {
        return categoryRepository.save(category);
    }


    @PutMapping("/{id}")
    public ResponseEntity<NearbyCategory> update(@PathVariable UUID id,
                                                  @RequestBody NearbyCategory details) {
        return categoryRepository.findById(id).map(existing -> {
            existing.setName(details.getName());
            existing.setLabel(details.getLabel());
            existing.setIcon(details.getIcon());
            existing.setSortOrder(details.getSortOrder());
            return ResponseEntity.ok(categoryRepository.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!categoryRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        categoryRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
