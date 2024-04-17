var express = require('express');
var router = express.Router();


const servers = [
    {
        host: 'localhost',
        port: 3000,
        users: 1,
    },
    {
        host: 'localhost',
        port: 8080,
        users: 2,
    },
    {
        host: 'localhost',
        port: 5000,
        users: 2,
    },
    {
        host: 'localhost',
        port: 1234,
        users: 3,
    },
    {
        host: 'localhost',
        port: 9000,
        users: 4,
    },
    {
        host: 'localhost',
        port: 7070,
        users: 4,
    }
    // Add more server entries as needed
];


router.get('/', (req, res, next) => {
    try {
        var mostUsers = 0;
        var forwardedServer;
        servers.forEach( (server) => {
            if(server.users > mostUsers) {
                mostUsers = server.users
                forwardedServer = server
            }
        })

        // Code that may potentially throw an error
        res.send(forwardedServer);
    } catch (error) {
        // If an error occurs, handle it here
        next(error); // Pass the error to the next middleware or error handler
    }
})

module.exports = router;