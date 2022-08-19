describe('Summon Seafoam Snapper', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'orrick-gilstream',
                inPlay: ['hammer-knight', 'anchornaut', 'mist-spirit'],
                dicepool: ['sympathy', 'charm', 'charm', 'time', 'illusion'],
                spellboard: ['summon-seafoam-snapper'],
                archives: ['seafoam-snapper'],
                deck: ['anchornaut']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                dicepool: ['natural'],
                inPlay: ['iron-worker'],
                spellboard: ['chant-of-revenge']
            }
        });
    });

    it('normal summon without Hungry 1 ability', function () {
        this.player1.clickCard(this.summonSeafoamSnapper);
        this.player1.clickPrompt('Summon Seafoam Snapper');

        expect(this.seafoamSnapper.location).toBe('play area');
        expect(this.seafoamSnapper.status).toBe(0);
    });

    it('normal summon with Hungry 1 ability', function () {
        this.mistSpirit.tokens.exhaustion = 1;
        expect(this.mistSpirit.exhausted).toBe(true);

        this.player1.clickCard(this.summonSeafoamSnapper);
        this.player1.clickPrompt('Summon Seafoam Snapper');

        this.player1.clickCard(this.mistSpirit);

        expect(this.seafoamSnapper.location).toBe('play area');
        expect(this.seafoamSnapper.status).toBe(1);
        expect(this.mistSpirit.location).toBe('archives');
    });
});
