describe('Snapseed', function () {
    describe('Solar Sprout', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['snapseed', 'anchornaut'],
                    dicepool: ['artifice', 'artifice', 'charm', 'charm'],
                    spellboard: [],
                    hand: ['close-combat', 'power-through'],
                    archives: ['snaptrap', 'floral-tyrant']
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

        it('when charged discards for a snaptrap, then again for a floral tyrant', function () {
            this.player1.useDie(0);
            this.player1.clickCard(this.snapseed);
            expect(this.snapseed.isCharged).toBe(true);
            this.player1.clickCard(this.snapseed);
            this.player1.clickPrompt('Solar Sprout');

            expect(this.snapseed.location).toBe('archives');
            expect(this.snaptrap.location).toBe('play area');

            this.player1.endTurn();
            this.player2.endTurn();

            this.player1.useDie(0);
            this.player1.clickCard(this.snaptrap);
            expect(this.snaptrap.isCharged).toBe(true);
            this.player1.clickCard(this.snaptrap);
            this.player1.clickPrompt('Solar Bloom');

            expect(this.snaptrap.location).toBe('archives');
            expect(this.floralTyrant.location).toBe('play area');
        });
    });

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