const { Level } = require("../../../constants");
const AbilityDsl = require("../../abilitydsl");
const BehaviourCard = require("../../solo/BehaviourCard");

class VirosBehaviour extends BehaviourCard {
    handleBehaviourRoll(behaviourRoll) {
        switch (behaviourRoll) {
            case 1:
            case 2:
                this.doReveal();
                break;
            case 3:
            case 4:
                this.canAttack() ? this.doAttack() : this.doReveal();
                break;
            case 5:
            case 6:
                // Main: Reveal. Attack with revealed aspect
                // TODO: use revealed aspect
                const attacker = this.doReveal();
                this.doAttack(attacker);
                break;
            case 7:
            case 8:
            case 9:
                // Side: Target opposing player must lower 2 non-basic dice in their active pool one level.
                this.doLowerOpponentsDice();
                // Main: Reveal
                this.doReveal();
                break;
            case 10:
            case 11:
                // Side: Raise 1 basic rage die one level
                this.doRageRaise();
                // Main: Reveal
                this.doReveal();
                break;
            case 12:
                // Side: Place 1 Red Rains token on the Chimera.
                this.doAddRedRains();
                // Main: Reveal
                this.doReveal();
                break;
            default:
                throw new Error('Unexpected behaviour roll');
        }
    }

    doLowerOpponentsDice() {
        if (this.owner.opponent.activeNonBasicDiceCount === 0) {
            return;
        }

        const ability = this.behaviour({
            title: 'Chimera Behaviour',
            target: {
                player: 'opponent',
                targetsPlayer: true,
                toSelect: 'die',
                mode: 'exactly',
                numDice: Math.min(2, this.owner.opponent.activeNonBasicDiceCount),
                dieCondition: (die) => !die.exhausted && die.level !== Level.Basic,
                owner: 'opponent',
                gameAction: AbilityDsl.actions.lowerDie()
            },
            message: '{0} uses {1} to lower 2 opponent dice'

        });

        const context = ability.createContext(this.owner);
        this.game.resolveAbility(context);
    }
}

VirosBehaviour.id = 'viros-behaviour';

module.exports = VirosBehaviour