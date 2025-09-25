describe('Realization', function () {
    describe('Empty Deck', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                    hand: [],
                    discard: ['purge', 'anchornaut', 'abundance', 'summon-gilder'],
                    deck: [],
                    spellboard: ['realization']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('with empty deck, shuffle discard, reveal and purge one, one to hand', function () {
            this.player1.clickCard(this.realization);
            this.player1.clickPrompt('Use Ability');
            expect(this.player1.discard.length).toBe(2);
            expect(this.player1.player.purged.length).toBe(1);
            expect(this.player1.hand.length).toBe(1);
        });
    });

    describe('Deck with cards', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                    hand: [],
                    discard: ['purge', 'anchornaut', 'abundance', 'summon-gilder'],
                    deck: ['iron-worker', 'open-memories', 'summon-gilder'],
                    spellboard: ['realization']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('without empty deck no effect', function () {
            this.player1.clickCard(this.realization);
            expect(this.player1.discard.length).toBe(4);
            expect(this.player1.player.purged.length).toBe(0);
            expect(this.player1.hand.length).toBe(0);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
