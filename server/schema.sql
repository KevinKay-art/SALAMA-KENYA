-- =====================================================================
-- SALAMA / USALAMA KENYA - PostgreSQL + PostGIS Schema
-- Compatible with PostgreSQL 14+ and PostGIS extension
-- Compliant with Kenya Data Protection Act (2019)
-- =====================================================================

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Emergency Contacts (Configurable without code redeploy)
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    number VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL, -- e.g. 'hotline', 'child', 'police', 'medical', 'legal', 'shelter'
    description_en TEXT NOT NULL,
    description_sw TEXT NOT NULL,
    toll_free BOOLEAN DEFAULT true,
    available_24_7 BOOLEAN DEFAULT true,
    languages VARCHAR(255) DEFAULT 'English, Kiswahili',
    urgency_level VARCHAR(20) DEFAULT 'high', -- 'high', 'medium', 'general'
    display_order INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Resource Directory (Shelters, Hospitals with GVRC, Police Stations, Legal Aid Clinics)
CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'hospital', 'police', 'shelter', 'legal', 'counseling'
    county VARCHAR(100) NOT NULL,   -- e.g. 'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Kilifi'
    address TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    secondary_phone VARCHAR(50),
    opening_hours VARCHAR(100) DEFAULT '24/7',
    services_offered TEXT[] DEFAULT '{}',
    is_verified BOOLEAN DEFAULT true,
    is_safe_space BOOLEAN DEFAULT true,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    geom GEOMETRY(Point, 4326),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial index for fast proximity queries
CREATE INDEX IF NOT EXISTS idx_resources_geom ON resources USING GIST (geom);

-- 3. Users / Vetted Counselors & Admins
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'counselor', -- 'admin', 'counselor'
    organization VARCHAR(255) NOT NULL,
    county VARCHAR(100) DEFAULT 'National',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Incident Reports (Anonymous by default, encrypted fields)
CREATE TABLE IF NOT EXISTS incident_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_code VARCHAR(20) UNIQUE NOT NULL, -- Short anonymous reference code e.g. SAL-4921
    incident_type VARCHAR(100) NOT NULL,       -- 'physical_violence', 'sexual_violence', 'emotional_abuse', 'fgm', 'child_abuse', 'other'
    date_approx VARCHAR(100),
    county VARCHAR(100),
    immediate_danger BOOLEAN DEFAULT false,
    description_encrypted TEXT NOT NULL,       -- Stored encrypted
    contact_phone_encrypted VARCHAR(255),      -- Optional if survivor wants follow-up
    consent_given BOOLEAN NOT NULL DEFAULT true,
    status VARCHAR(50) DEFAULT 'new',          -- 'new', 'in_review', 'referral_made', 'closed'
    assigned_counselor_id UUID REFERENCES users(id) ON DELETE SET NULL,
    counselor_notes TEXT,
    support_requested TEXT[] DEFAULT '{}',     -- e.g. '{shelter, legal, medical, counseling}'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Support Chat Messages (End-to-End encrypted support thread)
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(100) NOT NULL, -- Anonymous survivor token
    sender_type VARCHAR(50) NOT NULL, -- 'survivor', 'counselor', 'system'
    sender_name VARCHAR(100) DEFAULT 'Survivor',
    message_encrypted TEXT NOT NULL,
    read_status BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Audit Trail for Compliance with Kenya Data Protection Act (2019)
CREATE TABLE IF NOT EXISTS access_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,        -- 'VIEW_REPORT', 'UPDATE_RESOURCE', 'EXPORT_ANALYTICS'
    target_id VARCHAR(100),
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
