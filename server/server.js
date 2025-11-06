const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ConfigService = require('./services/ConfigService');
const passport = require('passport');
const logger = require('./log.js');
const api = require('./api');
const path = require('path');
const http = require('http');
const webpackHotMiddleware = require('webpack-hot-middleware');
const webpackDevMiddleware = require('webpack-dev-middleware');
const historyApiFallback = require('connect-history-api-fallback');
const webpack = require('webpack');
const webpackConfig = require('../webpack.dev.js');

const passportJwt = require('passport-jwt');
const Sentry = require('@sentry/node');

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

const UserService = require('./services/AshesUserService.js');
const version = require('../version.js');

class Server {
    constructor(isDeveloping) {
        this.configService = new ConfigService();

        this.userService = new UserService(this.configService);
        this.isDeveloping = isDeveloping;
        this.server = http.createServer(app);
    }

    init(options) {
        if (!this.isDeveloping) {
            Sentry.init({
                dsn: process.env.SENTRY_DSN || this.configService.getValue('sentryDsn'),
                release: version.build
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

        if (this.isDeveloping) {
            const compiler = webpack(webpackConfig);

            // Ensure history API fallback is applied so SPA routes work, then mount
            // the dev middleware which serves bundles from memory. webpackHotMiddleware
            // should be mounted after the dev middleware.
            app.use(historyApiFallback());

            app.use(
                webpackDevMiddleware(compiler, {
                    hot: true,
                    contentBase: 'client',
                    publicPath: '/',
                    // Ensure dev server does not cache index.html or any assets so changes
                    // are immediately visible during development.
                    headers: {
                        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
                    },
                    stats: {
                        colors: true,
                        hash: false,
                        timings: true,
                        chunks: false,
                        chunkModules: false,
                        modules: false
                    }
                })
            );

            app.use(
                webpackHotMiddleware(compiler, {
                    log: false,
                    path: '/__webpack_hmr',
                    heartbeat: 2000
                })
            );
        } else {
            // In production serve the built `dist` folder. During development we rely on
            // webpackDevMiddleware which serves bundles from memory so we must NOT
            // register the `dist` static middleware while developing — otherwise
            // stale files on disk (old JSX builds) can be returned before the dev
            // middleware has a chance to intercept requests.
            app.use(express.static(__dirname + '/../dist'));

            // Serve index.html in production with no-cache headers so browsers and proxies
            // always fetch the latest application shell after deploys.
            app.get('*', (req, res) => {
                // Prevent caching of index.html
                res.setHeader('Cache-Control',
                    'no-store, no-cache, must-revalidate, proxy-revalidate');
                res.setHeader('Pragma', 'no-cache');
                res.setHeader('Expires', '0');

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

        return this.server;
    }

    run() {
        let port =
            process.env.PORT || this.configService.getValueForSection('lobby', 'port') || 4000;

        this.server.listen(port, function onStart(err) {
            if (err) {
                logger.error(err);
            }

            logger.info(
                `==> ?? Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`
            );
        });
    }

    serializeUser(user, done) {
        if (user) {
            done(null, user.id);
        }
    }
}

module.exports = Server;
