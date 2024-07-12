const BotBrain = require('../solo/BotBrain');
const DummyTurn = require('./DummyTurn');

class BotTurn extends DummyTurn {
    constructor(game) {
        super(game);
        this.botBrain = new BotBrain();
    }

    beginTurn() {
        if (this.player.anyEffect('mustAttack') && this.canAttack()) {
            this.player.doAttack();
            return;
        }

        // side and main should be considered
        this.game.queueSimpleStep(() => {
            this.considerAction();
        });
        this.game.queueSimpleStep(() => {
            this.considerAction();
        });
    }

    considerAction() {
        const botParams = {
            legalActions: this.player.getAllActions(),
            allActions: this.player.getAllActions({ ignoreDiceCost: true, ignoreActionCost: true }),
            context: this.game.getFrameworkContext(this.player)
        }

        this.botBrain.weightActions(botParams);

        // shuffle hand for random?
        botParams.legalActions.sort((a, b) => (a.weight > b.weight ? -1 : 1));
        const fave = botParams.legalActions.filter(l => l.weight > 0)[0];

        if (fave) {
            this.doAction(fave);
            return;
        }

        // do an attack?
        if (this.player.canAttack()) {
            this.game.initiateAttack(this.player.opponent.phoenixborn, this.player.getAttacker());
        }

    }

    doAction(fave) {
        let context = fave.createContext(this.player);
        this.game.resolveAbility(context);
    }


}

module.exports = BotTurn;
