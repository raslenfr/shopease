# ShopEase

## Overview
ShopEase is a microservices-based e-commerce backend with an Angular frontend. It is built around service discovery, centralized configuration, an API gateway, and both synchronous (REST) and asynchronous (RabbitMQ) communication. The system manages products, orders, authentication, and inventory updates.

## Architecture
- API Gateway (Spring Cloud Gateway): Single entry point for the frontend. Routes requests to services using Eureka discovery.
- Eureka Server: Service discovery for internal service registration and load balancing.
- Config Server: Centralized configuration served from the config-repo folder.
- Product Service (Spring Boot): Manages product catalog and stock.
- Order Service (Node.js + Express): Manages order creation and order history.
- RabbitMQ: Event broker for async messaging between Order Service and Product Service.
- MySQL: Product Service database.
- PostgreSQL: Order Service database.
- Keycloak: Authentication and JWT issuance.

## Core Features
- Product management: create, update, list, delete products.
- Stock tracking: product stock stored in Product Service and reduced when orders are placed.
- Order placement: validates product existence and stock, creates orders and order items.
- Order history: users can fetch their orders.
- Secure APIs: services validate JWTs issued by Keycloak.
- Service discovery and config: automatic registration with Eureka and configuration via Config Server.

## Key Service Responsibilities
### API Gateway
- Routes `/api/products/**` to Product Service and `/api/orders/**` to Order Service.
- Uses Eureka for service discovery and client-side load balancing.
- Handles cross-service routing so the frontend uses a single base URL.

### Product Service
- Stores product data in MySQL.
- Exposes product CRUD endpoints.
- Prevents deletion when a product has existing orders.
- Consumes `OrderPlacedEvent` from RabbitMQ to decrement stock.

### Order Service
- Stores orders and order items in PostgreSQL.
- Validates product stock through Product Service before creating orders.
- Publishes `OrderPlacedEvent` to RabbitMQ after order creation.

### RabbitMQ
- Exchange: `order.placed` (topic)
- Event payload: `{ orderId, productId, quantity }`
- Product Service consumes and updates stock asynchronously.

## Communication Patterns
- Synchronous REST:
  - Frontend -> API Gateway -> Product Service / Order Service.
  - Order Service -> Product Service (product lookup and stock validation).
- Asynchronous Events:
  - Order Service publishes `OrderPlacedEvent` for each order item.
  - Product Service consumes events to decrement stock.

## Authentication and Authorization
- Keycloak provides JWTs.
- API Gateway and services validate JWTs (resource server configuration in Product Service).
- Order Service uses JWT from the gateway to identify the customer email.

## Runtime Topology (Docker Compose)
- Services: keycloak, config-server, eureka-server, api-gateway, product-service, order-service, mysql, postgres, rabbitmq.
- All services run on a shared Docker network for name-based discovery.

## Typical Flow: Place Order
1. Frontend sends `POST /api/orders` to API Gateway.
2. Order Service validates product stock by calling Product Service.
3. Order Service creates order + items in PostgreSQL.
4. Order Service publishes `OrderPlacedEvent` for each item.
5. Product Service consumes the events and decrements stock in MySQL.

## Typical Flow: Delete Product
1. Frontend sends `DELETE /api/products/{id}` to API Gateway.
2. Product Service checks order count via Order Service.
3. If orders exist, Product Service returns 409 Conflict.
4. If no orders, Product Service deletes the product.

## Configuration
- Centralized in `config-repo` and served by Config Server.
- Product Service reads its RabbitMQ and database settings from config-server.

## Notes
- The system combines REST and event-driven messaging to keep product inventory consistent.
- RabbitMQ enables eventual consistency for stock updates while keeping order creation fast.