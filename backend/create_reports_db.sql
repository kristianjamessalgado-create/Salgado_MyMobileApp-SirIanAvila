-- Create database and reports table
CREATE DATABASE IF NOT EXISTS reports CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE reports;

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_reports_username (username),
  INDEX idx_reports_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional seed data
INSERT INTO reports (username, title, description)
VALUES
  ('alice', 'Weekly Update', 'Completed tasks and blockers.'),
  ('alice', 'Incident Report', 'Minor outage resolved.'),
  ('bob', 'Onboarding Progress', 'Finished module 1 and 2.');
