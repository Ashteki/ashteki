const Behaviour = require('../../../solo/Behaviour');
const BehaviourCard = require('../../../solo/BehaviourCard');
const SplitBehaviour = require('../../../solo/SplitBehaviour');

class ScathaBehaviour extends BehaviourCard {
    getBehaviour(level) {
        switch (level) {
            case 'basic':
                return new Behaviour(level, { main: 'Attack, if able. If not, Reveal.' }, () =>
                    this.canAttack() ? this.doAttack() : this.doReveal()
                );
            case 'class':
                return new SplitBehaviour(
                    level,
                    {
                        side: "Activate the Dragonborn's ready spell.",
                        main: 'Reveal'
                    },
                    () => {
                        // Main: Reveal
                        this.doReveal();
                    },
                    () => {
                        // Side: Target opposing player must lower 2 non-basic dice in their active pool one level.
                        this.owner.triggerUltimateAbility();
                    }
                );
            case 'power':
                // Main: Reveal. Attack with revealed aspect
                return new Behaviour(
                    level,
                    { main: 'Reveal. Attack with revealed aspect.' },
                    () => this.doAttack(this.doReveal())
                );

            default:
                throw new Error('Unexpected behaviour roll');
        }
    }
}

ScathaBehaviour.id = 'scatha-behaviour';

module.exports = ScathaBehaviour;
