package com.shopease.product.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "order-service", path = "/orders")
public interface OrderServiceClient {

    @GetMapping("/product/{productId}/count")
    OrderCountResponse getOrderCount(@PathVariable("productId") Long productId);

    record OrderCountResponse(Long productId, Long count) {}
}
