# Build Image BackEnd
`docker build --tag qlsc-be:v1.0.0 . `

# Build Image FrontEnd
`docker build --tag qlsc-fe:v1.0.0 . `

# Run docker compose
`docker-compose -f docker-compose.yml up --build -d`

# Remove docker compose 
`docker-compose -f docker-compose.yml down`

# Exec container Redis
`docker exec -it <container_name_or_id> redis-cli`

