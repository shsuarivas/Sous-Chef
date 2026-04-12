-- ============================================================
-- Byte Your Fork - Database Schema
-- Based on Software Design Document v1.0
-- ============================================================

CREATE ROLE "SousChef" WITH LOGIN PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE postgres TO "SousChef";

-- ============================================================
-- USERS & AUTH
-- ============================================================

CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    first_name  TEXT NOT NULL,
    surname     TEXT NOT NULL,
    username    VARCHAR(15) NOT NULL UNIQUE,
    email       TEXT NOT NULL UNIQUE,       -- AES-256 encrypted at rest
    password_hash TEXT NOT NULL,            -- bcrypt hashed
    sign_up     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admins are users with elevated privileges (SDD Section 5.1)
CREATE TABLE admins (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
);

-- HMAC of email for lookup since email is encrypted at rest (SDD Section 6.1)
CREATE TABLE email_hashes (
    user_id    INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email_hmac TEXT NOT NULL UNIQUE
);

CREATE TABLE email_verification_codes (
    id         SERIAL PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code       TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used       BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE verified_users (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE password_reset_tokens (
    id         SERIAL PRIMARY KEY,
    user_id    INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token      TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    used       BOOLEAN NOT NULL DEFAULT FALSE
);

-- Dietary preferences, AES-256 encrypted (SDD Section 6.1)
CREATE TABLE user_preferences (
    user_id  INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    tag_name TEXT NOT NULL,
    UNIQUE (user_id, tag_name)
);

CREATE TABLE notification_settings (
    user_id    INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    cleared_at TIMESTAMPTZ
);

-- Stores avatar as binary; URL built dynamically (SDD Section 9.2)
CREATE TABLE user_profiles (
    user_id     INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    avatar_data BYTEA,
    avatar_mime TEXT,
    updated_at  TIMESTAMPTZ
);

-- ============================================================
-- RECIPES
-- SDD Section 5.1 - Recipe Entity
-- recipe_id -> creation_date (BCNF compliant, Section 5.3)
-- ============================================================

CREATE TABLE recipes (
    id            SERIAL PRIMARY KEY,
    name          TEXT NOT NULL,
    ttc           INT,                          -- Time To Cook in minutes
    creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- RECIPE TAGS (SDD Section 5.1 - Recipe Tags Entity)
-- ============================================================

CREATE TABLE recipe_tags (
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Junction: many recipes <-> many tags
CREATE TABLE recipe_recipe_tags (
    recipe_id INT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    tag_id    INT NOT NULL REFERENCES recipe_tags(id) ON DELETE CASCADE,
    PRIMARY KEY (recipe_id, tag_id)
);

-- ============================================================
-- INGREDIENTS & AMOUNTS (SDD Section 5.1)
-- ============================================================

CREATE TABLE ingredients (
    id   SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- Amount bridges Recipe and Ingredient, stores quantity per recipe
CREATE TABLE amounts (
    id            SERIAL PRIMARY KEY,
    recipe_id     INT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id INT NOT NULL REFERENCES ingredients(id) ON DELETE CASCADE,
    name          TEXT NOT NULL   -- e.g. "2 cups", "1 tbsp"
);

-- ============================================================
-- STEPS (SDD Section 5.1 - Steps Entity)
-- Separated from Recipe to avoid data overload (Miller's Law)
-- ============================================================

CREATE TABLE steps (
    id          SERIAL PRIMARY KEY,
    recipe_id   INT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    step_number INT NOT NULL,
    instructions TEXT NOT NULL,
    UNIQUE (recipe_id, step_number)
);

-- ============================================================
-- IMAGES (SDD Section 5.1 - Images Entity)
-- Stores URLs only, not binary data, for space optimization (Section 9.1)
-- ============================================================

CREATE TABLE images (
    id        SERIAL PRIMARY KEY,
    recipe_id INT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    url       TEXT NOT NULL
);

-- ============================================================
-- WEAK ENTITIES (SDD Section 5.1)
-- Comments, Views, Stars, Forks
-- ============================================================

-- Comments: max 255 characters (SDD Data Dictionary)
CREATE TABLE comments (
    id        SERIAL PRIMARY KEY,
    user_id   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    text      VARCHAR(255) NOT NULL,
    date      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Views: records when a user viewed a recipe
CREATE TABLE views (
    id        SERIAL PRIMARY KEY,
    user_id   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    date      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stars: user ratings, float between 1.0 and 5.0 (SDD Data Dictionary)
CREATE TABLE stars (
    user_id   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    rating    FLOAT NOT NULL CHECK (rating BETWEEN 1.0 AND 5.0),
    PRIMARY KEY (user_id, recipe_id)
);

-- Forks: user saves/favorites a recipe (SDD Section 5.1)
CREATE TABLE forks (
    user_id   INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id INT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    date      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, recipe_id)
);

-- ============================================================
-- INDEXES
-- GIN indexes for search performance (SDD Section 9.1)
-- ============================================================

CREATE INDEX idx_recipes_name     ON recipes USING GIN (to_tsvector('english', name));
CREATE INDEX idx_recipe_tags_name ON recipe_tags USING GIN (to_tsvector('english', name));
CREATE INDEX idx_ingredients_name ON ingredients USING GIN (to_tsvector('english', name));

-- ============================================================
-- GRANTS
-- ============================================================

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "SousChef";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "SousChef";
