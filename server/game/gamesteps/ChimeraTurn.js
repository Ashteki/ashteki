const { Level } = require('../../constants');
const AbilityDsl = require('../abilitydsl');
const Dice = require('../dice');
const DummyTurn = require('./DummyTurn');
const SimpleStep = require('./simplestep');

class ChimeraTurn extends DummyTurn {
    beginTurn() {
        if (this.player.anyEffect('mustAttack') && this.canAttack()) {
            this.player.doAttack();
            return;
        }

        if (this.player.threatCards.length) {
            // if aspects are not revealed then roll for behaviour etc
            this.rollDice();
        } else if (this.canAttack()) {
            // attack if able and no facedown aspects
            this.player.doAttack();
        } else {
            // pass (log is handled in player.endTurn)
        }
    }

    rollDice() {
        // Reroll a basic die
        // queue an action because of redrains trigger
        const basicDie = this.player.dice.find((die) => die.level === Level.Basic);
        const result = AbilityDsl.actions
            .rerollDice({ target: basicDie })
            .resolve(basicDie, this.game.getFrameworkContext(this.player));

        // Roll for behaviour
        this.queueStep(
            new SimpleStep(this.game, () => {
                const d12Roll = Dice.d12Roll();
                // roll behaviour dice and determine
                this.game.addMessage('{0} rolls {1} for behaviour', this.player, d12Roll);
                this.player.behaviourRoll = d12Roll;
                const context = this.game.getFrameworkContext(this.player);

                const rolledRageDie = result.event.childEvent.dice[0];
                const clonedRageDie = result.event.childEvent.diceCopy[0];
                // get actions from behaviour card and queue
                const behaviour = this.player.behaviour.getBehaviour(
                    d12Roll,
                    this.player.chimeraPhase
                );
                this.game.addAlert(
                    'info',
                    '{0} rolls {1} for behaviour:\n{2}',
                    this.player,
                    d12Roll,
                    behaviour
                );
                this.game.queueUserAlert(context, {
                    style: 'danger',
                    promptTitle: 'Chimera Turn',
                    menuTitle: 'Chimera rolls rage and behavior dice',
                    controls: [
                        {
                            type: 'targeting',
                            source: clonedRageDie.getShortSummary(),
                            targets: [rolledRageDie.getShortSummary()] // [this.attack.target.getShortSummary()]
                        },
                        {
                            type: 'behaviour',
                            behaviour: behaviour.getShortSummary()
                        }
                    ]
                });
                // behaviourCard.handleBehaviourRoll(d12Roll);
                behaviour.execute();
            })
        );
    }
}

module.exports = ChimeraTurn;
