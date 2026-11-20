describe('Gathering Clouds', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'kanna-galeheart',
                inPlay: [],
                dicepool: ['natural', 'natural', 'astral', 'astral'],
                spellboard: ['summon-storm-spirit', 'summon-galewind-hawk'],
                archives: ['cloud-spirit', 'cloud-spirit', 'cloud-spirit', 'cloud-spirit'],
                hand: ['anchornaut', 'hurricane', 'gathering-clouds', 'hammer-knight'],
                discard: ['concentration', 'concentration']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                dicepool: ['divine', 'divine', 'natural', 'natural', 'time', 'time'],
                inPlay: ['beast-tamer', 'blue-jaguar'],
                spellboard: ['chant-of-revenge']
            }
        });
    });

    it('summon 2 cloud spirits, place astral die on pb', function () {
        this.player1.play(this.gatheringClouds);
        this.player1.clickDie(0);
        this.player1.clickDone();

        expect(this.player1.archives.length).toBe(2);
        expect(this.player1.inPlay.length).toBe(2);

        expect(this.kannaGaleheart.isAirborne).toBe(true);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
