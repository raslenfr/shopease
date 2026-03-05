CREATE DATABASE IF NOT EXISTS shopease_products;
CREATE DATABASE IF NOT EXISTS shopease_orders;

CREATE USER IF NOT EXISTS 'shopease'@'%' IDENTIFIED BY 'shopease123';
GRANT ALL PRIVILEGES ON shopease_products.* TO 'shopease'@'%';
GRANT ALL PRIVILEGES ON shopease_orders.* TO 'shopease'@'%';
FLUSH PRIVILEGES;
