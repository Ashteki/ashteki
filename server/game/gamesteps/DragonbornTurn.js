const { Level } = require('../../constants');
const AbilityDsl = require('../abilitydsl');
const Dice = require('../dice');
const DummyTurn = require('./DummyTurn');
const SimpleStep = require('./simplestep');

class DragonbornTurn extends DummyTurn {
    queueActions() {
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
        const basicDie = this.player.dice.find((die) => die.level === Level.Basic);
        const result = AbilityDsl.actions
            .rerollDice({ target: basicDie })
            .resolve(basicDie, this.game.getFrameworkContext(this.player));

        this.queueStep(
            new SimpleStep(this.game, () => {
                // Interpret behaviour
                const rolledRageDie = result.event.childEvent.dice[0];
                const clonedRageDie = result.event.childEvent.diceCopy[0];

                this.game.addMessage('{0} rolls {1} for behaviour', this.player, clonedRageDie);
                // this.player.behaviourRoll = d12Roll;
                const context = this.game.getFrameworkContext(this.player);

                // get actions from behaviour card and queue
                const behaviour = this.player.behaviour.getBehaviour(clonedRageDie.level);
                // this.game.addAlert(
                //     'info',
                //     '{0} rolls {1} for behaviour:\n{2}',
                //     this.player,
                //     d12Roll,
                //     behaviour
                // );
                this.game.queueUserAlert(context, {
                    style: 'danger',
                    promptTitle: 'Dragonborn Turn',
                    menuTitle: 'Dragonborn rolls for behaviour',
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

module.exports = DragonbornTurn;
