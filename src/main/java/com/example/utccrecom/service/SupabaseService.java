package com.example.utccrecom.service;

import com.example.utccrecom.entity.Location;
import com.fasterxml.jackson.databind.ObjectMapper; // Import ObjectMapper
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;

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
    private final ObjectMapper objectMapper; // Add ObjectMapper

    public SupabaseService(RestTemplate restTemplate, ObjectMapper objectMapper) { // Inject ObjectMapper
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public List<Location> searchLocations(String keywords) {
        String orQuery = Arrays.stream(keywords.split(","))
                .map(String::trim)
                .filter(kw -> !kw.isEmpty())
                .map(kw -> String.format("title.ilike.%%%s%%,desc.ilike.%%%s%%", kw, kw))
                .collect(Collectors.joining(","));
        String url = String.format("%s/rest/v1/buildings?select=*&or=(%s)", supabaseUrl, orQuery);
        return getLocationsFromSupabase(url);
    }

    public List<Location> findAllLocations() {
        String url = String.format("%s/rest/v1/buildings?select=*", supabaseUrl);
        return getLocationsFromSupabase(url);
    }

    private List<Location> getLocationsFromSupabase(String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabaseAnonKey);
        headers.set("Authorization", "Bearer " + supabaseAnonKey);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> rawResponse = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            
            System.out.println("==================== RAW SUPABASE RESPONSE ====================");
            System.out.println(rawResponse.getBody());
            System.out.println("===============================================================");

            if (rawResponse.getBody() != null && !rawResponse.getBody().isEmpty() && !rawResponse.getBody().equals("[]")) {
                // Use ObjectMapper to convert the raw JSON string to a List of Location objects
                return Arrays.asList(objectMapper.readValue(rawResponse.getBody(), Location[].class));
            }
            return List.of(); // Return empty list if body is null or empty
            
        } catch (RestClientException e) {
            System.err.println("Error during Supabase request: " + e.getMessage());
            throw new RuntimeException("Failed to fetch data from Supabase. Error: " + e.getMessage(), e);
        } catch (Exception e) {
            System.err.println("Error processing Supabase response: " + e.getMessage());
            throw new RuntimeException("Failed to process Supabase response. Error: " + e.getMessage(), e);
        }
    }
}