# Database Sharding Playground
Database Sharding using NodeJs and Postgres via Consistent Hashing

## This project spins up 3 Posgtres container, using following commands.
### This will use Dockerfile provided in this directory, which copies init.sql in docker-entrypoint and postgres will run it.

```
docker build -t pgshard .
```

#### Lets just spin up postgres container.

```
docker run --name pgshard1 -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d pgshard
docker run --name pgshard2 -e POSTGRES_PASSWORD=postgres -p 5433:5432 -d pgshard
docker run --name pgshard3 -e POSTGRES_PASSWORD=postgres -p 5434:5432 -d pgshard
```

#### That's it just run index.js and see the magic, for testing i use a little script in Chrome Developer tools
```
// Add 100's of URL
for (let l=0;l<100;l++) urls.push(`https://google.co.in?q=test${l}`);

// POST it to our express server
urls.forEach(u => fetch(`http://localhost:8081/?url=${u}`, {"method": "POST"})
.then(a => a.json()).then(console.log));
```