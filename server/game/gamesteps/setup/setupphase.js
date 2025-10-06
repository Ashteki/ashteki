const moment = require('moment');
const _ = require('underscore');
const Phase = require('../phase.js');
const SimpleStep = require('../simplestep.js');
const FirstFivePrompt = require('./FirstFivePrompt.js');

class SetupPhase extends Phase {
    constructor(game) {
        super(game, 'setup');
        this.initialise([
            new SimpleStep(game, () => this.setupBegin()),
            new SimpleStep(game, () => this.setupChimera()),
            new FirstFivePrompt(game),
            new SimpleStep(game, () => this.startGame())
        ]);
    }

    startPhase() {
        this.game.currentPhase = this.name;
        for (let step of this.steps) {
            this.game.queueStep(step);
        }

        for (const player of this.game.getPlayers()) {
            this.game.addMessage('{0} brings {1} to battle', player, player.phoenixborn);
            if (player.isDummy) {
                this.game.addMessage(
                    'Chimera is at {0} level {1}',
                    this.game.soloLevel === 'H' ? 'Heroic' : 'Standard',
                    this.game.soloStage
                );
            }
        }
    }

    setupBegin() {
        for (let card of this.game.allCards) {
            card.applyAnyLocationPersistentEffects();
        }
    }

    setupChimera() {
        if (this.game.solo) {
            const dummy = this.game.getDummyPlayer();
            dummy.setupAspects();
        }
    }

    startGame() {
        _.each(this.game.getPlayers(), (player) => {
            player.readyToStart = true;
            player.recordHand();
        });
        this.game.raiseEvent('onGameStarted');
        this.game.addMessage(
            'Game started at: {0}',
            moment(this.game.startedAt).format('DD-MM-yy hh:mm')
        );
    }
}

module.exports = SetupPhase;
