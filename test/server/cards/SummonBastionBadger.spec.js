describe('Summon Bastion Badger', function () {
    describe('Action when not focused', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['hammer-knight', 'anchornaut'],
                    dicepool: ['natural', 'charm', 'charm', 'charm', 'charm', 'illusion'],
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
            this.player1.dicepool[3].level = 'class';
            this.player1.dicepool[1].level = 'class';
        });

        it('summon then raise one active charm class die', function () {
            this.player1.clickCard(this.summonBastionBadger);
            this.player1.clickPrompt('Summon Bastion Badger');
            this.player1.clickDie(0);
            this.player1.clickDone();
            expect(this.player1.dicepool[1].exhausted).toBe(true);
            //don't require action type selection
            expect(this.bastionBadger.location).toBe('play area');
            expect(this.player1).toHavePrompt('Choose a charm class die to raise');
            this.player1.clickDie(2);
            expect(this.player1.dicepool[2].level).toBe('basic');
            this.player1.clickDie(3);
            expect(this.player1.dicepool[3].level).toBe('power');
        });
    });
});
