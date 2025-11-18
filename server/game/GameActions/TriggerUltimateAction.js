const { CardType } = require('../../constants');
const CardGameAction = require('./CardGameAction');

class TriggerUltimateAction extends CardGameAction {
    setDefaultProperties() {
    }

    setup() {
        this.targetType = [CardType.Chimera];
    }

    canAffect(card, context) {
        return card.location === 'play area' && super.canAffect(card, context);
    }

    getEvent(card, context) {
        const params = {
            card: card,
            context: context
        };
        return super.createEvent('onUltimate', params, (event) => {
            context.game.queueUserAlert(context, {
                style: 'danger',
                timed: true,
                promptTitle: 'Chimera Ultimate',
                menuTitle: 'Chimera uses its Ultimate ability!'
            });
            context.game.addAlert('danger', 'Chimera uses its Ultimate ability!');
            event.card.tokens.redRains = 0;
            context.game.addMessage(
                '{0} red rains tokens removed from chimera',
                context.player.ultimateThreshold
            );

            const alienUnits = context.player.unitsInPlay.filter(c => c.owner !== c.controller);
            if (alienUnits.length) {
                context.game.actions.discard().resolve(alienUnits, context);
            }
            const alienUpgrades = context.player.unitsInPlay.reduce((accumulator, curValue) => {
                return accumulator.concat(
                    curValue.upgrades.filter((u) => u.owner !== u.controller)
                );
            }, []);

            if (alienUpgrades.length) {
                context.game.actions.discard().resolve(alienUpgrades, context);
            }
            // do ability
            context.player.triggerUltimateAbility();

            // next phase
            context.game.queueSimpleStep(() => {
                context.player.advanceChimeraPhase();
            });
        });
    }
}

module.exports = TriggerUltimateAction;
