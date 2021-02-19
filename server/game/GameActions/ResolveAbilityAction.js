const CardAction = require('./CardGameAction');
const { NoCostsAbilityResolver } = require('../gamesteps/NoCostsAbilityResolver');

class ResolveAbilityAction extends CardAction {
    setDefaultProperties() {
        this.ability = null;
        this.secondResolution = false;
    }

    setup() {
        super.setup();
        this.name = 'resolveAbility';
        if (this.ability) {
            this.effectMsg = `resolve {0}'s ${
                this.ability.title ? this.ability.title + ' ' : ''
            }ability`;
        } else {
            this.effectMsg = 'resolve an ability on {0}';
        }
    }

    getEvent(card, context) {
        return super.createEvent('onAction', { card: card, context: context }, () => {
            let ability = this.ability;
            if (typeof ability === 'function') {
                let cardAbilites = card.abilities.actions.concat(card.abilities.reactions);
                let filteredAbilities = cardAbilites.filter((a) => ability(a));
                if (filteredAbilities.length > 1) {
                    let choices = [];
                    let handlers = [];
                    for (let a of filteredAbilities) {
                        const generatingEffect = context.game.effectEngine.effects.find(
                            (effect) => effect.effect.getValue(context.source) === a
                        );
                        if (generatingEffect) {
                            choices.push(generatingEffect.source.name);
                            handlers.push(
                                () => (ability = generatingEffect.effect.getValue(context.source))
                            );
                        } else {
                            let ownAbility = filteredAbilities.find(
                                (a) => a.card === context.source
                            );
                            if (ownAbility) {
                                choices.push(context.source.name);
                                handlers.push(() => (ability = ownAbility));
                            }
                        }
                    }

                    if (choices.length === 0) {
                        return;
                    } else if (choices.length === 1) {
                        handlers[0]();
                    } else {
                        context.game.promptWithHandlerMenu({
                            activePromptTitle: 'Resolve ability from:',
                            context: context,
                            choices: choices,
                            handlers: handlers
                        });
                    }
                } else {
                    ability = filteredAbilities[0];
                }
            }

            context.game.queueSimpleStep(() => {
                if (ability && (!ability.condition || ability.condition(context))) {
                    let newContext = Object.assign(ability.createContext(context.player), {
                        isResolveAbility: true,
                        secondResolution: this.secondResolution
                    });
                    context.game.queueStep(new NoCostsAbilityResolver(context.game, newContext));
                }
            });
        });
    }
}

module.exports = ResolveAbilityAction;
