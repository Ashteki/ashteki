describe('Aftershock attacks', function () {
    describe('vs units with static attack', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight', 'frost-fang']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker', 'false-demon'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['anchornaut']
                }
            });
        });

        it('triggers when destroying a unit', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.anchornaut); // target
            this.player1.clickCard(this.hammerKnight); // single attacker
            this.player2.clickPrompt('Done'); // no guard
            this.player2.clickPrompt('Yes'); // counter

            expect(this.player1).toHavePrompt('Aftershock 1');
            expect(this.player1).toBeAbleToSelect(this.ironWorker);
        });

        it('triggers even when unit itself is destroyed', function () {
            this.hammerKnight.tokens.damage = 2;

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.falseDemon); // target
            this.player1.clickCard(this.hammerKnight); // single attacker
            this.player2.clickPrompt('Done'); // no guard
            this.player2.clickPrompt('Yes'); // counter

            expect(this.player1).toHavePrompt('Aftershock 1');
            expect(this.player1).toBeAbleToSelect(this.ironWorker);
            this.player1.clickCard(this.ironWorker);
            expect(this.falseDemon.location).toBe('archives');
            expect(this.hammerKnight.location).toBe('discard');
        });
    });
});
