const { AbilityType } = require('../constants.js');
const CannotRestriction = require('./Effects/cannotrestriction.js');
const CopyCard = require('./Effects/CopyCard');
const EffectBuilder = require('./Effects/EffectBuilder');
const GainAbility = require('./Effects/GainAbility');

/* Types of effect
    1. Static effects - do something for a period
    2. Dynamic effects - like static, but what they do depends on the game state
    3. Detached effects - do something when applied, and on expiration, but can be ignored in the interim
*/

const Effects = {
    // Card effects
    actionCardLocationAfterPlay: (location) =>
        EffectBuilder.card.static('actionCardLocationAfterPlay', location),
    addKeyword: (keyword) => EffectBuilder.card.static('addKeyword', keyword),
    alert: () => EffectBuilder.card.static('alert'),
    blank: () => EffectBuilder.card.static('blank'),
    bonusDamage: (match) => EffectBuilder.card.static('bonusDamage', match),
    bound: () => EffectBuilder.card.static('bound'),
    bypass: () => EffectBuilder.card.static('bypass'),
    canGuard: () => EffectBuilder.card.static('canGuard'),
    canPlayAsUpgrade: () => EffectBuilder.card.static('canPlayAsUpgrade'),
    cannotBeAbilityTarget: () => EffectBuilder.card.static('cannotBeAbilityTarget'),
    cannotBeAffectedBySpells: () => EffectBuilder.card.static('cannotBeAffectedBySpells'), //implement this to fix issue #613
    cannotBeAttackTarget: () => EffectBuilder.card.static('cannotBeAttackTarget'),
    cannotBeDicePowerTarget: () => EffectBuilder.card.static('cannotBeDicePowerTarget'),
    cannotBeGuarded: () => EffectBuilder.card.static('cannotBeGuarded'),
    cannotBeReactionTarget: () => EffectBuilder.card.static('cannotBeReactionTarget'),
    cannotBeSpellTarget: () => EffectBuilder.card.static('cannotBeSpellTarget'),
    cardCannot: (type, condition) =>
        EffectBuilder.card.static('abilityRestrictions', new CannotRestriction(type, condition)),
    changeType: (type) => EffectBuilder.card.static('changeType', type),
    copyCard: (card) => EffectBuilder.card.static('copyCard', new CopyCard(card)),
    entersPlayUnderOpponentsControl: () =>
        EffectBuilder.card.static('entersPlayUnderOpponentsControl'),
    exhausted: () => EffectBuilder.card.static('exhausted'),
    gainAbility: (type, properties) =>
        EffectBuilder.card.static('gainAbility', new GainAbility(type, properties)),
    limitFightDamage: (amount) => EffectBuilder.card.flexible('limitFightDamage', amount),
    modifyAttack: (amount) => EffectBuilder.card.flexible('modifyAttack', amount),
    modifyLife: (amount) => EffectBuilder.card.flexible('modifyLife', amount),
    modifyRecover: (amount) => EffectBuilder.card.flexible('modifyRecover', amount),
    modifyArmor: (amount) => EffectBuilder.card.flexible('modifyArmor', amount),
    multiplyDamage: (amount) => EffectBuilder.card.flexible('multiplyDamage', amount),
    preventAllDamage: (shield, contextFunc) => EffectBuilder.card.static('preventAllDamage', shield, contextFunc),
    preventBlock: () => EffectBuilder.card.static('preventBlock'),
    preventDamage: (amount) => EffectBuilder.card.static('preventDamage', amount),
    preventGuard: () => EffectBuilder.card.static('preventGuard'),
    preventNonAttackDamage: (amount) => EffectBuilder.card.static('preventNonAttackDamage', amount),
    quickStrike: () => EffectBuilder.card.static('quickStrike'),
    removeKeyword: (keyword) => EffectBuilder.card.static('removeKeyword', keyword),
    setAttack: (amount) => EffectBuilder.card.flexible('setAttack', amount),
    setPrintedAttack: (amount) => EffectBuilder.card.flexible('setPrintedAttack', amount),
    setLife: (amount) => EffectBuilder.card.flexible('setLife', amount),
    setPrintedLife: (amount) => EffectBuilder.card.flexible('setPrintedLife', amount),
    takeControl: (player) => EffectBuilder.card.static('takeControl', player),
    terminalCondition: (properties) =>
        EffectBuilder.card.detached('terminalCondition', {
            apply: (card, context) => {
                properties.target = card;
                properties.context = properties.context || context;
                return context.source.terminalCondition(() => properties);
            },
            unapply: (card, context, effect) =>
                context.game.effectEngine.removeTerminalCondition(effect)
        }),
    threatening: () => EffectBuilder.card.static('threatening'),
    unpreventable: () => EffectBuilder.card.static('unpreventable'),
    unseen: () => EffectBuilder.card.static('unseen'),
    visibleIn: (location) => EffectBuilder.card.static('visibleIn', location),

    // Player effects
    lastingAbilityTrigger: (properties) =>
        EffectBuilder.player.detached('abilityTrigger', {
            apply: (player, context) => {
                let ability = context.source.triggeredAbility(
                    AbilityType.ForcedReaction,
                    Object.assign({ printedAbility: false, player: player }, properties)
                );
                ability.registerEvents();
                return ability;
            },
            unapply: (player, context, ability) => ability.unregisterEvents()
        }),
    additionalCost: (costFactory) => EffectBuilder.player.static('additionalCost', costFactory),
    canPlay: (match) => EffectBuilder.player.static('canPlay', match),
    delayedEffect: (properties) =>
        EffectBuilder.player.detached('delayedEffect', {
            apply: (player, context) => {
                properties.context = properties.context || context;
                return context.source.delayedEffect(() => properties);
            },
            unapply: (player, context, effect) =>
                context.game.effectEngine.removeDelayedEffect(effect)
        }),
    mustAttack: () => EffectBuilder.player.static('mustAttack'),
    additionalDraw: (amount) => EffectBuilder.player.flexible('additionalDraw', amount),
    playerCannot: (type, condition) =>
        EffectBuilder.player.static('abilityRestrictions', new CannotRestriction(type, condition)),
    skipStep: (step) => EffectBuilder.player.static('skipStep', step),
    preventAutoDice: () => EffectBuilder.player.static('preventAutoDice')
};

module.exports = Effects;
