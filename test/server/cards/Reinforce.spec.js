describe('Reinforce Action Spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'orrick-gilstream',
                inPlay: ['flute-mage'],
                dicepool: ['divine', 'divine', 'natural', 'natural', 'time', 'time'],
                spellboard: ['concentration'],
                hand: ['reinforce'],
                archives: ['the-awakened-state'],
                deck: [
                    'anchornaut',
                    'recollect',
                    'piercing-light',
                    'hammer-knight',
                    'massive-growth'
                ],
                discard: ['concentration', 'concentration']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                dicepool: ['natural'],
                inPlay: ['iron-worker'],
                spellboard: ['chant-of-revenge']
            }
        });
    });

    it('take an ally to hand, but not allow action spell', function () {
        this.player1.play(this.reinforce);
        this.player1.clickPrompt('recollect'); // should not move
        expect(this.recollect.location).toBe('deck');
        this.player1.clickPrompt('piercing light'); // should not move
        expect(this.piercingLight.location).toBe('deck');

        this.player1.clickPrompt('anchornaut');
        expect(this.anchornaut.location).toBe('hand');
        this.player1.clickYes();
        this.player1.clickDie(3);
        this.player1.clickCard(this.ironWorker);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('take an alteration to hand', function () {
        this.player1.play(this.reinforce);
        this.player1.clickPrompt('Massive Growth');
        expect(this.massiveGrowth.location).toBe('hand');
    });

    it('can avoid taking card to hand', function () {
        this.player1.play(this.reinforce);
        this.player1.clickPrompt('Done');
        expect(this.player1).toHaveDefaultPrompt();
    });
});
