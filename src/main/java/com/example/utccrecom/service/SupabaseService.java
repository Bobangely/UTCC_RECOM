package com.example.utccrecom.service;

import com.example.utccrecom.entity.Location;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupabaseService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.anon-key}")
    private String supabaseAnonKey;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public SupabaseService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public List<Location> searchLocations(String keywords) {
        // ใช้ * แทน % สำหรับการค้นหาด้วย ilike ใน Supabase (PostgREST)
        // และเพิ่ม URL Encoding ผ่าน UriComponentsBuilder เพื่อไม่ให้ URL มีปัญหาตอนส่งภาษาไทย
        String orQuery = Arrays.stream(keywords.split(","))
                .map(String::trim)
                .filter(kw -> !kw.isEmpty())
                .map(kw -> String.format("title.ilike.*%s*,desc.ilike.*%s*", kw, kw))
                .collect(Collectors.joining(","));

        URI url = UriComponentsBuilder.fromHttpUrl(supabaseUrl)
                .path("/rest/v1/buildings")
                .queryParam("select", "*")
                .queryParam("or", "(" + orQuery + ")")
                .queryParam("order", "title.asc")
                .build()
                .encode()
                .toUri();

        return getLocationsFromSupabase(url);
    }

    public List<Location> findAllLocations() {
        URI url = UriComponentsBuilder.fromHttpUrl(supabaseUrl)
                .path("/rest/v1/buildings")
                .queryParam("select", "*")
                .queryParam("order", "title.asc")
                .build()
                .encode()
                .toUri();
                
        return getLocationsFromSupabase(url);
    }

    private List<Location> getLocationsFromSupabase(URI url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseAnonKey);
        headers.set("Authorization", "Bearer " + supabaseAnonKey);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> rawResponse = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            if (rawResponse.getBody() != null && !rawResponse.getBody().isEmpty() && !rawResponse.getBody().equals("[]")) {
                return Arrays.asList(objectMapper.readValue(rawResponse.getBody(), Location[].class));
            }
            return List.of();
            
        } catch (RestClientException e) {
            System.err.println("Error during Supabase request: " + e.getMessage());
            throw new RuntimeException("Failed to fetch data from Supabase. Error: " + e.getMessage(), e);
        } catch (Exception e) {
            System.err.println("Error processing Supabase response: " + e.getMessage());
            throw new RuntimeException("Failed to process Supabase response. Error: " + e.getMessage(), e);
        }
    }
}