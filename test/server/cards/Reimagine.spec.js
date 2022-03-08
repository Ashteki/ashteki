describe('Reimagine', function () {
    describe('on dice power used', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    hand: ['rose-fire-dancer', 'ensnare', 'hidden-power'],
                    spellboard: ['reimagine'],
                    dicepool: ['illusion', 'time'],
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
            this.player1.clickDie(1);
            this.player1.clickPrompt('Time Dice Power');
            this.player1.clickYes();
            this.player1.clickCard(this.ironWorker);
            this.player1.clickDone();
            expect(this.ironWorker.status).toBe(1);
            // this.player1.clickCard(this.reimagine);
            expect(this.reimagine.dieUpgrades.length).toBe(1);
            expect(this.reimagine.exhausted).toBe(true);
        });

        it('spend hosted dice on a reaction', function () {
            // set up
            const targetDie = this.player1.dicepool[0];
            this.player1.clickDie(0);
            this.player1.clickPrompt('Illusion Dice Power');
            this.player1.clickYes();
            this.player1.clickOpponentDie(0);
            this.player1.clickDone();
            expect(this.reimagine.dieUpgrades.length).toBe(1);
            expect(this.reimagine.exhausted).toBe(true);
            expect(targetDie.exhausted).toBe(false); // hosted die is ready

            // use as reaction payment
            this.player1.clickAttack(this.holyKnight);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickCard(this.coalRoarkwin); // guard
            expect(this.player1).not.toHaveDefaultPrompt();
            this.player1.clickCard(this.ensnare);
            this.player1.clickDieUpgrade(this.reimagine, 0);
            expect(this.coalRoarkwin.damage).toBe(2 + 2); // IW damage plus ensnsare damage
            expect(targetDie.exhausted).toBe(true); // hosted die is spent
            expect(targetDie.location).toBe('dicepool');
        });

        it('cannot spend hosted dice on action spell', function () {
            // set up
            const targetDie = this.player1.dicepool[0];
            this.player1.clickDie(0);
            this.player1.clickPrompt('Illusion Dice Power');
            this.player1.clickYes();
            this.player1.clickOpponentDie(0);
            this.player1.clickDone();
            expect(this.reimagine.dieUpgrades.length).toBe(1);
            expect(this.reimagine.exhausted).toBe(true);
            expect(targetDie.exhausted).toBe(false); // hosted die is ready

            expect(this.player1).toHaveDefaultPrompt();

            // cannot spend on action spell
            expect(this.player1).not.toBeAbleToSelect(this.hiddenPower);
            this.player1.clickCard(this.hiddenPower);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
