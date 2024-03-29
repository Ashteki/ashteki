const BasePlayAction = require('./BasePlayAction');
const AttachAction = require('../GameActions/AttachAction');
const LastingEffectCardAction = require('../GameActions/LastingEffectCardAction');
const Effects = require('../effects');
const { CardType, BattlefieldTypes } = require('../../constants');

class PlayUpgradeAction extends BasePlayAction {
    constructor(card) {
        super(card, {
            activePromptTitle: 'Choose a unit to attach to',
            cardType: BattlefieldTypes,
            gameAction: new AttachAction((context) => ({ upgrade: context.source }))
        });
        this.title = 'Play this alteration';
    }

    displayMessage(context) {
        if (context.target) {
            context.game.addMessage(
                '{0} plays {1} attaching it to {2}',
                context.player,
                context.source,
                context.target
            );
        } else {
            context.game.addMessage(
                '{0} plays {1} and it is discarded',
                context.player,
                context.source
            );
        }
    }

    meetsRequirements(context = this.createContext(), ignoredRequirements = []) {
        if (
            BattlefieldTypes.includes(context.source.printedType) &&
            context.source.canPlayAsUpgrade()
        ) {
            context.source.printedType = CardType.Upgrade;
            let result = super.meetsRequirements(context, ignoredRequirements);
            return result;
        }

        return super.meetsRequirements(context, ignoredRequirements);
    }

    addSubEvent(event, context) {
        event.addChildEvent(
            new AttachAction({ upgrade: context.source }).getEvent(context.target, context)
        );
        // if this is attachable because of a lasting effect...
        if (BattlefieldTypes.includes(context.source.type)) {
            const changeTypeEvent = new LastingEffectCardAction({
                duration: 'lastingEffect',
                effect: Effects.changeType(CardType.Upgrade)
            }).getEvent(context.source, context);
            changeTypeEvent.gameAction = null;
            event.addChildEvent(changeTypeEvent);
        }
    }
}

module.exports = PlayUpgradeAction;
