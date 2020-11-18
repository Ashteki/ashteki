const MessageService = require('./AshesMessageService');
const monk = require('monk');
const ConfigService = require('./ConfigService');
const AshesCardService = require('./AshesCardService');

let services = {};

module.exports = {
    messageService: () => {
        if (!services.messageService) {
            const mongoUrl = process.env.MONGO_URL || new ConfigService().getValue('mongo');
            let db = monk(mongoUrl);

            services.messageService = new MessageService(db);
        }

        return services.messageService;
    },
    cardService: (configService) => {
        if (!services.cardService) {
            services.cardService = new AshesCardService(configService);
        }

        return services.cardService;
    }
};
