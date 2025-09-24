describe('Cataclysm', function () {
    describe('action spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight', 'iron-worker'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    hand: ['cataclysm'],
                    archives: ['spark', 'rubble-spirit', 'rubble-spirit']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['natural', 'natural', 'ceremonial', 'charm'],
                    hand: [],
                    inPlay: ['mist-spirit', 'anchornaut']
                }
            });
        });

        it('deals damage to every unit and pb', function () {
            this.player1.play(this.cataclysm);
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickCard(this.luluFirststone);
            this.player1.clickCard(this.aradelSummergaard);
            expect(this.hammerKnight.location).toBe('play area');
            expect(this.anchornaut.location).toBe('discard');
            expect(this.ironWorker.location).toBe('play area');
            expect(this.mistSpirit.location).toBe('archives');
            expect(this.rubbleSpirit.location).toBe('play area');
            expect(this.luluFirststone.damage).toBe(1);
            expect(this.aradelSummergaard.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
