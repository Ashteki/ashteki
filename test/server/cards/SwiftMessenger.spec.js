describe('Swift Messenger', function () {
    describe('Swift Messenger in hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'iron-worker', 'salamander-monk'],
                    spellboard: ['summon-butterfly-monk', 'summon-salamander-monk'],
                    hand: ['beast-tamer'],
                    dicepool: ['charm', 'charm', 'sympathy'],
                    archives: ['salamander-monk-spirit']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'illusion', 'illusion', 'ceremonial', 'time'],
                    hand: ['swift-messenger'],
                    archives: ['sleeping-widow']
                }
            });

            this.player2.actions.main = false; // shouldn't need this
            this.fluteMage.tokens.damage = 1;
        });

        it('reaction to play after opponent unit enters play', function () {
            this.player1.play(this.beastTamer);

            expect(this.player2).toBeAbleToSelect(this.swiftMessenger);

            this.player2.clickCard(this.swiftMessenger);

            expect(this.swiftMessenger.location).toBe('play area');
            expect(this.player2.dicepool[5].exhausted).toBe(true);
            expect(this.player2.player.limitedPlayed).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('does not count as reaction when played normally', function () {
            this.player1.endTurn();
            this.player2.play(this.swiftMessenger);
            expect(this.swiftMessenger.location).toBe('play area');
            expect(this.player2.player.limitedPlayed).toBe(0);
            expect(this.player2).toHaveDefaultPrompt();
        });

        it("does not use a main action when played as reaction on controller's turn", function () {
            this.player1.endTurn();
            this.player2.clickDie(0);
            this.player2.clickPrompt('Natural Dice Power');
            this.player2.clickCard(this.salamanderMonk);
            expect(this.player2).toHavePrompt(
                'Any Reactions to Salamander Monk Spirit being played?'
            );
            expect(this.player2).toBeAbleToSelect(this.swiftMessenger);
            this.player2.clickCard(this.swiftMessenger);
            expect(this.swiftMessenger.location).toBe('play area');
            expect(this.player2.actions.main).toBe(true);
        });
    });

    describe('Swift Messenger chain draw', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['beast-tamer'],
                    dicepool: ['charm', 'charm']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    spellboard: [],
                    dicepool: ['time', 'time'],
                    hand: ['swift-messenger'],
                    archives: ['sleeping-widow'],
                    deck: ['swift-messenger', 'swift-messenger']
                }
            });

            this.player2.actions.main = false; // shouldn't need this
        });

        it('reaction should not chain if card drawn is swift messenger', function () {
            this.player2.player.deck = this.player2.deck.filter((c) => c.id === 'swift-messenger');
            this.player1.play(this.beastTamer);
            expect(this.player2).toBeAbleToSelect(this.swiftMessenger);

            this.player2.clickCard('swift-messenger', 'hand');

            expect(this.swiftMessenger.location).toBe('play area');
            expect(this.player2.dicepool[0].exhausted).toBe(true);
            expect(this.player2.player.limitedPlayed).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
