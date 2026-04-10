package com.example.utccrecom.controller;

import com.example.utccrecom.dto.UniversityItem;
import com.example.utccrecom.service.UniversityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/university")
public class UniversityController {

    @Autowired
    private UniversityService universityService;

    @GetMapping("/items")
    public List<UniversityItem> getUniversityItems() {
        return universityService.getUniversityItems();
    }
}
