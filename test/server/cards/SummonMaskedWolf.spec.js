describe('Summon Masked Wolf', function () {
    describe('Summon Masked Wolf ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: [],
                    spellboard: ['summon-masked-wolf', 'summon-masked-wolf'],
                    dicepool: ['natural', 'illusion', 'illusion', 'charm'],
                    archives: ['masked-wolf', 'masked-wolf']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should place a masked wolf into play', function () {
            this.player1.clickCard(this.summonMaskedWolf);
            this.player1.clickPrompt('Summon Masked Wolf');
            this.player1.clickCard(this.player1.archives[0]);
            expect(this.player1).toHavePrompt('Select dice');
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.player1.archives[0]);

            expect(this.player1.inPlay.length).toBe(1);
        });

        it('should not autosubmit on dice choice', function () {
            this.player1.dicepool[1].level = 'class';
            this.player1.clickCard(this.summonMaskedWolf);
            this.player1.clickPrompt('Summon Masked Wolf');
            expect(this.player1).toHavePrompt('Select dice');

            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.player1.archives[0]);

            expect(this.player1.inPlay.length).toBe(1);
        });

        it('should refresh side action if wolf was spent and focussed', function () {
            expect(this.player1.dicepool[1].level).toBe('power');
            expect(this.player1.dicepool[2].level).toBe('power');
            this.player1.clickCard(this.summonMaskedWolf);
            this.player1.clickPrompt('Summon Masked Wolf');
            this.player1.clickDie(1); // unselect auto class die
            this.player1.clickDie(2); // select wolf
            this.player1.clickPrompt('Done');

            this.player1.clickCard(this.player1.archives[0]);

            expect(this.player1.inPlay.length).toBe(1);
            expect(this.player1.actions.side).toBe(true);
        });

        it('should not refresh side action if no wolf was spent', function () {
            // lower the illusion dice to class level
            this.player1.dicepool[1].lower();
            this.player1.dicepool[2].lower();
            expect(this.player1.dicepool[1].level).toBe('class');
            expect(this.player1.dicepool[2].level).toBe('class');

            this.player1.clickCard(this.summonMaskedWolf);
            this.player1.clickPrompt('Summon Masked Wolf');
            this.player1.clickPrompt('Done');

            this.player1.clickCard(this.player1.archives[0]);

            expect(this.player1.inPlay.length).toBe(1);
            expect(this.player1.actions.side).toBe(false);
        });
    });
});
