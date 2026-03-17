-- ─────────────────────────────────────────────────────────────────────────────
-- Halftone Labs — Supabase Schema
-- Run this entire file in Supabase → SQL Editor → New Query → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref                  TEXT NOT NULL UNIQUE,
  razorpay_order_id    TEXT,
  razorpay_payment_id  TEXT,
  product_name         TEXT,
  color                TEXT,
  size                 TEXT,
  print_tier           TEXT,
  print_dimensions     TEXT,
  blank_price          INTEGER DEFAULT 0,
  print_price          INTEGER DEFAULT 0,
  shipping             INTEGER DEFAULT 0,
  total                INTEGER NOT NULL DEFAULT 0,
  customer_name        TEXT,
  customer_email       TEXT,
  customer_phone       TEXT,
  address              TEXT,
  city                 TEXT,
  pin                  TEXT,
  country              TEXT DEFAULT 'IN',
  status               TEXT DEFAULT 'Order Placed',
  coupon_code          TEXT,
  discount_amount      INTEGER DEFAULT 0,
  user_id              UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS orders_ref_idx           ON orders(ref);
CREATE INDEX IF NOT EXISTS orders_email_idx         ON orders(customer_email);
CREATE INDEX IF NOT EXISTS orders_user_idx          ON orders(user_id);
CREATE INDEX IF NOT EXISTS orders_created_idx       ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS milestones_order_idx     ON milestones(order_id);

-- Designs table (saved product configurations)
CREATE TABLE IF NOT EXISTS designs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_email  TEXT,
  name            TEXT,                      -- user-given name e.g. "Summer Drop V1"
  product_id      TEXT,                      -- e.g. "regular-tee"
  product_name    TEXT,
  gsm             TEXT,
  color_name      TEXT,
  color_hex       TEXT,
  size            TEXT,
  print_tier      TEXT,
  print_dims      TEXT,
  blank_price     INTEGER DEFAULT 0,
  print_price     INTEGER DEFAULT 0,
  has_design      BOOLEAN DEFAULT FALSE,
  thumbnail       TEXT,                      -- compressed base64 JPEG preview (~10-30KB)
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS designs_user_idx  ON designs(user_id);
CREATE INDEX IF NOT EXISTS designs_email_idx ON designs(customer_email);
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own designs" ON designs
  FOR SELECT USING (auth.uid() = user_id);

-- Branding table (DTF neck labels per user)
CREATE TABLE IF NOT EXISTS branding (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  customer_email TEXT UNIQUE,
  dark_label     TEXT,       -- base64 PNG (for light garments)
  light_label    TEXT,       -- base64 PNG (for dark garments)
  updated_at     TIMESTAMPTZ DEFAULT NOW(),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS branding_user_idx  ON branding(user_id);
CREATE INDEX IF NOT EXISTS branding_email_idx ON branding(customer_email);
ALTER TABLE branding ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own branding" ON branding
  FOR SELECT USING (auth.uid() = user_id);

-- User profiles (default shipping address, etc.)
CREATE TABLE IF NOT EXISTS user_profiles (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  customer_email TEXT UNIQUE,
  name           TEXT,
  phone          TEXT,
  address_line1  TEXT,
  address_line2  TEXT,
  city           TEXT,
  state          TEXT,
  pin            TEXT,
  country        TEXT DEFAULT 'IN',
  updated_at     TIMESTAMPTZ DEFAULT NOW(),
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_profiles_user_idx  ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS user_profiles_email_idx ON user_profiles(customer_email);
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code           TEXT NOT NULL UNIQUE,       -- e.g. "LAUNCH20"
  description    TEXT,                       -- e.g. "20% off for launch"
  discount_type  TEXT NOT NULL DEFAULT 'percent',  -- 'percent' or 'fixed'
  discount_value INTEGER NOT NULL DEFAULT 0, -- e.g. 20 for 20%, or 200 for ₹200 off
  min_order      INTEGER DEFAULT 0,          -- minimum cart total to apply
  max_uses       INTEGER,                    -- NULL = unlimited
  uses_count     INTEGER NOT NULL DEFAULT 0,
  active         BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at     TIMESTAMPTZ,               -- NULL = no expiry
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS coupons_code_idx ON coupons(code);

-- Function to safely increment coupon uses
CREATE OR REPLACE FUNCTION increment_coupon_uses(p_code TEXT)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  UPDATE coupons SET uses_count = uses_count + 1 WHERE code = p_code;
END;
$$;

-- ─── Row Level Security ───────────────────────────────────────────────────────
-- Enable RLS (service role key bypasses this, so admin routes still work)
ALTER TABLE orders     ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- Users can read their own orders (by user_id OR by email match)
CREATE POLICY "Users read own orders" ON orders
  FOR SELECT USING (
    auth.uid() = user_id
  );

-- Allow service role full access (used by all API routes — already bypasses RLS)
-- No explicit policy needed; service role key skips RLS automatically.

-- Public tracking: allow read by ref (no auth required for the track page)
-- We handle this server-side using service role, so no public policy needed.

-- ─── Sample coupon (uncomment to insert) ─────────────────────────────────────
-- INSERT INTO coupons (code, description, discount_type, discount_value, min_order, max_uses, active)
-- VALUES ('LAUNCH20', '20% off for our launch', 'percent', 20, 500, 100, true);
