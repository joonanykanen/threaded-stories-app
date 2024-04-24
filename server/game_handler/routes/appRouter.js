// appRouter.js, JN, 24.04.2024
const express = require('express');

function createRouter(queuedPlayers) {
    const router = express.Router();

    router.get('/healthcheck', (req, res) => {
        if (queuedPlayers.length < 5) {
            res.status(200).json({ users: queuedPlayers.length });
        } else {
            res.status(503).send("Server full");
        }
    });

    return router;
}

module.exports = createRouter;
