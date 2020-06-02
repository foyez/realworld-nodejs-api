# Realworld API

## OpenAPI (Swagger)

help link: https://blog.cloudboost.io/adding-swagger-to-existing-node-js-project-92a6624b855b

## Docker

```
> docker build -t container-name .
Example: docker build -t realworldcontainer .

> docker run -it container-name
> docker run -it -d container-name // run in background
> docker run -it -p 5000:5000 container-name // port porting

> docker ps // watch running container
> docker exec -it hash-id bash // go to a running container
> docker stop hash-id(or container-id)

> docker-compose build
> docker-compose run realworld-api
> docker-compose stop // shutdown db without delete all containers
> docker-compose down // shutdown db & delete all containers
> docker-compose up --build // run & build docker
> docker-compose up --build --remove-orphans

> docker-compose up // run docker
> docker-compose up -d
> docker-compose exec realworld-api bash
```
