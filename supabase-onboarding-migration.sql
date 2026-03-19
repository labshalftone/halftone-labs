-- Onboarding fields for user_profiles
-- Run this in your Supabase SQL editor

ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS user_type TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS brand_name TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS acquisition_source TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS acquisition_source_other TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS store_name TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS store_slug TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS first_product_type TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS first_drop_name TEXT;
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS first_drop_timing TEXT;

-- Ensure unique constraint on user_id for upsert to work
-- (Only run if not already present)
-- ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);

COMMENT ON COLUMN user_profiles.user_type IS 'artist | label | festival | brand';
COMMENT ON COLUMN user_profiles.acquisition_source IS 'instagram | google | friend | community | other';
COMMENT ON COLUMN user_profiles.onboarding_step IS 'Last completed onboarding step (0-8)';
COMMENT ON COLUMN user_profiles.onboarding_completed_at IS 'Timestamp when onboarding was finished';
