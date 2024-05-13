const { createServer } = require("http");
let db = [
    {
        "title": "April Fool",
        "comedian": "Hilary",
        "year": "1994",
        "id": 1
    },
    {
        "title": "Humpty Dumpty",
        "comedian": "Johnny",
        "year": "2005",
        "id": 2
    },
    {
        "title": "Periodic Table",
        "comedian": "Beryllium",
        "year": "2010",
        "id": 3
    }
];
let body = [];
let bufferString;
let jsonBuffer;

function getBody(req) {
    req.on('data', chunk => {
        body.push(chunk)
    })
}

const server = createServer((req, res) => {
    if (req.url == '/' && req.method == 'GET') {
        res.end(JSON.stringify({ all_jokes: db }));
    }
    else if (req.url == '/' && req.method == 'POST') {
        getBody(req)
        req.on('end', () => {
            bufferString = Buffer.concat(body).toString();
            jsonBuffer = JSON.parse(bufferString);
            db.push(jsonBuffer);
            res.end(JSON.stringify({ jokes: db }));
        })
    }
    else if (req.method == 'PATCH') {
        const id = +req.url.split('/')[2];
        getBody(req, res);
        req.on('end', () => {
            bufferString = Buffer.concat(body).toString();
            console.log(bufferString)
            jsonBuffer = JSON.parse(bufferString);
            const match = db.find((joke) => joke.id == id);
            newdb = { ...match, ...jsonBuffer }
            db[id] = newdb;
            res.end(JSON.stringify(db[id]));
        })
    }
    else if (req.method == 'DELETE') {
        const id = +req.url.split('/')[2]
        const match = db.find((joke) => joke.id == id);
        let joke = db.indexOf(match)
        const deletedJoke = db.splice(joke,1)
        res.end(JSON.stringify(deletedJoke));
    }
    else {
        res.writeHead(404)
        res.end(JSON.stringify({ message: "Not Found" }))
    }
})

server.listen(3000, () => {
    console.log("server listening on port 3000")
});



