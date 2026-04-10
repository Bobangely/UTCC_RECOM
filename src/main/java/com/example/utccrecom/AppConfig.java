package com.example.utccrecom;

import com.fasterxml.jackson.databind.ObjectMapper; // Import ObjectMapper
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Bean // Add ObjectMapper as a Spring Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}