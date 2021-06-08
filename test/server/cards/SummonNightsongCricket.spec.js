describe('Summon Nightsong Cricket', function () {
    describe('Summon Nightsong Cricket ability', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: [],
                    spellboard: ['summon-nightsong-cricket', 'summon-nightsong-cricket'],
                    dicepool: ['natural', 'sympathy', 'sympathy', 'charm'],
                    archives: ['nightsong-cricket', 'nightsong-cricket'],
                    discard: ['iron-worker']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    discard: ['iron-worker']
                }
            });
            this.player1.dicepool[1].level = 'class';
        });

        it('should place a cricket into play', function () {
            this.player1.clickCard(this.summonNightsongCricket);
            this.player1.clickPrompt('Summon Nightsong Cricket');
            this.player1.clickDie(0);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.player1.archives[0]);

            expect(this.player1.inPlay.length).toBe(1);
        });

        it('should purge if power was spent and focussed', function () {
            expect(this.player1.dicepool[1].level).toBe('class');
            expect(this.player1.dicepool[2].level).toBe('power');
            this.player1.clickCard(this.summonNightsongCricket);
            this.player1.clickPrompt('Summon Nightsong Cricket');
            this.player1.clickDie(0);
            this.player1.clickDie(1); // unselect auto class die
            this.player1.clickDie(2); // select power
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.player1.archives[0]);

            expect(this.player1.inPlay.length).toBe(1);
            this.player1.clickCard(this.player2.discard[0]);

            expect(this.player2.player.purged.length).toBe(1);
        });

        it('can purge my own card if power was spent and focussed', function () {
            expect(this.player1.dicepool[1].level).toBe('class');
            expect(this.player1.dicepool[2].level).toBe('power');
            this.player1.clickCard(this.summonNightsongCricket);
            this.player1.clickPrompt('Summon Nightsong Cricket');
            this.player1.clickDie(0);
            this.player1.clickDie(1); // unselect auto class die
            this.player1.clickDie(2); // select power
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.player1.archives[0]);

            expect(this.player1.inPlay.length).toBe(1);
            this.player1.clickCard(this.player1.discard[0]);

            expect(this.ironWorker.location).toBe('purged');
        });
    });
});
