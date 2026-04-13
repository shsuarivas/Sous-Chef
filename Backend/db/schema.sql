


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(55) NOT NULL,
    surname VARCHAR(55) NOT NULL,
    username VARCHAR(55) UNIQUE NOT NULL,
    email VARCHAR(55) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    signup_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- can change this, I believe, but right now default timestamp
   role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')) -- backend still needs to manage this, can get rid of it entirely because it can cause security issues.
);
-------------------------------------------------------------------------------------------------------------


-------------------------------------------------------------------------------------------------------------
CREATE TABLE recipes (
    id SERIAL PRIMARY KEY,
    recipe_name VARCHAR(255) NOT NULL,
    recipe_description TEXT,
    servings INT NOT NULL,
    time_to_cook INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,     -- who created/imported the recipe tracks user id aka admin
    views INT DEFAULT 0, 
    ingredient_id INT  
);
-------------------------------------------------------------------------------------------------------------


-------------------------------------------------------------------------------------------------------------
-- each ingredient has its own id attached with a name
CREATE TABLE ingredients (
    id SERIAL PRIMARY KEY,
    ingredient_name TEXT NOT NULL
);
-------------------------------------------------------------------------------------------------------------


-------------------------------------------------------------------------------------------------------------
CREATE TABLE favorite (
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (user_id, recipe_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE -- when the user or recipe is deleted, all their data is deleted
);
-------------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------
-- all tags in database
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    tag_name TEXT NOT NULL
);
-------------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------
-- finds/displays all tags in one recipe junction table
CREATE TABLE recipe_tags (
    recipe_id INT,
    tag_id INT,

    PRIMARY KEY (recipe_id, tag_id),

    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
-------------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------
-- primary key is date and if user or recipe is dropped, so is all information.
CREATE TABLE comments (
    user_id INT NOT NULL,
    recipe_id INT NOT NULL,
    comment_date TIMESTAMP PRIMARY KEY DEFAULT CURRENT_TIMESTAMP,
    comment_text TEXT NOT NULL,


    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);
-------------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------
-- ratings for users to make 
CREATE TABLE ratings (
    user_id INT,
    recipe_id INT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    
    PRIMARY KEY (user_id, recipe_id),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);
-------------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------
-- measurement table such as cups tablespoons and teaspoons etc.
CREATE TABLE units (
    id SERIAL PRIMARY KEY,
    unit_name TEXT
);
-------------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------
-- the id of each ingredient is pulled from the specific recipe using the recipe id, the unit_id shows the measurements of said ingredient is needed, the quantity is the amount of said ingredients.(junction table)
CREATE TABLE recipe_ingredients(
    recipe_id INT,
    ingredient_id INT,
    quantity FLOAT,
    unit_id INT, 

    PRIMARY KEY (recipe_id, ingredient_id),

    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE,
    FOREIGN KEY (unit_id) REFERENCES units(id)

);
-------------------------------------------------------------------------------------------------------------



-------------------------------------------------------------------------------------------------------------
CREATE TABLE images (
    id SERIAL PRIMARY KEY,
    image_url TEXT,
    recipe_id INT,

    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);
-------------------------------------------------------------------------------------------------------------

-------------------------------------------------------------------------------------------------------------
CREATE TABLE steps (
    id SERIAL PRIMARY KEY,
    recipe_id INT NOT NULL,
    step_number INT NOT NULL,
    instruction TEXT NOT NULL,

    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);
-------------------------------------------------------------------------------------------------------------
-------------------------------------------------------------------------------------------------------------
-- added nutrition table
CREATE TABLE nutrition (
    id SERIAL PRIMARY KEY,
    recipe_id INT UNIQUE NOT NULL,
    calories VARCHAR(50),
    fat_content VARCHAR(50),
    protein_content VARCHAR(50),
    carbohydrate_content VARCHAR(50),

    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);
