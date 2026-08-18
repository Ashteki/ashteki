const ChimeraDefenceStrategy = require('./ChimeraDefenceStrategy');
const ChimeraPlayer = require('./ChimeraPlayer');

class DragonbornPlayer extends ChimeraPlayer {
    constructor(id, user, owner, game, clockdetails) {
        super(id, user, owner, game, clockdetails);
        this.defenderStrategy = new ChimeraDefenceStrategy(this, game);
        this.stamina = 2; // Dragonborn start with 2 stamina for 1 player game;
    }
    get isDragonborn() {
        return true;
    }

    get isChimera() {
        return false;
    }

    onFullDice(context) {
        this.game.actions
            .addStatusToken({ showMessage: true, shortMessage: true, warnMessage: true })
            .resolve(this.phoenixborn, context);
    }

    triggerProgressAbility() {
        const ultAbility = this.ultimate.getProgressAbility(this.chimeraPhase);
        this.game.cardUsed(this.ultimate.createSnapshot(), this);
        const context = ultAbility.createContext(this);

        this.game.queueUserAlert(context, {
            style: 'danger',
            promptTitle: 'Dragon Phase',
            menuTitle: 'Dragonborn resolves the Progress Ability of their Ready Spell',
            controls: [
                {
                    type: 'targeting',
                    source: this.ultimate.getShortSummary()
                }
            ]
        });

        this.game.resolveAbility(context);
    }

    applyFatigue() {
        super.applyFatigue();
        this.phoenixborn.exhaust();
    }

    unExhaustReadySpell() {
        const unexhaustAbility = this.ultimate.getUnexhaustAbility();
        const context = unexhaustAbility.createContext(this);
        this.game.resolveAbility(context);
    }

    getRandomArrow() {
        const arrows = this.archives.filter((c) => c.id.includes('arrow'));
        const randomIndex = Math.floor(Math.random() * arrows.length);
        return arrows[randomIndex].id;
    }
}

module.exports = DragonbornPlayer;
