const { CardType } = require('../../constants');
const DummyTurn = require('./DummyTurn');

class BotTurn extends DummyTurn {
    beginTurn() {
        if (this.player.anyEffect('mustAttack') && this.canAttack()) {
            this.player.doAttack();
            return;
        }

        // shuffle hand for random?

        // play a ready spell
        const readySpell = this.player.hand.find(
            (card) => card.type === CardType.ReadySpell && card.canPlay(this.player)
        );
        if (readySpell) {
            readySpell.use(this.player);


        } else {
            // pass (log is handled in player.endTurn)
        }
    }
}

module.exports = BotTurn;
