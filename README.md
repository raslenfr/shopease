🛍️ ShopEase – Full Stack Microservices E‑Commerce Platform
https://img.shields.io/badge/Spring%2520Boot-3.2.5-brightgreen
https://img.shields.io/badge/Node.js-18-green
https://img.shields.io/badge/Angular-19-red
https://img.shields.io/badge/Keycloak-24.0-blue
https://img.shields.io/badge/RabbitMQ-3-orange
https://img.shields.io/badge/Docker-%E2%9C%94%EF%B8%8F-blue

📋 Overview
ShopEase is a modern, production‑ready e‑commerce platform built with a microservices architecture. It demonstrates industry best practices including service discovery, centralized configuration, an API gateway, JWT authentication with Keycloak, and both synchronous (REST) and asynchronous (RabbitMQ) communication.

The system manages products, orders, user authentication, and real‑time inventory updates – all fully containerized with Docker.

🏗️ Architecture
Component	Technology	Language	Database
API Gateway	Spring Cloud Gateway	Java 17	–
Eureka Server	Netflix Eureka	Java 17	–
Config Server	Spring Cloud Config	Java 17	–
Product Service	Spring Boot 3.2.5	Java 17	MySQL 8.0
Order Service	Node.js + Express 4	JavaScript (Node 18)	PostgreSQL 15
Frontend	Angular 19	TypeScript	–
Authentication	Keycloak 24.0	Java	–
Message Broker	RabbitMQ 3	–	–
All services run in Docker containers and communicate over a shared Docker network using service names for discovery.

🔑 Test Credentials
You can use these pre‑configured users to test the application:

Role	Username	Password
👑 Admin	admin	admin123
👤 User	raslen	raslen2002
✨ Core Features
✅ Product Management – Create, read, update, and delete products (Admin only)

✅ Stock Tracking – Automatic inventory updates when orders are placed

✅ Order Placement – Validates stock and creates orders with items

✅ Order History – Users can view their past orders

✅ JWT Authentication – Secure endpoints with Keycloak‑issued tokens

✅ Role‑Based Access – Admin vs. regular user permissions

✅ Service Discovery – All services register with Eureka

✅ Centralized Configuration – Config Server serves environment‑specific properties

✅ Asynchronous Updates – RabbitMQ ensures eventual consistency for stock

🔄 Communication Patterns
📡 Synchronous (REST)
text
Frontend → API Gateway → Product Service / Order Service
Order Service → Product Service (stock validation)
📨 Asynchronous (RabbitMQ)
Exchange: order.placed (topic)

Event: { orderId, productId, quantity }

Flow: Order Service publishes → Product Service consumes → stock is decremented

🚀 Typical Flow: Place an Order
User sends POST /api/orders (via frontend) ➔ API Gateway

Order Service validates stock by calling Product Service

Stock is sufficient ➔ Order Service creates order + items in PostgreSQL

Order Service publishes OrderPlacedEvent to RabbitMQ for each item

Product Service consumes events and decrements stock in MySQL

Result: Order created, inventory updated asynchronously 🎯

🗑️ Typical Flow: Delete a Product
Admin sends DELETE /api/products/{id} ➔ API Gateway

Product Service checks with Order Service if any orders exist for this product

If orders exist ➔ returns 409 Conflict with a clear message

If no orders ➔ product is deleted from MySQL

Why 409? Prevents orphaned references and maintains data integrity.

🐳 Docker Setup
All services are defined in docker-compose.yml and can be started with:

bash
docker-compose up --build
Service	Container Name	Port
Keycloak	keycloak-shopease	8180
Config Server	config-server	8888
Eureka Server	eureka-server	8761
API Gateway	api-gateway	8080
Product Service	product-service	8081
Order Service	order-service	8082
MySQL	mysql-db	3306
PostgreSQL	postgres-db	5432
RabbitMQ	rabbitmq	5672 / 15672*
* Management UI available at http://localhost:15672 (guest/guest)

🛠️ Technologies Used
Backend
Java 17 – Product Service, API Gateway, Eureka, Config Server

Spring Boot 3.2.5 – Rapid microservice development

Spring Cloud – Service discovery & config

Node.js 18 + Express – Lightweight Order Service

Sequelize ORM – PostgreSQL integration

Axios – HTTP client for inter‑service calls

Frontend
Angular 19 – Modern, reactive UI

Keycloak Angular – Seamless authentication

RxJS – Reactive state management

Databases
MySQL 8.0 – Product data

PostgreSQL 15 – Orders and order items

Messaging
RabbitMQ – Asynchronous event passing

Security
Keycloak 24.0 – OAuth2 / OpenID Connect provider

JWT – Token‑based authentication

Role‑based access control (Admin/User)

DevOps
Docker & Docker Compose – Full containerization

Multi‑stage builds – Optimized image sizes

Health checks – Ensures service readiness

📁 Repository Structure
text
shopease/
├── api-gateway/               # Spring Cloud Gateway
├── config-repo/               # Centralized YAML configs
├── config-server/              # Spring Cloud Config Server
├── eureka-server/              # Netflix Eureka
├── keycloak/                   # Realm export & setup scripts
├── mysql/                      # Init scripts for MySQL
├── order-service/              # Node.js + Express order service
├── postgres/                   # Init scripts for PostgreSQL
├── product-service/            # Spring Boot product service
├── shopease-frontend/          # Angular frontend application
├── docker-compose.yml          # Orchestrates all services
└── .gitignore                  # Git ignore rules
🧪 Testing the Application
1. Start all services
bash
docker-compose up --build
2. Access the frontend
http://localhost:4200

3. Login with provided credentials
Admin: admin / admin123

User: raslen / raslen2002

4. Explore
Browse products (public)

Add products to cart and place orders (authenticated)

View order history

Admin can create/delete products

📊 API Endpoints (via Gateway)
Method	Endpoint	Description	Access
GET	/api/products	List all products	Public
POST	/api/products	Create new product	Admin
DELETE	/api/products/{id}	Delete a product	Admin
POST	/api/orders	Place a new order	User
GET	/api/orders/my-orders	Get user’s orders	User
🏁 Conclusion
ShopEase is a fully functional microservices ecosystem that showcases:

✅ Two microservices in different languages (Java + Node.js)

✅ Two different databases (MySQL + PostgreSQL)

✅ Service discovery, API gateway, and centralized config

✅ JWT security with Keycloak

✅ Both synchronous (REST) and asynchronous (RabbitMQ) communication

✅ Complete Docker containerization

✅ Modern Angular frontend

All requirements for a modern cloud‑native application are met. The project is ready for deployment, further scaling, or as a reference architecture for microservices.

👨‍💻 Author
Raslen – GitHub Profile

⭐ If you find this project useful, please consider giving it a star!
