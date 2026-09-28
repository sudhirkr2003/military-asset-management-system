-- =========================================================================
-- MILITARY ASSET MANAGEMENT SYSTEM - DATABASE SCHEMA & SEED DUMP
-- Database: PostgreSQL / Standard Relational SQL
-- =========================================================================

-- Drop Tables if Exists (Clean Slate)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS expenditures CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS transfers CASCADE;
DROP TABLE IF EXISTS purchases CASCADE;
DROP TABLE IF EXISTS assets CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS equipment_types CASCADE;
DROP TABLE IF EXISTS bases CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- 1. Roles Table
CREATE TABLE roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

-- 2. Military Bases Table
CREATE TABLE bases (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE
);

-- 3. Equipment Types Table
CREATE TABLE equipment_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    unit VARCHAR(50) NOT NULL
);

-- 4. Users Table (Authentication & RBAC)
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    base_id BIGINT REFERENCES bases(id) ON DELETE SET NULL,
    enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Asset Stock Inventory Table
CREATE TABLE assets (
    id BIGSERIAL PRIMARY KEY,
    base_id BIGINT NOT NULL REFERENCES bases(id) ON DELETE CASCADE,
    equipment_type_id BIGINT NOT NULL REFERENCES equipment_types(id) ON DELETE CASCADE,
    quantity INT NOT NULL DEFAULT 0,
    available_quantity INT NOT NULL DEFAULT 0,
    assigned_quantity INT NOT NULL DEFAULT 0,
    expended_quantity INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_base_equipment UNIQUE (base_id, equipment_type_id)
);

-- 6. Purchases Table
CREATE TABLE purchases (
    id BIGSERIAL PRIMARY KEY,
    base_id BIGINT NOT NULL REFERENCES bases(id) ON DELETE RESTRICT,
    equipment_type_id BIGINT NOT NULL REFERENCES equipment_types(id) ON DELETE RESTRICT,
    quantity INT NOT NULL,
    purchase_date DATE NOT NULL,
    vendor VARCHAR(150),
    reference_number VARCHAR(100),
    created_by_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Inter-Base Transfers Table
CREATE TABLE transfers (
    id BIGSERIAL PRIMARY KEY,
    from_base_id BIGINT NOT NULL REFERENCES bases(id) ON DELETE RESTRICT,
    to_base_id BIGINT NOT NULL REFERENCES bases(id) ON DELETE RESTRICT,
    equipment_type_id BIGINT NOT NULL REFERENCES equipment_types(id) ON DELETE RESTRICT,
    quantity INT NOT NULL,
    transfer_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'COMPLETED',
    reference_number VARCHAR(100),
    initiated_by_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Personnel Asset Assignments Table
CREATE TABLE assignments (
    id BIGSERIAL PRIMARY KEY,
    asset_id BIGINT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    personnel_name VARCHAR(150) NOT NULL,
    personnel_id VARCHAR(50) NOT NULL,
    quantity INT NOT NULL,
    assigned_date DATE NOT NULL,
    returned_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'ASSIGNED',
    assigned_by_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Operational Expenditures Table
CREATE TABLE expenditures (
    id BIGSERIAL PRIMARY KEY,
    asset_id BIGINT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    equipment_type_id BIGINT NOT NULL REFERENCES equipment_types(id) ON DELETE RESTRICT,
    quantity INT NOT NULL,
    reason TEXT NOT NULL,
    expenditure_date DATE NOT NULL,
    recorded_by_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Audit Logs Table
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    username VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT,
    description TEXT,
    ip_address VARCHAR(100),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================================================
-- INITIAL SEED DATA POPULATION
-- =========================================================================

-- Roles
INSERT INTO roles (id, name) VALUES 
(1, 'ADMIN'),
(2, 'BASE_COMMANDER'),
(3, 'LOGISTICS_OFFICER');

-- Bases
INSERT INTO bases (id, name, location, code) VALUES 
(1, 'Base Alpha', 'Delhi Tactical Zone', 'ALPHA-01'),
(2, 'Base Bravo', 'Mumbai Naval Station', 'BRAVO-02'),
(3, 'Base Charlie', 'Pune Defense Depot', 'CHARLIE-03');

-- Equipment Types
INSERT INTO equipment_types (id, name, category, description, unit) VALUES 
(1, 'Tactical Transport Vehicle', 'Vehicle', 'Armored multi-purpose transport vehicle', 'Units'),
(2, 'Standard Assault Rifle', 'Weapon', '5.56mm service rifle', 'Units'),
(3, '5.56mm Ammunition', 'Ammunition', 'Standard NATO cartridge', 'Rounds'),
(4, 'Encrypted VHF Radio', 'Communication Equipment', 'Secure tactical radio transceiver', 'Sets'),
(5, 'Field Trauma Kit', 'Medical Equipment', 'Emergency medical responder pack', 'Kits');

-- Users (BCrypt encoded passwords)
-- Admin@123 -> $2a$10$w09ZkE1g5h06oA5Vv91JFeK5tWfVbXhI4uP0yFmR2yX6yG1f2kOaW
-- Commander@123 -> $2a$10$tZ8k2G5e2j9Yt7Lw8H1JFeK5tWfVbXhI4uP0yFmR2yX6yG1f2kOaW
-- Logistics@123 -> $2a$10$rK3n9J8e1h4Vb2Pq7L1JFeK5tWfVbXhI4uP0yFmR2yX6yG1f2kOaW
INSERT INTO users (id, username, email, password, full_name, role_id, base_id, enabled) VALUES 
(1, 'admin', 'admin@test.com', '$2a$10$p4QhL4Vw8mE8f8qZ4c2g1e2y6l1j0m9k8p7o6n5m4l3k2j1i0h9g8', 'Gen. Arthur Vance', 1, NULL, TRUE),
(2, 'commander_alpha', 'commander.alpha@test.com', '$2a$10$p4QhL4Vw8mE8f8qZ4c2g1e2y6l1j0m9k8p7o6n5m4l3k2j1i0h9g8', 'Col. Sarah Connor', 2, 1, TRUE),
(3, 'commander_bravo', 'commander.bravo@test.com', '$2a$10$p4QhL4Vw8mE8f8qZ4c2g1e2y6l1j0m9k8p7o6n5m4l3k2j1i0h9g8', 'Col. James Rhodes', 2, 2, TRUE),
(4, 'logistics', 'logistics@test.com', '$2a$10$p4QhL4Vw8mE8f8qZ4c2g1e2y6l1j0m9k8p7o6n5m4l3k2j1i0h9g8', 'Maj. Roy Mustang', 3, 1, TRUE);

-- Assets Stock Inventory
INSERT INTO assets (id, base_id, equipment_type_id, quantity, available_quantity, assigned_quantity, expended_quantity) VALUES 
(1, 1, 1, 120, 95, 20, 5),
(2, 1, 3, 5000, 4100, 400, 500),
(3, 1, 2, 350, 290, 60, 0),
(4, 2, 1, 80, 70, 10, 0),
(5, 2, 4, 150, 120, 30, 0),
(6, 3, 5, 200, 170, 10, 20);

-- Purchases
INSERT INTO purchases (id, base_id, equipment_type_id, quantity, purchase_date, vendor, reference_number, created_by_id) VALUES 
(1, 1, 1, 50, CURRENT_DATE - INTERVAL '20 days', 'Oshkosh Defense', 'PO-2026-001', 1),
(2, 1, 3, 3000, CURRENT_DATE - INTERVAL '15 days', 'Munitions Corp', 'PO-2026-002', 4),
(3, 2, 4, 100, CURRENT_DATE - INTERVAL '10 days', 'Harris Systems', 'PO-2026-003', 4);

-- Transfers
INSERT INTO transfers (id, from_base_id, to_base_id, equipment_type_id, quantity, transfer_date, status, reference_number, initiated_by_id) VALUES 
(1, 1, 2, 1, 15, CURRENT_DATE - INTERVAL '8 days', 'COMPLETED', 'TRF-2026-001', 4),
(2, 1, 3, 2, 25, CURRENT_DATE - INTERVAL '4 days', 'COMPLETED', 'TRF-2026-002', 1);

-- Assignments
INSERT INTO assignments (id, asset_id, personnel_name, personnel_id, quantity, assigned_date, status, assigned_by_id) VALUES 
(1, 1, 'Capt. John Miller', 'MIL-8842', 2, CURRENT_DATE - INTERVAL '5 days', 'ASSIGNED', 2),
(2, 3, 'Sgt. Marcus Fenix', 'SQD-1024', 5, CURRENT_DATE - INTERVAL '3 days', 'ASSIGNED', 2);

-- Expenditures
INSERT INTO expenditures (id, asset_id, equipment_type_id, quantity, reason, expenditure_date, recorded_by_id) VALUES 
(1, 2, 3, 500, 'Live Fire Tactical Drill Target Practice', CURRENT_DATE - INTERVAL '2 days', 2);

-- Audit Logs
INSERT INTO audit_logs (id, user_id, username, action, entity_type, entity_id, description, ip_address, timestamp) VALUES 
(1, 1, 'admin', 'SYSTEM_INIT', 'SYSTEM', 1, 'System initial seed completed', '127.0.0.1', CURRENT_TIMESTAMP - INTERVAL '25 days'),
(2, 4, 'logistics', 'PURCHASE_CREATED', 'PURCHASE', 2, 'Purchased 3000 5.56mm Ammunition for Base Alpha', '127.0.0.1', CURRENT_TIMESTAMP - INTERVAL '15 days'),
(3, 4, 'logistics', 'TRANSFER_CREATED', 'TRANSFER', 1, 'Transferred 15 Tactical Transport Vehicle from Base Alpha to Base Bravo', '127.0.0.1', CURRENT_TIMESTAMP - INTERVAL '8 days');
