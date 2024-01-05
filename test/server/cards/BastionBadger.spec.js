describe('Bastion Badger', function () {
    describe('attack buff', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['bastion-badger', 'mist-spirit'],
                    spellboard: ['summon-butterfly-monk'],
                    dicepool: ['charm', 'divine']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker', 'flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['anchornaut']
                }
            });
        });

        it('increases own attack as attacker - unit attack', function () {
            this.player1.clickDie(0);
            this.player1.clickPrompt('Charm Dice Power');
            this.player1.clickCard(this.ironWorker);

            expect(this.bastionBadger.attack).toBe(1);
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.ironWorker); // target
            this.player1.clickCard(this.bastionBadger); // single attacker
            expect(this.bastionBadger.attack).toBe(3);
            this.player2.clickPrompt('Done'); // no guard
            this.player2.clickNo();
            expect(this.bastionBadger.attack).toBe(1);
        });

        it('increases own attack as target - unit atack', function () {
            this.player1.clickDie(0);
            this.player1.clickPrompt('Charm Dice Power');
            this.player1.clickCard(this.ironWorker);

            this.player1.endTurn();
            expect(this.bastionBadger.attack).toBe(1);
            this.player2.clickPrompt('Attack');
            this.player2.clickCard(this.bastionBadger); // target
            this.player2.clickCard(this.ironWorker);
            expect(this.bastionBadger.attack).toBe(3);
            this.player1.clickPrompt('Done'); // no guard
            this.player1.clickNo();
            expect(this.bastionBadger.attack).toBe(1);
        });

        it('no increase with no die', function () {
            this.player1.endTurn();
            expect(this.bastionBadger.attack).toBe(1);
            this.player2.clickPrompt('Attack');
            this.player2.clickCard(this.bastionBadger); // target
            this.player2.clickCard(this.ironWorker);
            expect(this.bastionBadger.attack).toBe(1);
            this.player1.clickPrompt('Done'); // no guard
            this.player1.clickNo();
            expect(this.bastionBadger.attack).toBe(1);
        });
    });
});
