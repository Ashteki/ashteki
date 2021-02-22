const PlayerAction = require('./PlayerAction');

class ChangeDiceAction extends PlayerAction {
    constructor(properties) {
        super(properties);
        this.name = 'changeDice';
        this.eventName = 'onChangeDice';
        this.effect = 'changes dice';
    }

    setDefaultProperties() {
        this.numDice = 1;
        this.owner = 'self';
    }

    defaultTargets(context) {
        return [context.player];
    }

    getEvent(player, context) {
        const params = {
            player: player,
            context: context,
            numDice: this.numDice,
            owner: this.owner,
            cycleDirection: this.owner === 'opponent' ? 'down' : 'up',
            sort: true
        };
        return super.createEvent('onChangeDice', params, (event) => {
            const props = Object.assign(
                {
                    onSelect: (player, dice) => {
                        context.game.addMessage('{0} changes dice levels: {1}', player, dice);
                        return true;
                    },
                    activePromptTitle:
                        'Change ' +
                        event.numDice +
                        ' dice. Click a die again to change its magic level'
                },
                params
            );
            context.game.promptForDiceChange(event.player, props);
        });
    }
}
module.exports = ChangeDiceAction;
