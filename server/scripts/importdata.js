const fs = require('fs');
const _ = require('underscore');
const AshesCardService = require('../services/AshesCardService');
const ConfigService = require('../services/ConfigService');

let cardService = new AshesCardService(new ConfigService());
const dataDirectory = 'data/cards/';
let files = fs.readdirSync(dataDirectory);
let totalCards = [];
// let packs = JSON.parse(fs.readFileSync('fiveringdsdb-data/Pack.json').toString());
// let types = JSON.parse(fs.readFileSync('fiveringdsdb-data/Type.json').toString());
// let clans = JSON.parse(fs.readFileSync('fiveringdsdb-data/Clan.json').toString());

_.each(files, (file) => {
    let cardData = JSON.parse(fs.readFileSync(dataDirectory + file).toString());
    console.log(file);
    totalCards = totalCards.concat(cardData.results);
});

_.each(totalCards, (card) => {
    let cardsByName = _.filter(totalCards, (filterCard) => {
        return filterCard.name === card.name;
    });

    if (cardsByName.length > 1) {
        card.name = card.name + ' (' + card.pack_code + ')';
    }
});

// let replacePacks = cardService.replacePacks(packs).then((packs) => {
//     console.info(packs.length + ' packs imported');
// });

cardService.replaceCards(totalCards).then((cards) => {
    console.info(cards.length + ' cards imported');
});
