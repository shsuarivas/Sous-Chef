CREATE ROLE "SousChef" WITH LOGIN PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE appdb TO "SousChef";

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(55) NOT NULL,
    surname VARCHAR(55) NOT NULL,
    username VARCHAR(55) UNIQUE NOT NULL,
    email VARCHAR(55) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'))
);

CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    recipe_name VARCHAR(255) NOT NULL,
    recipe_description TEXT,
    servings INT NOT NULL,
    time_to_cook INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    views INT DEFAULT 0,
    ingredient_id INT
);

CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    ingredient_name TEXT NOT NULL
);

CREATE TABLE favorite (
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    tag_name TEXT NOT NULL
);

CREATE TABLE recipe_tags (
    recipe_id INT,
    tag_id INT,
    PRIMARY KEY (recipe_id, tag_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    comment_date TIMESTAMP PRIMARY KEY DEFAULT CURRENT_TIMESTAMP,
    comment_text TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE ratings (
    user_id INT,
    recipe_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    unit_name TEXT
);

CREATE TABLE recipe_ingredients (
    recipe_id INT,
    ingredient_id INT,
    quantity FLOAT,
    unit_id INT,
    PRIMARY KEY (recipe_id, ingredient_id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES units(id)
);

CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    image_url TEXT,
    recipe_id INT,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE steps (
    id SERIAL PRIMARY KEY,
    recipe_id INT NOT NULL,
    step_number INT NOT NULL,
    instruction TEXT NOT NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

CREATE TABLE password_reset_tokens (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE mfa_codes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "SousChef";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "SousChef";
