const MessageService = require('./AshesMessageService');
const monk = require('monk');
const ConfigService = require('./ConfigService');
const AshesCardService = require('./AshesCardService');

let services = {};

module.exports = {
    messageService: () => {
        if (!services.messageService) {
            let db = monk(new ConfigService().getValue('mongo'));

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
