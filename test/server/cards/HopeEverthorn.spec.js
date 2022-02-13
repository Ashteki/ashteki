describe('Hope Everthorn', function () {
    describe('Duplicate', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'hope-everthorn',
                    inPlay: ['butterfly-monk'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: [],
                    archives: ['butterfly-monk']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['flute-mage']
                }
            });
        });

        it('duplicates', function () {
            this.player1.clickCard(this.hopeEverthorn);
            this.player1.clickPrompt('Duplicate');
            this.player1.clickDie(0);
            //this.player1.clickDone();
            this.player1.clickCard(this.butterflyMonk);
            //this.player1.clickPrompt('Duplicate');
            expect(this.player1.archives.length).toBe(0);
            this.player1.clickPrompt('End Turn');
            expect(this.player1.archives.length).toBe(1);
        });
    });
});
