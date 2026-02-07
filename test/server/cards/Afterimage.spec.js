describe('AfterImage reaction', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['seaside-raven', 'iron-worker'],
                spellboard: ['summon-seaside-raven'],
                dicepool: ['natural', 'natural', 'time', 'illusion'],
                archives: ['seaside-raven']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'mist-spirit', 'wolfpack-leader'],
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

    it('Bug report: raven vs wolfpack vs afterimage', function () {
        this.player1.clickCard(this.summonSeasideRaven);
        this.player1.clickPrompt('Summon Seaside Raven');
        this.player1.clickDie(0);
        this.player1.clickDie(1);
        this.player1.clickDie(2);
        this.player1.clickDone();
        this.player1.clickCard(this.wolfpackLeader);

        this.player2.clickCard(this.afterimage);
        this.player2.clickCard(this.seasideRaven);
        expect(this.seasideRaven.location).toBe('archives');
        expect(this.wolfpackLeader.location).toBe('hand');
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
