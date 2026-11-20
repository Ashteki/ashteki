describe('Hostage', function () {
    describe('discard', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'tash-cantasita',
                    inPlay: ['bastion-badger', 'mist-spirit'],
                    spellboard: ['summon-butterfly-monk'],
                    dicepool: ['charm', 'divine'],
                    hand: ['hostage', 'summon-gilder']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker', 'flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['purge', 'mist-typhoon']
                }
            });
        });

        it('pay ransom card to discard and opponent draws a card', function () {
            this.player1.attachUpgrade(this.hostage, this.ironWorker);
            expect(this.ironWorker.exhausted).toBe(true);

            this.player1.endTurn();
            expect(this.player1.hand.length).toBe(1);
            this.player2.useCardAbility(this.hostage, 'Ransom');
            this.player2.clickCard(this.purge);
            expect(this.purge.location).toBe('discard');
            expect(this.player2).toHaveDefaultPrompt();
            expect(this.player1.hand.length).toBe(2);
        });
    });
});
