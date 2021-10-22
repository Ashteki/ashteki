describe('Stasis', function () {
    describe('Stasis In Hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'iron-worker', 'squall-stallion'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage'],
                    spellboard: [],
                    dicepool: [
                        'time',
                        'natural',
                        'illusion',
                        'illusion',
                        'ceremonial',
                        'ceremonial'
                    ],
                    hand: ['stasis', 'summon-sleeping-widows'],
                    archives: ['sleeping-widow']
                }
            });

            this.player2.actions.main = false; // shouldn't need this
            this.fluteMage.tokens.damage = 1;
        });

        it('reaction on attack', function () {
            expect(this.fluteMage.damage).toBe(1);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.fluteMage); // target
            this.player1.clickCard(this.mistSpirit); // single attacker

            expect(this.player2).toHavePrompt('Any reactions to attackers being declared?');
            expect(this.player2).toBeAbleToSelect(this.stasis);
            expect(this.mistSpirit.location).toBe('play area'); // not killed yet

            this.player2.clickCard(this.stasis);
            expect(this.player2).toBeAbleToSelect(this.mistSpirit);
            expect(this.player2).not.toBeAbleToSelect(this.squallStallion);
            this.player2.clickCard(this.mistSpirit);

            expect(this.stasis.parent).toBe(this.mistSpirit);
            expect(this.stasis.controller).toBe(this.player1.player);
            expect(this.player2.dicepool[0].exhausted).toBe(true);

            // attack was effectively cancelled. MS exhausted, but still in play
            expect(this.mistSpirit.location).toBe('play area');
            expect(this.mistSpirit.exhausted).toBe(true);
            expect(this.stasis.location).toBe('play area');

            expect(this.player2.player.limitedPlayed).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('does not count as reaction when played normally', function () {
            this.player1.endTurn();
            this.player2.play(this.stasis);
            this.player2.clickCard(this.mistSpirit);

            expect(this.stasis.location).toBe('play area');
            expect(this.player2.player.limitedPlayed).toBe(0);
        });
    });

    describe('Stasis In Hand', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'iron-worker', 'squall-stallion'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage'],
                    spellboard: ['law-of-sight'],
                    dicepool: [
                        'time',
                        'natural',
                        'illusion',
                        'illusion',
                        'ceremonial',
                        'ceremonial'
                    ],
                    hand: ['stasis', 'summon-sleeping-widows'],
                    archives: ['sleeping-widow']
                }
            });

            this.player2.actions.main = false; // shouldn't need this
            this.fluteMage.tokens.damage = 1;
        });

        it('reaction vs Law of Sight', function () {
            expect(this.fluteMage.damage).toBe(1);

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.fluteMage); // target
            this.player1.clickCard(this.mistSpirit); // single attacker

            // no reaction because of law of sight
            expect(this.player2).not.toHavePrompt('Any reactions to attackers being declared?');
            expect(this.player2).not.toBeAbleToSelect(this.stasis);
            this.player2.clickDone(); // guard;
            this.player2.clickNo(); // counter
            expect(this.fluteMage.location).toBe('discard'); // killed

            expect(this.player2.player.limitedPlayed).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
