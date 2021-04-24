describe('drain vitality', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker', 'anchornaut'],
                dicepool: ['natural', 'ceremonial', 'ceremonial', 'sympathy'],
                hand: [],
                spellboard: ['drain-vitality']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['hammer-knight', 'mist-spirit'],
                spellboard: ['summon-butterfly-monk']
            }
        });
        this.ironWorker.tokens.damage = 1;
        this.anchornaut.tokens.status = 1;
    });

    it('damage action', function () {
        this.player1.clickCard(this.drainVitality);
        this.player1.clickPrompt('Damage');

        this.player1.clickCard(this.hammerKnight);
        this.player1.clickCard(this.ironWorker);

        expect(this.hammerKnight.damage).toBe(1);
        expect(this.ironWorker.damage).toBe(0);
    });

    it('status action', function () {
        this.player1.clickCard(this.drainVitality);
        this.player1.clickPrompt('Status');

        this.player1.clickCard(this.anchornaut);
        this.player1.clickCard(this.ironWorker);

        expect(this.anchornaut.status).toBe(0);
        expect(this.ironWorker.status).toBe(1);
    });
});
