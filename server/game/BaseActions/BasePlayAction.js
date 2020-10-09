const AbilityContext = require('../AbilityContext');
const BaseAbility = require('../baseability.js');
const Costs = require('../costs');

function parseCosts(costData) {
    const costs = [];
    let diceReq = [];
    for (let costItem of costData) {
        switch (costItem) {
            case '[[main]]':
                costs.push(Costs.mainAction());
                break;
            case '[[side]]':
                costs.push(Costs.mainAction());
                break;
            case '[[exhaust]]':
                costs.push(Costs.exhaust());
                break;
            default:
                diceReq = diceReq.concat(parseDiceCost(costItem));
        }
    }
    if (diceReq.length > 0) {
        costs.push(Costs.dice(diceReq));
    }

    return costs;
}

function parseDiceCost(diceCost) {
    // examples:
    // "1 [[charm:class]]",
    // "1 [[basic]]"
    // "# [[type||missing:level]]"
    const parts = diceCost.split(' ');
    const count = parts[0];
    const definition = parts[1].replace('[[', '').replace(']]', '').split(':');
    const level = definition.length > 1 ? definition[1] : definition[0];
    const magic = definition.length > 1 ? definition[0] : null;
    const result = [];
    for (let i = 1; i <= count; i++) {
        result.push({ magic: magic, level: level });
    }
    return result;
}

class BasePlayAction extends BaseAbility {
    constructor(card, costs = [], target) {
        let cardCosts = parseCosts(card.cardData.cost);

        let properties = { cost: costs.concat(cardCosts) };
        if (target) {
            properties.target = target;
        }

        super(properties);
        this.card = card;
        this.abilityType = 'action';
    }

    displayMessage(context) {
        context.game.addMessage('{0} plays {1}', context.player, context.source.name);
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if (
            !ignoredRequirements.includes('location') &&
            !context.player.isCardInPlayableLocation(context.source, 'play')
        ) {
            return 'location';
        } else if (
            !ignoredRequirements.includes('cannotTrigger') &&
            (!context.player.checkRestrictions('play', context) ||
                !context.source.checkRestrictions('play', context))
        ) {
            return 'cannotTrigger';
        }

        return super.meetsRequirements(context);
    }

    createContext(player = this.card.controller) {
        return new AbilityContext({
            ability: this,
            game: this.card.game,
            player: player,
            source: this.card
        });
    }

    addBonusIconResolution(event, context) {
        event.addSubEvent(
            context.game.getEvent('unnamedEvent', {}, () => {
                context.game.checkGameState(true);
                context.game.actions.resolveBonusIcons().resolve(this.card, context);
            })
        );
    }

    // eslint-disable-next-line no-unused-vars
    addSubEvent(event, context) {
        return;
    }

    executeHandler(context) {
        let event = context.game.getEvent(
            'onCardPlayed',
            {
                player: context.player,
                card: context.source,
                originalLocation: context.source.location
            },
            () => context.game.cardsPlayed.push(context.source)
        );
        this.addBonusIconResolution(event, context);
        this.addSubEvent(event, context);
        context.game.openEventWindow(event);
    }

    isAction() {
        return true;
    }

    isCardPlayed() {
        return true;
    }
}

module.exports = BasePlayAction;
