class BotTargetCardStrategy {
    constructor(player) {
        this.player = player;
    }

    execute(abilityTarget, context) {
        if (context.source.targetPriority === 'value') {
            abilityTarget.doOrderedSelection(context, (a, b) =>
                a.attack + a.life > b.attack + b.life ? -1 : 0
            );

            return true;
        }

        abilityTarget.doRandomSelection(context);

        return true;
    }
}

module.exports = BotTargetCardStrategy;