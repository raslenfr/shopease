package com.shopease.product.event;

public record OrderPlacedEvent(Long orderId, Long productId, Integer quantity) {
}
