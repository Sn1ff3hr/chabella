-- SQL Schema for Marxia Application
-- Defines the structure for BusinessProfiles and Products tables for PostgreSQL.

-- Trigger function to update the 'updated_at' timestamp on row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- BusinessProfiles Table
-- Stores information about the business entities using the platform.
CREATE TABLE BusinessProfiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID, -- Placeholder for foreign key to a users table (e.g., from an auth service)
    business_name VARCHAR(255) NOT NULL,
    tax_id VARCHAR(100),
    registration_number VARCHAR(100),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    zip_code VARCHAR(20),
    phone_number VARCHAR(50),
    social_media_links JSONB, -- e.g., {'facebook': 'url', 'instagram': 'url'}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger for BusinessProfiles to update 'updated_at'
CREATE TRIGGER set_timestamp_businessprofiles
BEFORE UPDATE ON BusinessProfiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Products Table
-- Stores product information, linked to a BusinessProfile.
CREATE TABLE Products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_profile_id UUID NOT NULL REFERENCES BusinessProfiles(id) ON DELETE CASCADE,
    asset_id VARCHAR(50) UNIQUE NOT NULL, -- To be generated, e.g., 'MARXIA-0001'
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    quantity_available INTEGER NOT NULL DEFAULT 0,
    tax_name VARCHAR(100), -- e.g., "VAT", "Sales Tax"
    tax_rate DECIMAL(5, 2), -- e.g., 20.00 for 20%. Store as percentage value.
    photo_url VARCHAR(2048), -- URL to the product image
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on business_profile_id for faster lookups
CREATE INDEX idx_products_business_profile_id ON Products(business_profile_id);

-- Trigger for Products to update 'updated_at'
CREATE TRIGGER set_timestamp_products
BEFORE UPDATE ON Products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Note on asset_id generation for Products table:
-- A sequence and a separate trigger or application-level logic would be needed
-- to auto-generate human-readable, sequential asset_ids like 'MARXIA-0001'.
-- Example for sequence (not implemented as part of this initial schema file):
-- CREATE SEQUENCE product_asset_id_seq START 1;
--
-- Example for a trigger function (conceptual):
-- CREATE OR REPLACE FUNCTION generate_asset_id()
-- RETURNS TRIGGER AS $$
-- BEGIN
--    NEW.asset_id = 'MARXIA-' || LPAD(nextval('product_asset_id_seq')::TEXT, 4, '0');
--    RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;
--
-- CREATE TRIGGER before_insert_product_generate_asset_id
-- BEFORE INSERT ON Products
-- FOR EACH ROW
-- EXECUTE FUNCTION generate_asset_id();
