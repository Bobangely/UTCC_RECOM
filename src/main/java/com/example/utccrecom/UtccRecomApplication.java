package com.example.utccrecom;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class UtccRecomApplication {

    public static void main(String[] args) {
        SpringApplication.run(UtccRecomApplication.class, args);
    }

}
