const MatchedDiceSelector = require('./CardSelectors/MatchedDiceSelector');
// const MaxStatCardSelector = require('./CardSelectors/MaxStatCardSelector');
// const MinStatCardSelector = require('./CardSelectors/MinStatCardSelector');
// const MostStatCardSelector = require('./CardSelectors/MostStatCardSelector');
// const LeastStatCardSelector = require('./CardSelectors/LeastStatCardSelector');
const SingleDieSelector = require('./CardSelectors/SingleDieSelector');
const UpToXDiceSelector = require('./CardSelectors/UpToXDiceSelector');
// const UnlimitedCardSelector = require('./CardSelectors/UnlimitedCardSelector');
// const UpToXCardSelector = require('./CardSelectors/UpToXCardSelector');
// const MostHouseCardSelector = require('./CardSelectors/MostHouseCardSelector');

const defaultProperties = {
    numDice: 1,
    dieCondition: () => true,
    dieType: [], // any
    multiSelect: false
};

const ModeToSelector = {
    ability: (p) => new SingleDieSelector(p),
    match: (p) => new MatchedDiceSelector(p.format, p),
    // minStat: (p) => new MinStatCardSelector(p),
    // maxStat: (p) => new MaxStatCardSelector(p),
    // mostHouse: (p) => new MostHouseCardSelector(p),
    // mostStat: (p) => new MostStatCardSelector(p),
    // leastStat: (p) => new LeastStatCardSelector(p),
    single: (p) => new SingleDieSelector(p),
    // unlimited: (p) => new UnlimitedCardSelector(p),
    upTo: (p) => new UpToXDiceSelector(p.numDice, p)
};

class DieSelector {
    static for(properties) {
        properties = DieSelector.getDefaultedProperties(properties);

        let factory = ModeToSelector[properties.mode];

        if (!factory) {
            throw new Error(`Unknown card selector mode of ${properties.mode}`);
        }

        return factory(properties);
    }

    static getDefaultedProperties(properties) {
        properties = Object.assign({}, defaultProperties, properties);
        if (properties.mode) {
            return properties;
        }

        if (properties.maxStat) {
            properties.mode = 'maxStat';
        } else if (properties.minStat) {
            properties.mode = 'minStat';
        } else if (properties.numDice === 1 && !properties.multiSelect) {
            properties.mode = 'single';
        } else if (properties.numDice === 0) {
            properties.mode = 'unlimited';
        } else {
            properties.mode = 'upTo';
        }

        return properties;
    }
}

module.exports = DieSelector;
