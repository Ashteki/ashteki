const AbilityTargetOptions = require('./AbilityTargetOptions');

class AbilityTargetPlayer extends AbilityTargetOptions {
    constructor(name, properties, ability) {
        super(name, properties, ability);
        this.options = [
            { name: 'Opponent', value: true },
            { name: 'Me', value: false }
        ];
        this.handler = (option, context) =>
            (context.target = option.value ? context.player.opponent : context.player);
    }

    getGameAction(context) {
        return this.properties.gameAction.filter((gameAction) =>
            gameAction.hasLegalTarget(context)
        );
    }
}

module.exports = AbilityTargetPlayer;
