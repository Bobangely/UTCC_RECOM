package com.example.utccrecom.repository;

import com.example.utccrecom.entity.NearbyCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface NearbyCategoryRepository extends JpaRepository<NearbyCategory, UUID> {
    List<NearbyCategory> findAllByOrderBySortOrderAsc();
}
