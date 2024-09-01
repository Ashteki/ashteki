const AbilityContext = require('../AbilityContext');
const BaseAbility = require('../baseability.js');

class DiscardAction extends BaseAbility {
    constructor(card) {
        super({});
        this.card = card;
        this.title = 'Discard this card';
        this.showMessage = true;
    }

    createContext(player = this.card.controller) {
        return new AbilityContext({
            ability: this,
            game: this.card.game,
            player: player,
            source: this.card
        });
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if (
            !this.card.checkRestrictions('discard', context) ||
            !context.player.checkRestrictions('discard', context)
        ) {
            return 'cannotTrigger';
        } else if (
            !ignoredRequirements.includes('location') &&
            !context.player.isCardInPlayableLocation(context.source, 'play')
        ) {
            return 'location';
        } else if (context.game.currentPhase !== 'main') {
            // this will stop this working - phase is now playerturns
            return 'phase';
        }

        return super.meetsRequirements(context);
    }

    executeHandler(context) {
        context.game.actions.discard().resolve(this.card, context);
        if (this.showMessage) {
            context.game.addMessage('{0} discards {1}', context.player, context.source);
        }
    }

    isAction() {
        return true;
    }
}

module.exports = DiscardAction;
