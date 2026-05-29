describe('Snapseed', function () {
    describe('wilt - when uncharged', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['snapseed', 'anchornaut'],
                    dicepool: ['artifice', 'artifice', 'charm', 'charm'],
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
            expect(this.snapseed.location).toBe('archives');
        });
    });

    describe('wilt - when alteration attached', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['snapseed', 'anchornaut'],
                    dicepool: ['divine', 'natural', 'charm', 'charm'],
                    spellboard: [],
                    hand: ['close-combat', 'aspiring-growth']
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

        it('survives the round', function () {
            this.player1.attachUpgrade(this.aspiringGrowth, this.snapseed);
            expect(this.snapseed.upgrades.length).toBe(1);
            this.player1.endTurn();
            this.player2.endTurn();
            // dice pins
            this.player1.clickDone();
            this.player2.clickDone();
            expect(this.game.round).toBe(2);
            expect(this.snapseed.location).toBe('play area');
        });
    });
});