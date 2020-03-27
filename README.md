# Realworld API

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
> docker-compose down // shutdown running docker-compose
> docker-compose up --build // run & build docker
> docker-compose up // run docker
> docker-compose up -d
> docker-compose exec realworld-api bash
```
