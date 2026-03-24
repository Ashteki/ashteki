const LobbyServer = require('./lobbyserver.js');
const Lobby = require('./lobby.js');
const UserService = require('./services/AshesUserService');
const ConfigService = require('./services/ConfigService');
const configService = new ConfigService();
const express = require('express');
const http = require("http");
const logger = require('./log.js');

async function runServer() {
    const app = express();
    const httpServer = http.createServer(app);

    let options = { configService: configService };
    options.userService = new UserService(options.configService);

    let lobbyServer = new LobbyServer(process.env.NODE_ENV !== 'production', app);
    lobbyServer.init(options);
    let lobby = new Lobby(httpServer, options);

    // pre-load card/deck data
    await lobby.init();

    let port = process.env.PORT || configService.getValueForSection('lobby', 'port') || 4000;

    httpServer.listen(port, () => {
        logger.info(
            `==> ?? Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`
        );
    });
}

module.exports = runServer;
