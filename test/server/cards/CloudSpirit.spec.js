describe('Cloud Spirit', function () {
    describe('disperse - when single in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['cloud-spirit', 'anchornaut'],
                    dicepool: ['divine', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: ['close-combat', 'power-through']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker', 'salamander-monk-spirit'],
                    spellboard: ['summon-iron-rhino'],
                    hand: ['molten-gold'],
                    dicepool: ['natural', 'natural', 'charm', 'charm']
                }
            });
        });

        it('discard at end of round', function () {
            this.player1.endTurn();
            this.player2.endTurn();
            // dice pins
            this.player1.clickDone();
            this.player2.clickDone();
            expect(this.game.round).toBe(2);
            expect(this.cloudSpirit.location).toBe('archives');
        });
    });

    describe('disperse - when multiple in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['cloud-spirit', 'cloud-spirit'],
                    dicepool: ['divine', 'illusion', 'charm', 'charm'],
                    spellboard: [],
                    hand: ['close-combat', 'power-through']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker', 'salamander-monk-spirit'],
                    spellboard: ['summon-iron-rhino'],
                    hand: ['molten-gold'],
                    dicepool: ['natural', 'natural', 'charm', 'charm']
                }
            });
        });

        it('disperse when only one in play', function () {
            this.player1.endTurn();
            this.player2.endTurn();
            // dice pins
            this.player1.clickDone();
            this.player2.clickDone();
            expect(this.game.round).toBe(2);
            expect(this.cloudSpirit.location).toBe('play area');
        });
    });
});