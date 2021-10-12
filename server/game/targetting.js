const { CardType } = require('../constants');

function checkTarget(card, context) {
    if (!card) {
        return false;
    }

    if (!card.checkRestrictions('target', context)) {
        return false;
    }
    if (context.player === card.controller.opponent) {
        if (context.source.isSpell && card.anyEffect('cannotBeSpellTarget')) {
            return false;
        }
        if (context.source.type === 'die' && card.anyEffect('cannotBeDicePowerTarget')) {
            return false;
        }
        //abilities
        if (context.source.location === 'play area' && card.anyEffect('cannotBeAbilityTarget')) {
            return false;
        }
        // lightning speed / no reactions can target
        if (
            (context.source.type === CardType.ReactionSpell || context.playedAsReaction) &&
            card.anyEffect('cannotBeReactionTarget')
        ) {
            return false;
        }
    }

    return true;
}

module.exports = {
    checkTarget: checkTarget
};
