describe('Summon Thunder Hulk', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'issa-brightmore',
                    spellboard: ['summon-thunder-hulk'],
                    dicepool: ['artifice', 'artifice', 'natural', 'natural'],
                    archives: ['thunder-hulk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should place a thunder hulk', function () {
            this.player1.clickCard(this.summonThunderHulk);
            this.player1.clickPrompt('Summon Thunder Hulk');
            this.player1.clickDie(2);
            this.player1.clickDone();
            expect(this.thunderHulk.location).toBe('play area');
            expect(this.thunderHulk.isCharged).toBe(false);
            expect(this.thunderHulk.checkRestrictions('attack')).toBe(false);

            this.player1.useCardAbility(this.issaBrightmore, 'Inspiration');
            this.player1.clickDie(1);
            this.player1.clickCard(this.thunderHulk);
            expect(this.thunderHulk.isCharged).toBe(true);
            expect(this.thunderHulk.checkRestrictions('attack')).toBe(true);
        });
    });
});
