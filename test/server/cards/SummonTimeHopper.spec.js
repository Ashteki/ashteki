describe('Summon Time Hopper', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['ice-golem'],
                    spellboard: ['summon-time-hopper'],
                    dicepool: ['time', 'time', 'natural', 'natural'],
                    archives: ['time-hopper', 'time-hopper']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });

            this.player1.inPlay[0].tokens.damage = 1;
        });

        it('should place a time hopper into play', function () {
            this.player1.clickCard(this.summonTimeHopper);
            this.player1.clickPrompt('Summon Time Hopper');

            expect(this.player1.inPlay.length).toBe(2);
            expect(this.player1.inPlay.every((c) => c.damage == 0)).toBe(false);
        });
    });

    describe('Focus 1 Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['time-hopper'],
                    spellboard: ['summon-time-hopper', 'summon-time-hopper'],
                    dicepool: ['time', 'time', 'natural', 'natural'],
                    archives: ['time-hopper', 'time-hopper']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });

            this.player1.inPlay[0].tokens.status = 1;
        });

        it('should add a second time hopper when unexhausted status hopper is in play', function () {
            this.player1.clickCard(this.summonTimeHopper);
            this.player1.clickPrompt('Summon Time Hopper');
            // add a status token
            this.player1.clickDone();
            // add a second? focus may prompt
            this.player1.clickYes();
            // add a status token
            this.player1.clickDone();

            expect(this.player1.inPlay.length).toBe(3);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
