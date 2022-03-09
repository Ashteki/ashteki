describe('Reinforce Ready Spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'orrick-gilstream',
                inPlay: ['flute-mage'],
                dicepool: ['divine', 'divine', 'natural', 'natural', 'time', 'time'],
                spellboard: ['reinforce'],
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
        this.player1.clickCard(this.reinforce);
        this.player1.clickPrompt('Reinforce');
        expect(this.reinforce.location).toBe('spellboard');
        this.player1.clickPrompt('piercing light');
        expect(this.piercingLight.location).toBe('deck');

        this.player1.clickPrompt('anchornaut');
        expect(this.anchornaut.location).toBe('hand');
        this.player1.clickYes();
        this.player1.clickDie(3);
        this.player1.clickCard(this.ironWorker);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
