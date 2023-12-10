describe('Summon Bastion Badger', function () {
    describe('Action when not focused', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['hammer-knight', 'anchornaut'],
                    dicepool: ['natural', 'time', 'charm', 'charm', 'time', 'illusion'],
                    spellboard: ['summon-bastion-badger'],
                    archives: ['bastion-badger'],
                    deck: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural'],
                    inPlay: ['iron-worker'],
                    spellboard: ['chant-of-revenge']
                }
            });

            this.player1.dicepool[2].level = 'basic';
        });

        it('summon then raise one active charm die', function () {
            this.player1.clickCard(this.summonBastionBadger);
            this.player1.clickPrompt('Summon Bastion Badger');
            this.player1.clickDie(0);
            this.player1.clickDone();
            //don't require action type selection
            expect(this.bastionBadger.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a charm die to raise');
            this.player1.clickDie(2);
            expect(this.player1.dicepool[2].level).toBe('class');
        });
    });
});
