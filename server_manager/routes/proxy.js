var express = require('express');
var router = express.Router();
const axios = require('axios');

// in the future just host and port number
// just a list that lists the necessary requests to be made
var servers = [
    {
        host: 'localhost',
        port: 3001,
    },
    {
        host: 'localhost',
        port: 8080,
    },
    {
        host: 'localhost',
        port: 5000,
    },
    {
        host: 'localhost',
        port: 1234,
    },
    {
        host: 'localhost',
        port: 9000,
        users: 4,
    },
    {
        host: 'localhost',
        port: 7070,
    }
    
];


router.get('/', async (req, res, next) => {
    try {

        var mostUsers = 0;
        const forwardedServer = await serverScanner();

       /* servers.forEach( (server) => {

            if(server.users > mostUsers) {
                mostUsers = server.users
                forwardedServer = server
            }
        })*/

        
        res.send(forwardedServer);
    } catch (error) {
        
        next(error); 
    }
})

// loops through making requests to each server for health checks and user number updates
// returns server that has the most users under 5 users
const serverScanner = async () => {
    console.log("hei hei")
    // 
    let mostUsers = 0;
    let forwardedServer;
    const results = []; 
    for (let i = 0; i < servers.length; i++) {
        let server = servers[i]

        try {
            const response = await axios.get(`http://${server.host}:${server.port}/app/healthcheck`);
            // Check status
            if (response.status === 200) {
              results.push({
                id: server.port,
                users: response.data.users,
                status: 'passing'
              });
              users = response.data.users
              if(users > mostUsers & users < 5){
                mostUsers = users
                forwardedServer = server
              }
              
            } else {
              results.push({
                id: server.port,
                users: server.data.users,
                status: 'failing' 
              });
            }
            
          } catch (error) {
            results.push({
              id: server.port,
              users: server.data.users,
              status: 'failing'
            });
          }
        

    }

    console.log(results)

    return forwardedServer

}

module.exports = router;