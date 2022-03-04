describe('Rayward Knight ', function () {
    describe('Enters play effect', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['mist-spirit'],
                    dicepool: ['natural', 'illusion', 'time', 'ceremonial'],
                    hand: ['rayward-knight'],
                    discard: ['hammer-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['particle-shield', 'safeguard']
                }
            });
        });

        it('To Arms returns an Ally', function () {
            this.player1.clickCard(this.raywardKnight);
            this.player1.clickPrompt('Play this Ally');
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDie(2);
            this.player1.clickDone();
            expect(this.raywardKnight.location).toBe('play area');

            expect(this.player1).toHavePrompt('Choose up to 1 ally to shuffle into your deck');

            this.player1.clickCard(this.hammerKnight); // in discard
            expect(this.hammerKnight.location).not.toBe('discard');
        });
    });
    describe('Charge', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['rayward-knight'],
                    dicepool: ['natural', 'illusion', 'time', 'ceremonial'],
                    discard: ['hammer-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['safeguard']
                }
            });
        });

        it('attacks a unit', function () {
            this.player1.clickCard(this.raywardKnight);
            this.player1.clickPrompt('Charge');

            this.player1.clickCard(this.ironWorker); // attack Iron Worker
            // no need to declare the attacker;

            this.player2.clickPrompt('Done'); // no guard
            this.player2.clickPrompt('No'); // no counter

            expect(this.ironWorker.location).toBe('discard');
            expect(this.raywardKnight.tokens.damage).toBeUndefined();
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
