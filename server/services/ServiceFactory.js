const AshesCardService = require('./AshesCardService');

let services = {};

module.exports = {
    cardService: (configService) => {
        if (!services.cardService) {
            services.cardService = new AshesCardService(configService);
        }

        return services.cardService;
    }
};
