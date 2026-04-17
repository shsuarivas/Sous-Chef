@echo off
docker exec -i sous-chef-postgres-1 psql -U SousChef -d appdb < Backend\db\DeleteTables.sql

docker exec -i sous-chef-postgres-1 psql -U SousChef -d appdb < Backend\db\schema.sql

docker exec -i sous-chef-backend-1 node src/RecipeAutomation.js

pause