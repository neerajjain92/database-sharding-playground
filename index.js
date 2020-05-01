const app = require("express")();
const {Client} = require("pg");
const crypto = require("crypto");
const HashRing = require("hashring");
const hashRanks = new HashRing();

hashRanks.add("5432");
hashRanks.add("5433");
hashRanks.add("5433");


const clients = {
    "5432": new Client({
        "host": "localhost",
        "port": "5432",
        "user": "postgres",
        "password": "postgres",
        "database": "postgres"
    }),
    "5433": new Client({
        "host": "localhost",
        "port": "5433",
        "user": "postgres",
        "password": "postgres",
        "database": "postgres"
    }),
    "5434": new Client({
        "host": "localhost",
        "port": "5434",
        "user": "postgres",
        "password": "postgres",
        "database": "postgres"
    })
}


connect();
async function connect() {
 await clients["5432"].connect();
 await clients["5433"].connect();
 await clients["5434"].connect();
}

app.get("/:urlId", async (req, res) => {
    // https://localhost:8081/fhy2h
    const urlId = req.params.urlId;
    
    const server = hashRanks.getNode(urlId);
    const result = await clients[server].query("Select * from url_table where url_id = $1", [urlId]);
    if(result.rowCount > 0) {
        res.send({
            "urlId": urlId,
            "url": result.rows[0],
            "server": server
        });
    } else {
        res.sendStatus(404);
    }
});



app.post("/", async (req, res) => {
    const url = req.query.url;
    // www.wikipedia.com/sharding
    const hash = crypto.createHash("sha256").update(url).digest("base64");

    const urlId = hash.substr(0, 5);
    // Consistently Hash this to get a port!
    const server = hashRanks.get(urlId);

    // console.log("Server = ", server);
    // console.log("UrlId = ", urlId);

    await clients[server].query("insert into url_table (url, url_id) VALUES ($1, $2)", [url, urlId]);

    res.send({
        "urlId": urlId,
        "url": url,
        "server": server
    })
});

app.listen(8081, () => console.log("Listening to 8081"));