package com.shopease.product.messaging;

import com.shopease.product.event.OrderPlacedEvent;
import com.shopease.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.function.Consumer;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class OrderPlacedConsumer {

    private final ProductService productService;

    @Bean
    public Consumer<OrderPlacedEvent> orderPlaced() {
        return event -> {
            if (event == null) {
                log.warn("Received null OrderPlacedEvent");
                return;
            }

            log.info("Received OrderPlacedEvent: orderId={}, productId={}, quantity={}",
                    event.orderId(), event.productId(), event.quantity());
            productService.decrementStock(event.productId(), event.quantity());
        };
    }
}
