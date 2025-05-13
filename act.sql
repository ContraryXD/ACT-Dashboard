-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2025 at 03:14 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `act`
--

-- --------------------------------------------------------

--
-- Table structure for table `carousel_images`
--

CREATE TABLE `carousel_images` (
  `id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `link` varchar(255) DEFAULT NULL,
  `icon` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact`
--

INSERT INTO `contact` (`id`, `name`, `link`, `icon`) VALUES
(1, 'info@vienthongact.vn', 'mailto:info@vienthongact.vn', 'faEnvelope'),
(2, '(028) 62924609', 'tel:02862924609', 'faPhone'),
(3, 'Số 2R-2R1 Bình Giã, Phường 13, Quận Tân Bình, Tp.HCM', 'https://www.google.com/maps?q=Số+2R-2R1+Bình+Giã,+Phường+13,+Quận+Tân+Bình,+Tp.HCM', 'faMapMarkerAlt');

-- --------------------------------------------------------

--
-- Table structure for table `interested`
--

CREATE TABLE `interested` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `href` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `navigation`
--

CREATE TABLE `navigation` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `href` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `navigation`
--

INSERT INTO `navigation` (`id`, `name`, `href`) VALUES
(1, 'Trang chủ', '/'),
(2, 'Giới thiệu', '/about'),
(3, 'Dịch vụ', '/services'),
(4, 'Dự án', ''),
(5, 'Bản tin', ''),
(6, 'Tuyển dụng', ''),
(7, 'Liên hệ', '');

-- --------------------------------------------------------

--
-- Table structure for table `partners`
--

CREATE TABLE `partners` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `image_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `partners`
--

INSERT INTO `partners` (`id`, `name`, `image_path`) VALUES
(1, 'FPT', '/assets/img/FptLogo.jpg'),
(2, 'Viettel', '/assets/img/VtLogo.jpg'),
(3, 'Điện Phúc Thành', '/assets/img/DienPhucThanhLogo.jpg'),
(4, 'Hưng Lộc Phát', '/assets/img/HungLocPhatLogo.jpg'),
(5, 'Mobifone', '/assets/img/MobifoneLogo.jpg'),
(6, 'Picity High Park', '/assets/img/PicityHighParkLogo.jpg'),
(7, 'Nam Long', '/assets/img/NamLongLogo.jpg'),
(8, 'Charm City', '/assets/img/CharmCityLogo.jpg'),
(9, 'Xuân Mai Corp', '/assets/img/XuanMaiCorpLogo.jpg'),
(10, 'CMC Telecom', '/assets/img/CMCTelecomLogo.jpg'),
(11, 'FPT', '/assets/img/FptLogo.jpg'),
(12, 'Viettel', '/assets/img/VtLogo.jpg'),
(13, 'Điện Phúc Thành', '/assets/img/DienPhucThanhLogo.jpg'),
(14, 'Hưng Lộc Phát', '/assets/img/HungLocPhatLogo.jpg'),
(15, 'Mobifone', '/assets/img/MobifoneLogo.jpg'),
(16, 'Picity High Park', '/assets/img/PicityHighParkLogo.jpg'),
(17, 'Nam Long', '/assets/img/NamLongLogo.jpg'),
(18, 'Charm City', '/assets/img/CharmCityLogo.jpg'),
(19, 'Xuân Mai Corp', '/assets/img/XuanMaiCorpLogo.jpg'),
(20, 'CMC Telecom', '/assets/img/CMCTelecomLogo.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `icon_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `services`
--

INSERT INTO `services` (`id`, `title`, `content`, `icon_path`) VALUES
(1, 'Cung cấp sản phẩm, giải pháp CNTT', 'Cung cấp sản phẩm & giải pháp CNTT. Giải pháp nhà thông minh rạng đông. Kiến tạo cuộc sống, hoà hợp với thiên nhiên, thông minh hạnh phúc …', '/assets/img/iconCNTT.png'),
(2, 'Cung cấp truyền hình số', 'Cung cấp dịch vụ viễn thông cho các khách hàng trong dự án và cho các doanh nghiệp Việt Nam.', '/assets/img/iconTHS.png'),
(3, 'Đầu tư hạ tầng viễn thông', 'Chia sẻ, sử dụng chung hạ tầng kỹ thuật viễn thông xu thế tất yếu, mang lại nhiều lợi ích cho doanh nghiệp và xã hội. Việc này không chỉ góp phần bảo đảm mỹ quan đô thị mà còn giúp tiết kiệm chi phí đầu tư cho các doanh nghiệp viễn thông.', '/assets/img/iconTelecommunication.png'),
(4, 'Hạ tầng viễn thông cáp quang', 'Công ty Cổ phần Viễn thông ACT đang là đối tác hợp tác đầu tư, cung cấp dịch vụ của các đơn vị như: Tập đoàn Công nghiệp Viễn thông Quân đội Viettel,…', '/assets/img/iconOpticalFiberT.png'),
(5, 'Quản lý, vận hành khai thác hạ tầng viễn thông', 'Trực tiếp Vận hành, khai thác các hệ thống CNTT đảm bảo hệ thống hoạt động ổn định phục vụ sự phát triển CNTT & Viễn thông.', '/assets/img/iconStationManagement.png'),
(6, 'Thi công công trình viễn thông', 'Khảo sát, thi công kéo ngầm mạng cáp đồng và cáp quang theo yêu cầu khách hàng. Bảo trì, bảo dưỡng hạ tầng viễn thông (các tuyến cáp, hầm cống, tủ cáp,…)', '/assets/img/iconTelecommunicationProjects.png'),
(7, 'Cung cấp sản phẩm, giải pháp CNTT', 'Cung cấp sản phẩm & giải pháp CNTT. Giải pháp nhà thông minh rạng đông. Kiến tạo cuộc sống, hoà hợp với thiên nhiên, thông minh hạnh phúc …', '/assets/img/iconCNTT.png'),
(8, 'Cung cấp truyền hình số', 'Cung cấp dịch vụ viễn thông cho các khách hàng trong dự án và cho các doanh nghiệp Việt Nam.', '/assets/img/iconTHS.png'),
(9, 'Đầu tư hạ tầng viễn thông', 'Chia sẻ, sử dụng chung hạ tầng kỹ thuật viễn thông xu thế tất yếu, mang lại nhiều lợi ích cho doanh nghiệp và xã hội. Việc này không chỉ góp phần bảo đảm mỹ quan đô thị mà còn giúp tiết kiệm chi phí đầu tư cho các doanh nghiệp viễn thông.', '/assets/img/iconTelecommunication.png'),
(10, 'Hạ tầng viễn thông cáp quang', 'Công ty Cổ phần Viễn thông ACT đang là đối tác hợp tác đầu tư, cung cấp dịch vụ của các đơn vị như: Tập đoàn Công nghiệp Viễn thông Quân đội Viettel,…', '/assets/img/iconOpticalFiberT.png'),
(11, 'Quản lý, vận hành khai thác hạ tầng viễn thông', 'Trực tiếp Vận hành, khai thác các hệ thống CNTT đảm bảo hệ thống hoạt động ổn định phục vụ sự phát triển CNTT & Viễn thông.', '/assets/img/iconStationManagement.png'),
(12, 'Thi công công trình viễn thông', 'Khảo sát, thi công kéo ngầm mạng cáp đồng và cáp quang theo yêu cầu khách hàng. Bảo trì, bảo dưỡng hạ tầng viễn thông (các tuyến cáp, hầm cống, tủ cáp,…)', '/assets/img/iconTelecommunicationProjects.png'),
(13, 'Cung cấp sản phẩm, giải pháp CNTT', 'Cung cấp sản phẩm & giải pháp CNTT. Giải pháp nhà thông minh rạng đông. Kiến tạo cuộc sống, hoà hợp với thiên nhiên, thông minh hạnh phúc …', '/assets/img/iconCNTT.png'),
(14, 'Cung cấp truyền hình số', 'Cung cấp dịch vụ viễn thông cho các khách hàng trong dự án và cho các doanh nghiệp Việt Nam.', '/assets/img/iconTHS.png'),
(15, 'Đầu tư hạ tầng viễn thông', 'Chia sẻ, sử dụng chung hạ tầng kỹ thuật viễn thông xu thế tất yếu, mang lại nhiều lợi ích cho doanh nghiệp và xã hội. Việc này không chỉ góp phần bảo đảm mỹ quan đô thị mà còn giúp tiết kiệm chi phí đầu tư cho các doanh nghiệp viễn thông.', '/assets/img/iconTelecommunication.png'),
(16, 'Hạ tầng viễn thông cáp quang', 'Công ty Cổ phần Viễn thông ACT đang là đối tác hợp tác đầu tư, cung cấp dịch vụ của các đơn vị như: Tập đoàn Công nghiệp Viễn thông Quân đội Viettel,…', '/assets/img/iconOpticalFiberT.png'),
(17, 'Quản lý, vận hành khai thác hạ tầng viễn thông', 'Trực tiếp Vận hành, khai thác các hệ thống CNTT đảm bảo hệ thống hoạt động ổn định phục vụ sự phát triển CNTT & Viễn thông.', '/assets/img/iconStationManagement.png'),
(18, 'Thi công công trình viễn thông', 'Khảo sát, thi công kéo ngầm mạng cáp đồng và cáp quang theo yêu cầu khách hàng. Bảo trì, bảo dưỡng hạ tầng viễn thông (các tuyến cáp, hầm cống, tủ cáp,…)', '/assets/img/iconTelecommunicationProjects.png');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','advanced','basic') NOT NULL DEFAULT 'basic',
  `email` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

CREATE TABLE `newsletter` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `newsletter`
--

INSERT INTO `newsletter` (`id`, `title`, `content`, `created_at`, `updated_at`) VALUES
(1, 'Welcome to Our Newsletter!', '<p>This is the first edition of our newsletter. Stay tuned for more updates!</p><img src="/assets/img/placeholder.jpg" alt="Newsletter Image">', NOW(), NOW());

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carousel_images`
--
ALTER TABLE `carousel_images`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `interested`
--
ALTER TABLE `interested`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `navigation`
--
ALTER TABLE `navigation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `partners`
--
ALTER TABLE `partners`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `newsletter`
--
ALTER TABLE `newsletter`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carousel_images`
--
ALTER TABLE `carousel_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `interested`
--
ALTER TABLE `interested`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `navigation`
--
ALTER TABLE `navigation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `partners`
--
ALTER TABLE `partners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `newsletter`
--
ALTER TABLE `newsletter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
