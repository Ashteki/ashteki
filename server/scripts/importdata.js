const fs = require('fs');
const _ = require('underscore');
const AshesCardService = require('../services/AshesCardService');
const ConfigService = require('../services/ConfigService');

let cardService = new AshesCardService(new ConfigService());
const dataDirectory = 'data/cards/';
let files = fs.readdirSync(dataDirectory);
let totalCards = [];
let deckType = null;

_.each(files, (file) => {
    let cardData = JSON.parse(fs.readFileSync(dataDirectory + file).toString());
    console.log(file);
    deckType = cardData.deckType;
    let packCards = cardData.results;
    if (deckType) {
        packCards.forEach((card) => {
            card.deckType = deckType;
        });
    }
    totalCards = totalCards.concat(packCards);
});

_.each(totalCards, (card) => {
    let cardsByName = _.filter(totalCards, (filterCard) => {
        return filterCard.name === card.name;
    });

    if (cardsByName.length > 1) {
        card.name = card.name + ' (' + card.pack_code + ')';
    }
});

cardService.replaceCards(totalCards).then((cards) => {
    console.info(cards.length + ' cards imported');
});
