### Building and running your application

When you're ready, start your application by running:
`docker compose up --build`.

### Deploying your application to the cloud

First, build your image, e.g.: `docker build -t myapp .`.
If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform, e.g.:
`docker build --platform=linux/amd64 -t myapp .`.

Then, push it to your registry, e.g. `docker push myregistry.com/myapp`.

Consult Docker's [getting started](https://docs.docker.com/go/get-started-sharing/)
docs for more detail on building and pushing.

Docker Desktop Link (https://www.docker.com/products/docker-desktop)
# HEY YOU, LOOK AT ME!
The above text is from docker.
From SousChef Wyatt — if you have questions or comments, let me know. 
I’m still new to Docker and happy to learn more. You can message me on Discord so ask away.  

**Please make sure to read the `.env.example` file**. As I mentioned, I kind of understand what we’re doing with this, but haven’t seen the full setup since there is no frontend or backend yet. I’ve set up a Docker environment for all three: frontend, backend, and the database.

## NOW, ACTUALLY PAY ATTENTION HERE

Downloading Docker is simple — links are provided above to help you get started.  

When you’re ready to start the environment, run:

in 'CMD'
docker compose up --build
# Docker Update Getting Started IMPORTANT
- have docker desktop installed on your machine
- clone the git repo
- copy the '.env.example' to '.env' and fill in the required values

# For Local Development 
run the app locally with hot reload

bash
 docker compose up --build

 this builds the enviroment.
 then Open 'http://localhost:5173' in a browser.
# Stopping the app 
bash 
 docker compose down
--- all command prompts should work the same with linux and windows machines


## Server Deployment 
These steps are for deploying to the shared server Teammates do not need to do this. its more of a reminder for me.
git clone repo
change directory to Sous-Chef
edit .example.env
docker compose -f compose.prod.yaml up -d --build

# Accessing the app
Open 'http://server IP'in your browser from any machine.

# Updating the server manually
bash 
git pull main
docker compose -f compose.prod.yaml up -d --build
