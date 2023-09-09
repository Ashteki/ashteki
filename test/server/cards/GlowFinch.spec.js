describe('Glow Finch', function () {
    describe('PvP', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blood-shaman'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm'],
                    hand: ['molten-gold', 'redirect', 'out-of-the-mist', 'cover'],
                    deck: ['molten-gold', 'redirect', 'out-of-the-mist', 'cover']
                },
                player2: {
                    phoenixborn: 'maeoni-viper',
                    inPlay: ['glow-finch', 'iron-worker'],
                    hand: ['out-of-the-mist'],
                    dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
                }
            });

            this.aradelSummergaard.tokens.damage = 1;
            this.player1.dicepool[0].lower();
        });

        it('adds a forced discard from top of deck on destroyed', function () {
            let cardCount = this.player1.deck.length;
            this.player1.clickCard(this.moltenGold);
            this.player1.clickPrompt('Play this action');
            this.player1.clickCard(this.glowFinch);
            this.player2.clickPrompt('Yes');

            expect(this.player1.deck.length).toBe(cardCount - 2); // -1 for playing mg, -2 for glowFinch
        });
    });

    describe('Vs Chimera (fatigued)', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                allowSetup: true,
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['glow-finch', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['abundance'],
                    deck: ['anchornaut', 'iron-worker']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: [],
                    spellboard: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
            this.player2.player.fatigued = true;
        });

        it('adds a forced discard from top of deck on destroyed', function () {
            let cardCount = this.player2.deck.length;

            this.player1.clickDie(0);
            this.player1.clickPrompt('Natural Dice Power');
            this.player1.clickCard(this.glowFinch);
            this.player1.clickPrompt('Yes');

            expect(this.glowFinch.location).toBe('archives');
            expect(this.player2.deck.length).toBe(cardCount - 2);
            expect(this.virosS1.damage).toBe(2);
        });
    });
});
