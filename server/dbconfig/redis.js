'use strict';
const Redis = require('ioredis');
const testRedis = [
    {
        host: '10.50.16.20',
        port: 7010,
    },
    {
        host: '10.50.16.20',
        port: 7011,
    },
    {
        host: '10.50.16.20',
        port: 7012,
    },
    {
        host: '10.50.16.20',
        port: 7013,
    },
    {
        host: '10.50.16.20',
        port: 7014,
    },
    {
        host: '10.50.16.20',
        port: 7015,
    },
];
const productionRedis = [
    {
        host: '10.80.1.142',
        port: 8000,
    },
    {
        host: '10.80.1.142',
        port: 8001,
    },
    {
        host: '10.80.2.142',
        port: 8000,
    },
    {
        host: '10.80.2.142',
        port: 8001,
    },
    {
        host: '10.80.3.142',
        port: 8000,
    },
    {
        host: '10.80.4.142',
        port: 8001,
    },
];
const redisCluster = new Redis.Cluster(productionRedis);

module.exports = { Redis, redisCluster };
