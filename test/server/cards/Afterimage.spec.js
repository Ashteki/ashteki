describe('AfterImage reaction', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['seaside-raven', 'iron-worker'],
                spellboard: ['summon-butterfly-monk'],
                dicepool: ['natural', 'natural']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'mist-spirit'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'illusion', 'time'],
                hand: ['afterimage']
            }
        });
    });

    it('triggers on ally destroyed', function () {
        expect(this.ironWorker.location).toBe('play area');
        this.player1.clickCard(this.aradelSummergaard);
        this.player1.clickPrompt('Water Blast');
        this.player1.clickCard(this.fluteMage);

        this.player2.clickCard(this.afterimage);
        this.player2.clickCard(this.ironWorker);
        expect(this.ironWorker.location).toBe('discard');
        expect(this.fluteMage.location).toBe('hand');
    });

    it('no trigger on conjuration destroyed', function () {
        expect(this.ironWorker.location).toBe('play area');
        this.player1.clickCard(this.aradelSummergaard);
        this.player1.clickPrompt('Water Blast');
        this.player1.clickCard(this.mistSpirit);

        this.player2.clickCard(this.afterimage); // does not trigger
        expect(this.mistSpirit.location).toBe('archives');

        expect(this.player1).toHaveDefaultPrompt();
    });
});
