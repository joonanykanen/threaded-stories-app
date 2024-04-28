var express = require('express');
var router = express.Router();
const axios = require('axios');


// list of servers
const servers = [
  {
      host: 'https://game1.nykanen.dev',
      port: 3000,
  },
  {
    host: 'https://game2.nykanen.dev',
    port: 3000,
  },
  {
    host: 'https://game3.nykanen.dev',
    port: 3000,
  }
];

router.get('/', async (req, res, next) => {

    try {
        const forwardedServer = await serverScanner();
        if(forwardedServer){

          console.log(forwardedServer.port,forwardedServer.host);
          res.json({ host: forwardedServer.host, port: forwardedServer.port });

        }else{

          res.status(503).send({ msg: "no servers available" });

        }
        //res.send(forwardedServer);
        


    } catch (error) {
        
        next(error); 
    }
});

// loops through making requests to each server for health checks and user number updates
// returns server that has the most users under 5 users
// test by running the servers.js file by doing node servers.js 
const serverScanner = async () => {
     
    let mostUsers = -1;
    let forwardedServer;
    //const results = []; 

    for (let i = 0; i < servers.length; i++) {
        let server = servers[i]

        try {
            const response = await axios.get(`${server.host}:${server.port}/app/healthcheck`);
            //const response = await axios.get(`http://${server.host}:3000/user-number`);
            // Check status
            if (response.status === 200) {
              /*results.push({
                port: server.port,
                host: server.host,
                status: 'passing'
              });*/

              // checking for appropriate server
              users = response.data.users
              if(users > mostUsers & users < 5){
                mostUsers = users
                forwardedServer = server
              }
              
            } else {
              console.log(response.status)
              /*results.push({
                port: server.port,
                host: server.host,
                status: 'failing' 
              });*/

            }
            
          } catch (error) {
            console.log(error.errors)
            /*results.push({
              port: server.port,
              host: server.host,
              status: 'failing'
            });*/
          }
        

    }

    //console.log(results)

    return forwardedServer

}

module.exports = router;