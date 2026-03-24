const bodyParser = require('body-parser');
const ConfigService = require('./services/ConfigService');
const passport = require('passport');
const logger = require('./log.js');
const api = require('./api');
const path = require('path');
const fs = require('fs');
const express = require('express');

const passportJwt = require('passport-jwt');
const Sentry = require('@sentry/node');

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const UserService = require('./services/AshesUserService.js');

class LobbyServer {
    constructor(isDeveloping, expressApp) {
        this.configService = new ConfigService();

        this.userService = new UserService(this.configService);
        this.isDeveloping = isDeveloping;

        this.app = expressApp;
    }

    async init(options) {
        const app = this.app;

        if (!this.isDeveloping) {
            Sentry.init({
                dsn: process.env.SENTRY_DSN || this.configService.getValue('sentryDsn'),
                release: process.env.VERSION || 'Local build'
            });
            app.use(Sentry.Handlers.requestHandler());
            app.use(Sentry.Handlers.errorHandler());
        }

        var opts = {};
        opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
        opts.secretOrKey = this.configService.getValue('secret');

        passport.use(
            new JwtStrategy(opts, (jwtPayload, done) => {
                this.userService
                    .getUserById(jwtPayload.id)
                    .then((user) => {
                        if (user) {
                            return done(null, user.getWireSafeDetails());
                        }

                        return done(null, false);
                    })
                    .catch((err) => {
                        return done(err, false);
                    });
            })
        );
        app.use(passport.initialize());

        app.use(bodyParser.json({ limit: '5mb' }));
        app.use(bodyParser.urlencoded({ extended: false }));

        api.init(app, options);

        // Always serve static files from `public`
        app.use(express.static(__dirname + '/../public'));
        if (!this.isDeveloping) {
            app.use(express.static(__dirname + '/../dist'));
        }

        if (this.isDeveloping) {
            const { createViteMiddleware } = await import('./vite-dev.mjs');
            const { vite, templatePath } = await createViteMiddleware({
                root: path.join(__dirname, '..')
            });

            app.use(vite.middlewares);

            app.get('*', async (req, res, next) => {
                try {
                    const url = req.originalUrl;
                    const template = fs.readFileSync(templatePath, 'utf-8');
                    const html = await vite.transformIndexHtml(url, template);
                    res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
                } catch (err) {
                    vite.ssrFixStacktrace(err);
                    next(err);
                }
            });
        } else {
            app.get('*', (req, res) => {
                res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
            });
        }

        // Define error middleware last
        app.use(function (err, req, res, next) {
            logger.error(err);

            if (!res.headersSent && req.xhr) {
                return res.status(500).send({ success: false });
            }

            next(err);
        });
    }

    run() {
        // let port =
        //     process.env.PORT || this.configService.getValueForSection('lobby', 'port') || 4000;

        // this.server.listen(port, function onStart(err) {
        //     if (err) {
        //         logger.error(err);
        //     }

        //     logger.info(
        //         `==> ?? Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`
        //     );
        // });

        // ViteExpress.bind(this.app, this.server);
    }

    serializeUser(user, done) {
        if (user) {
            done(null, user.id);
        }
    }
}

module.exports = LobbyServer;
