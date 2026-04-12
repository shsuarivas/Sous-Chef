CREATE ROLE "SousChef" WITH LOGIN PASSWORD 'postgresql://SousChef:password@postgres:5432/appdb';
GRANT ALL PRIVILEGES ON DATABASE postgres TO "SousChef";

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE,
    password TEXT NOT NULL
);

GRANT ALL PRIVILEGES ON TABLE users TO "SousChef";