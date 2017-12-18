const path = require('path');
// const DB = require('./db.json');
const jsonServer = require('json-server');
// 获取本机ip
const ip = require('ip').address();
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const port = 3005;

server.use(jsonServer.bodyParser);
server.use(middlewares);

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
server.use((req, res, next) => {
    console.log('---------req--------');
    console.log(req);
    if (req.method === 'POST') {
        req.body = {
            code: 0,
            msg: '',
            data: req.body.body,
        };
    }
    // Continue to JSON Server router
    next();
});

server.use(router);
server.listen(
    {
        host: ip,
        port,
    },
    function() {
        console.log(`JSON Server is running in http://${ip}:${port}`);
    },
);
