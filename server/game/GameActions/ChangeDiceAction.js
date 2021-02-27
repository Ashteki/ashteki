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
            cycleLevels: true,
            sort: true,
            preventAuto: true
        };
        return super.createEvent('onChangeDice', params, (event) => {
            let playerPhrase = ' of your dice'; // self by default
            if (event.owner === 'opponent') {
                playerPhrase = " of your opponent's dice";
            } else if (event.owner === 'any') {
                playerPhrase = " of any player's dice";
            }
            const props = Object.assign(
                {
                    onSelect: (player, dice) => {
                        context.game.addMessage('{0} changes dice levels: {1}', player, dice);
                        return true;
                    },
                    activePromptTitle:
                        'Change ' +
                        event.numDice +
                        playerPhrase +
                        '. Click a die again to change its magic level'
                },
                params
            );
            context.game.promptForDiceChange(event.player, props);
        });
    }
}
module.exports = ChangeDiceAction;
