package com.shopease.eurekaserver;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

/**
 * ShopEase Eureka Discovery Server
 *
 * Acts as the central service registry for the ShopEase platform.
 * All microservices (Product Service, Order Service, API Gateway)
 * register here on startup. The API Gateway uses Eureka to resolve
 * service locations dynamically (no hardcoded URLs).
 *
 * Configuration is fetched from Config Server at startup via bootstrap.yml.
 * The full configuration lives in: config-repo/eureka-server.yml
 *
 * Dashboard available at: http://localhost:8761
 */
@SpringBootApplication
@EnableEurekaServer // ← Activates the Eureka registry and web dashboard
public class EurekaServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}
