describe('mirror spirit enters play', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['mist-spirit', 'iron-worker'],
                spellboard: ['summon-mirror-spirit'],
                dicepool: ['divine', 'sympathy', 'illusion'],
                archives: ['mirror-spirit']
            },
            player2: {
                phoenixborn: 'rin-northfell',
                inPlay: ['hammer-knight', 'gilder'],
                spellboard: [],
                hand: ['rins-fury'],
                dicepool: ['natural', 'natural']
            }
        });

        this.gilder.tokens.exhaustion = 1;
        this.gilder.tokens.gravityFlux = 1;
        this.mistSpirit.tokens.exhaustion = 2;
        this.ironWorker.tokens.exhaustion = 1;
    });

    it('gets status tokens equal to exhaustion tokens (opponent)', function () {
        this.player1.clickCard(this.summonMirrorSpirit);
        this.player1.clickPrompt('Summon Mirror Spirit');
        this.player1.clickDie(0);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.mirrorSpirit);

        this.player1.clickPrompt("Opponent's");
        expect(this.mirrorSpirit.status).toBe(2);
    });

    it('gets status tokens equal to exhaustion tokens (mine)', function () {
        this.player1.clickCard(this.summonMirrorSpirit);
        this.player1.clickPrompt('Summon Mirror Spirit');
        this.player1.clickDie(0);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.mirrorSpirit);

        this.player1.clickPrompt('Mine');
        expect(this.mirrorSpirit.status).toBe(3);
    });
});
