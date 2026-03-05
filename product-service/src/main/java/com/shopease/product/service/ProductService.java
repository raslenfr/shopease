package com.shopease.product.service;

import com.shopease.product.model.Product;
import com.shopease.product.client.OrderServiceClient;
import com.shopease.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final OrderServiceClient orderServiceClient;

    public Product createProduct(Product product) {
        log.info("Creating product: {}", product.getName());
        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStock(productDetails.getStock());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        var orderCount = orderServiceClient.getOrderCount(id).count();
        if (orderCount != null && orderCount > 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Cannot delete product because it has " + orderCount + " existing order(s)."
            );
        }
        productRepository.deleteById(id);
    }

    public void decrementStock(Long productId, Integer quantity) {
        if (productId == null || quantity == null || quantity <= 0) {
            log.warn("Skipping stock decrement due to invalid input. productId={}, quantity={}", productId, quantity);
            return;
        }

        var productOpt = productRepository.findById(productId);
        if (productOpt.isEmpty()) {
            log.warn("Product not found for stock decrement. productId={}", productId);
            return;
        }

        Product product = productOpt.get();
        Integer currentStock = product.getStock();
        int safeCurrentStock = currentStock == null ? 0 : currentStock;
        int updatedStock = safeCurrentStock - quantity;
        if (updatedStock < 0) {
            log.warn("Stock underflow for product {}. current={}, decrement={}. Setting to 0.",
                    productId, safeCurrentStock, quantity);
            updatedStock = 0;
        }

        product.setStock(updatedStock);
        productRepository.save(product);
        log.info("Decremented stock for product {} from {} to {}", productId, safeCurrentStock, updatedStock);
    }
}
