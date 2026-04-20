@echo off
docker exec -i sous-chef-postgres-1 psql -U SousChef -d appdb < Backend\db\DeleteTables.sql

docker exec -i sous-chef-postgres-1 psql -U SousChef -d appdb < Backend\db\schema.sql

docker exec -i sous-chef-backend-1 node src/RecipeAutomation.js

docker exec -i sous-chef-backend-1 node src/ScrapeImages.js

docker compose cp Backend/db/user_seed.sql postgres:/user_seed.sql

docker compose exec postgres psql -U SousChef -d appdb -f /user_seed.sql

pause