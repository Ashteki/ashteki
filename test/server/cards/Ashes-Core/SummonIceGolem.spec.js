describe('Summon Ice Golem', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['ice-golem'],
                    spellboard: ['summon-ice-golem'],
                    dicepool: ['natural', 'natural', 'natural', 'natural'],
                    archives: ['ice-golem', 'ice-golem']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });

            this.player1.inPlay[0].tokens.damage = 1;
        });

        it('should place an ice golem into play', function () {
            this.player1.clickCard(this.summonIceGolem);
            this.player1.clickPrompt('Summon Ice Golem');
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.player1.archives[0]);

            expect(this.player1.inPlay.length).toBe(2);
            expect(this.player1.inPlay.every((c) => c.damage == 0)).toBe(false);
        });
    });

    describe('Focus 2 Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['ice-golem'],
                    spellboard: ['summon-ice-golem', 'summon-ice-golem', 'summon-ice-golem'],
                    dicepool: ['natural', 'natural', 'natural', 'natural'],
                    archives: ['ice-golem']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });

            this.player1.inPlay[0].tokens.damage = 1;
        });

        it('should place an ice golem into play', function () {
            expect(this.player1.inPlay[0].damage).toBe(1);
            this.player1.clickCard(this.summonIceGolem);
            this.player1.clickPrompt('Summon Ice Golem');
            this.player1.clickDie(3);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.player1.archives[0]);

            expect(this.player1.inPlay.length).toBe(2);
            expect(this.player1.inPlay.every((c) => c.damage == 0)).toBe(true);
        });
    });
});
