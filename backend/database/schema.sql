-- On-Demand Service Application Database Schema
-- MySQL 8+

CREATE DATABASE IF NOT EXISTS ondemand_services;
USE ondemand_services;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  role ENUM('customer', 'provider', 'admin') NOT NULL DEFAULT 'customer',
  isActive BOOLEAN NOT NULL DEFAULT TRUE,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS service_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  durationMinutes INT NOT NULL,
  isActive BOOLEAN DEFAULT TRUE,
  categoryId INT NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (categoryId) REFERENCES service_categories(id)
);

CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  providerId INT,
  serviceId INT NOT NULL,
  dateTime DATETIME NOT NULL,
  status ENUM('pending', 'accepted', 'rejected', 'in_progress', 'awaiting_payment', 'completed', 'cancelled') DEFAULT 'pending',
  notes TEXT,
  providerWorkDone BOOLEAN NOT NULL DEFAULT FALSE,
  customerWorkDone BOOLEAN NOT NULL DEFAULT FALSE,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
  paymentStatus ENUM('unpaid', 'paid') NOT NULL DEFAULT 'unpaid',
  paidAt DATETIME,
  mockTransactionId VARCHAR(255),
  declinedProviderIds JSON,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (providerId) REFERENCES users(id),
  FOREIGN KEY (serviceId) REFERENCES services(id)
);

CREATE TABLE IF NOT EXISTS provider_availabilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  providerId INT NOT NULL,
  dayOfWeek INT NOT NULL COMMENT '0=Sunday, 6=Saturday',
  startTime TIME NOT NULL,
  endTime TIME NOT NULL,
  createdAt DATETIME NOT NULL,
  updatedAt DATETIME NOT NULL,
  FOREIGN KEY (providerId) REFERENCES users(id)
);
