# 🛍️ ShopEase – Full Stack Microservices E‑Commerce Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen)](https://spring.io/projects/spring-boot)
[![Node.js](https://img.shields.io/badge/Node.js-18-green)](https://nodejs.org/)
[![Angular](https://img.shields.io/badge/Angular-19-red)](https://angular.io/)
[![Keycloak](https://img.shields.io/badge/Keycloak-24.0-blue)](https://www.keycloak.org/)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3-orange)](https://www.rabbitmq.com/)
[![Docker](https://img.shields.io/badge/Docker-✔️-blue)](https://www.docker.com/)

## 🎯 Project Overview

ShopEase is a modern e‑commerce platform built with a **microservices architecture**. It demonstrates industry best practices including service discovery, centralized configuration, an API gateway, JWT authentication with Keycloak, and both synchronous (REST) and asynchronous (RabbitMQ) communication. The system manages products, orders, user authentication, and real‑time inventory updates – all fully containerized with Docker.

<table>
<thead>
<tr>
<th>Feature</th>
<th>Icon</th>
<th>Description</th>
<th>Benefit</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Multi‑Service Architecture</strong></td>
<td>🧩</td>
<td>Separate services for products, orders, gateway, discovery, and config</td>
<td>Scalability, independent deployment</td>
</tr>
<tr>
<td><strong>Different Tech Stack</strong></td>
<td>⚙️</td>
<td>Product Service (Java/Spring Boot) + Order Service (Node.js/Express)</td>
<td>Flexibility, best tool for each job</td>
</tr>
<tr>
<td><strong>Two Databases</strong></td>
<td>🗄️</td>
<td>MySQL (products) + PostgreSQL (orders)</td>
<td>Data isolation, optimized storage</td>
</tr>
<tr>
<td><strong>Event‑Driven Updates</strong></td>
<td>📨</td>
<td>RabbitMQ for asynchronous stock updates</td>
<td>Decoupling, eventual consistency</td>
</tr>
</tbody>
</table>

## 🛠️ Technology Stack

<table>
<thead>
<tr>
<th>Technology</th>
<th>Icon</th>
<th>Purpose</th>
<th>Implementation</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Java 17 + Spring Boot</strong></td>
<td>☕</td>
<td>Product Service, API Gateway, Eureka, Config Server</td>
<td>REST APIs, service discovery, config management</td>
</tr>
<tr>
<td><strong>Node.js + Express</strong></td>
<td>🟢</td>
<td>Order Service</td>
<td>Lightweight order management, Sequelize ORM</td>
</tr>
<tr>
<td><strong>Angular 19</strong></td>
<td>🅰️</td>
<td>Frontend application</td>
<td>Modern, reactive user interface</td>
</tr>
<tr>
<td><strong>Keycloak 24</strong></td>
<td>🔐</td>
<td>Authentication & JWT issuance</td>
<td>OAuth2 / OpenID Connect provider</td>
</tr>
<tr>
<td><strong>RabbitMQ</strong></td>
<td>🐇</td>
<td>Asynchronous messaging</td>
<td>Order‑placed events, stock updates</td>
</tr>
<tr>
<td><strong>MySQL 8</strong></td>
<td>🐬</td>
<td>Product database</td>
<td>Stores product catalog and stock</td>
</tr>
<tr>
<td><strong>PostgreSQL 15</strong></td>
<td>🐘</td>
<td>Order database</td>
<td>Stores orders and order items</td>
</tr>
<tr>
<td><strong>Docker & Docker Compose</strong></td>
<td>🐳</td>
<td>Containerization & orchestration</td>
<td>All services run in containers</td>
</tr>
</tbody>
</table>

## 🔑 User Management System

<table>
<thead>
<tr>
<th>Role</th>
<th>Username</th>
<th>Password</th>
<th>Capabilities</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>👑 Administrator</strong></td>
<td><code>admin</code></td>
<td><code>admin123</code></td>
<td>Full CRUD on products; can delete products (with order check)</td>
</tr>
<tr>
<td><strong>👤 Regular User</strong></td>
<td><code>raslen</code></td>
<td><code>raslen2002</code></td>
<td>Browse products, place orders, view own order history</td>
</tr>
</tbody>
</table>

## 🏗️ Microservices & Responsibilities

<table>
<thead>
<tr>
<th>Service</th>
<th>Icon</th>
<th>Language / Framework</th>
<th>Database</th>
<th>Key Responsibilities</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Product Service</strong></td>
<td>📦</td>
<td>Java 17 / Spring Boot</td>
<td>MySQL</td>
<td>Product CRUD, stock management, consume order‑placed events</td>
</tr>
<tr>
<td><strong>Order Service</strong></td>
<td>📋</td>
<td>Node.js / Express</td>
<td>PostgreSQL</td>
<td>Order creation/retrieval, stock validation, publish order‑placed events</td>
</tr>
<tr>
<td><strong>API Gateway</strong></td>
<td>🚪</td>
<td>Java 17 / Spring Cloud Gateway</td>
<td>–</td>
<td>Route requests, JWT validation, load balancing via Eureka</td>
</tr>
<tr>
<td><strong>Eureka Server</strong></td>
<td>🔎</td>
<td>Java 17 / Netflix Eureka</td>
<td>–</td>
<td>Service discovery and registration</td>
</tr>
<tr>
<td><strong>Config Server</strong></td>
<td>⚙️</td>
<td>Java 17 / Spring Cloud Config</td>
<td>–</td>
<td>Centralized configuration for all services</td>
</tr>
<tr>
<td><strong>Keycloak</strong></td>
<td>🔐</td>
<td>Keycloak 24 (Java)</td>
<td>–</td>
<td>Authentication, JWT tokens, realm management</td>
</tr>
<tr>
<td><strong>RabbitMQ</strong></td>
<td>🐇</td>
<td>RabbitMQ 3</td>
<td>–</td>
<td>Event broker for asynchronous communication</td>
</tr>
</tbody>
</table>

## 📁 Repository Structure

<table>
<thead>
<tr>
<th>Folder / File</th>
<th>Content</th>
<th>Purpose</th>
</tr>
</thead>
<tbody>
<tr>
<td><code>api-gateway/</code></td>
<td>Spring Cloud Gateway source</td>
<td>Routes frontend requests to appropriate services</td>
</tr>
<tr>
<td><code>config-repo/</code></td>
<td>YAML configuration files</td>
<td>Centralized config for all services (application, product‑service, etc.)</td>
</tr>
<tr>
<td><code>config-server/</code></td>
<td>Spring Cloud Config Server</td>
<td>Serves configurations from <code>config-repo</code></td>
</tr>
<tr>
<td><code>eureka-server/</code></td>
<td>Netflix Eureka Server</td>
<td>Service registry</td>
</tr>
<tr>
<td><code>keycloak/</code></td>
<td>Realm export & setup scripts</td>
<td>Preconfigured Keycloak realm for ShopEase</td>
</tr>
<tr>
<td><code>mysql/</code></td>
<td>Initialization scripts</td>
<td>Creates <code>shopease_products</code> database and user</td>
</tr>
<tr>
<td><code>order-service/</code></td>
<td>Node.js + Express source</td>
<td>Order management microservice</td>
</tr>
<tr>
<td><code>postgres/</code></td>
<td>Initialization scripts</td>
<td>Creates <code>shopease_orders</code> database and user</td>
</tr>
<tr>
<td><code>product-service/</code></td>
<td>Spring Boot source</td>
<td>Product management microservice</td>
</tr>
<tr>
<td><code>shopease-frontend/</code></td>
<td>Angular 19 frontend</td>
<td>User interface</td>
</tr>
<tr>
<td><code>docker-compose.yml</code></td>
<td>Docker Compose file</td>
<td>Orchestrates all services</td>
</tr>
<tr>
<td><code>shopease.md</code></td>
<td>Documentation</td>
<td>This file (project overview)</td>
</tr>
</tbody>
</table>

## 🔄 Communication Patterns

<table>
<thead>
<tr>
<th>Pattern</th>
<th>Direction</th>
<th>Technology</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Synchronous REST</strong></td>
<td>Frontend → Gateway → Services<br>Order Service → Product Service</td>
<td>HTTP / Feign (Java) / Axios (Node)</td>
<td>Real‑time product lookup, stock validation, order creation</td>
</tr>
<tr>
<td><strong>Asynchronous Events</strong></td>
<td>Order Service → RabbitMQ → Product Service</td>
<td>RabbitMQ (topic exchange <code>order.placed</code>)</td>
<td>Stock decrement after order placement (eventual consistency)</td>
</tr>
</tbody>
</table>

## ✨ Core Features & Flows

<table>
<thead>
<tr>
<th>Feature</th>
<th>Icon</th>
<th>Description</th>
<th>User Impact</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Product Management</strong></td>
<td>📦</td>
<td>Admin can create, update, delete products (with order validation)</td>
<td>Catalog always up‑to‑date</td>
</tr>
<tr>
<td><strong>Stock Tracking</strong></td>
<td>📊</td>
<td>Automatic stock reduction when orders are placed</td>
<td>Prevents overselling</td>
</tr>
<tr>
<td><strong>Order Placement</strong></td>
<td>🛒</td>
<td>User selects products, checks stock, creates order</td>
<td>Seamless buying experience</td>
</tr>
<tr>
<td><strong>Order History</strong></td>
<td>📜</td>
<td>Logged‑in users can view their past orders</td>
<td>Track purchases</td>
</tr>
<tr>
<td><strong>JWT Authentication</strong></td>
<td>🔑</td>
<td>Keycloak‑issued tokens validated at gateway and services</td>
<td>Secure access control</td>
</tr>
<tr>
<td><strong>Role‑Based Access</strong></td>
<td>👤👑</td>
<td>Admin vs. regular user permissions</td>
<td>Tailored capabilities</td>
</tr>
<tr>
<td><strong>Service Discovery</strong></td>
<td>🔎</td>
<td>All services register with Eureka; Gateway uses <code>lb://</code></td>
<td>Dynamic routing, resilience</td>
</tr>
<tr>
<td><strong>Centralized Config</strong></td>
<td>⚙️</td>
<td>Config Server serves environment‑specific properties</td>
<td>Easy configuration management</td>
</tr>
</tbody>
</table>

## 🚀 Typical Flow: Place an Order

1. **Frontend** sends `POST /api/orders` with selected items ➔ **API Gateway**
2. Gateway forwards request to **Order Service** (via Eureka)
3. **Order Service** calls **Product Service** (`GET /products/{id}`) to validate stock and fetch price
4. If stock sufficient → Order Service creates order + items in **PostgreSQL**
5. Order Service publishes `OrderPlacedEvent` (per item) to **RabbitMQ**
6. **Product Service** consumes events and decrements stock in **MySQL**

**Result**: Order created asynchronously, inventory updated.

## 🗑️ Typical Flow: Delete a Product

1. **Admin** sends `DELETE /api/products/{id}` ➔ **API Gateway**
2. Gateway forwards to **Product Service**
3. Product Service queries **Order Service** (`GET /orders/product/{id}/count`) to check for existing orders
4. If orders exist → returns `409 Conflict` with message
5. If no orders → product is deleted from **MySQL**

**Why 409?** Prevents orphaned references and maintains data integrity.

## 🐳 Docker Compose Services

| Service | Container Name | Port (Host) | Health Check |
|---------|----------------|-------------|--------------|
| Keycloak | keycloak-shopease | 8180 | ✅ |
| Config Server | config-server | 8888 | ✅ |
| Eureka Server | eureka-server | 8761 | ✅ |
| API Gateway | api-gateway | 8080 | ✅ |
| Product Service | product-service | 8081 | ✅ |
| Order Service | order-service | 8082 | ✅ |
| MySQL | mysql-db | 3306 | ✅ (using `shopease` user) |
| PostgreSQL | postgres-db | 5432 | ✅ |
| RabbitMQ | rabbitmq | 5672, 15672 | ✅ |

Start everything with:
```bash
docker-compose up --build
```

## 📊 API Endpoints (via Gateway)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/products` | List all products | Public |
| POST | `/api/products` | Create new product | Admin |
| DELETE | `/api/products/{id}` | Delete a product | Admin |
| POST | `/api/orders` | Place a new order | User |
| GET | `/api/orders/my-orders` | Get authenticated user’s orders | User |

## 🧪 Test Credentials

| Role | Username | Password |
|------|----------|----------|
| 👑 **Admin** | `admin` | `admin123` |
| 👤 **User**  | `raslen` | `raslen2002` |

## 🌟 Unique Value Propositions

<table>
<thead>
<tr>
<th>Proposition</th>
<th>Icon</th>
<th>Description</th>
<th>Benefit</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>Polyglot Microservices</strong></td>
<td>🔀</td>
<td>Java + Node.js, MySQL + PostgreSQL</td>
<td>Choose the best tool for each job</td>
</tr>
<tr>
<td><strong>Event‑Driven Consistency</strong></td>
<td>📨</td>
<td>RabbitMQ ensures eventual consistency for stock</td>
<td>Decoupled, scalable architecture</td>
</tr>
<tr>
<td><strong>Full‑Stack Containerization</strong></td>
<td>🐳</td>
<td>All services run in Docker, one‑command startup</td>
<td>Easy deployment and testing</td>
</tr>
<tr>
<td><strong>Enterprise‑Grade Security</strong></td>
<td>🔐</td>
<td>Keycloak + JWT + role‑based access control</td>
<td>Robust authentication and authorization</td>
</tr>
</tbody>
</table>

---

**Made with ❤️ by Raslen Ferchichi**  
*Demonstrating modern microservices architecture in action* 🚀
