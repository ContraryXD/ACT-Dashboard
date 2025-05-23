-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2025 at 03:14 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

--
-- Database: `act`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `username` TEXT NOT NULL UNIQUE,
  `password_hash` TEXT NOT NULL,
  `role` TEXT NOT NULL DEFAULT 'basic' CHECK(`role` IN ('admin', 'advanced', 'basic')),
  `email` TEXT DEFAULT NULL UNIQUE,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password_hash`, `role`, `email`) VALUES
(1, 'admin_user', 'hashed_password_admin', 'admin', 'admin@example.com'),
(2, 'advanced_user', 'hashed_password_advanced', 'advanced', 'advanced@example.com'),
(3, 'basic_user', 'hashed_password_basic', 'basic', 'basic@example.com');

-- --------------------------------------------------------

--
-- Table structure for table `newsletter`
--

DROP TABLE IF EXISTS `newsletter`;
CREATE TABLE `newsletter` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `title` TEXT NOT NULL,
  `content` TEXT NOT NULL,
  `image_path` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

--
-- Dumping data for table `newsletter`
--

INSERT INTO `newsletter` (`id`, `title`, `content`, `image_path`, `created_at`, `updated_at`) VALUES
(1, 'Welcome to Our Newsletter!', '<p>This is the first edition of our newsletter. Stay tuned for more updates!</p><img src="/assets/img/placeholder.jpg" alt="Newsletter Image">', '/assets/img/placeholder.jpg', STRFTIME('%Y-%m-%d %H:%M:%S', 'now'), STRFTIME('%Y-%m-%d %H:%M:%S', 'now'));

-- --------------------------------------------------------

--
-- Table structure for table `recruitments`
--
DROP TABLE IF EXISTS `recruitments`;
CREATE TABLE `recruitments` (
  `id` INTEGER PRIMARY KEY AUTOINCREMENT,
  `title` TEXT NOT NULL,
  `image_path` TEXT DEFAULT NULL,
  `job_description` TEXT DEFAULT NULL,
  `candidate_requirements` TEXT DEFAULT NULL,
  `benefits` TEXT DEFAULT NULL,
  `work_location` TEXT DEFAULT NULL,
  `work_time` TEXT DEFAULT NULL,
  `application_method` TEXT DEFAULT NULL,
  `contact_info` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMIT;
PRAGMA foreign_keys=ON;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
