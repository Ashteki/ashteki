const ServiceFactory = require('../services/ServiceFactory');
const ConfigService = require('../services/ConfigService');

const cardService = ServiceFactory.cardService(new ConfigService());

module.exports.init = function (server) {
    server.get('/api/cards', function (req, res, next) {
        cardService
            .getAllCards({ shortForm: true })
            .then((cards) => {
                res.send({ success: true, cards: cards });
            })
            .catch((err) => {
                return next(err);
            });
    });

    server.get('/api/cards/alts', function (req, res, next) {
        cardService
            .getAltArts({ shortForm: true })
            .then((alts) => {
                res.send({ success: true, alts: alts });
            })
            .catch((err) => {
                return next(err);
            });
    });
};
