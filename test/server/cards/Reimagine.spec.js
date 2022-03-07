describe('Reimagine', function () {
    describe('on dice power used', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    hand: ['rose-fire-dancer'],
                    spellboard: ['reimagine'],
                    dicepool: ['illusion', 'illusion', 'time', 'time'],
                    archives: ['butterfly-monk'],
                    inPlay: ['mist-spirit', 'iron-worker']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'holy-knight'],
                    dicepool: ['illusion', 'illusion', 'time', 'time'],
                    spellboard: []
                }
            });
        });

        /*
        works - use a dice power on a power die
        nopes - resolve a dice power if no cost paid (like new dimona cards)
        */

        it('use time power dice, to place on card', function () {
            this.player1.clickDie(2);
            this.player1.clickPrompt('Time Dice Power');
            this.player1.clickYes();
            this.player1.clickCard(this.ironWorker);
            this.player1.clickDone();
            expect(this.ironWorker.status).toBe(1);
            // this.player1.clickCard(this.reimagine);
            expect(this.reimagine.dieUpgrades.length).toBe(1);
            expect(this.reimagine.exhausted).toBe(true);
        });
    });
});
