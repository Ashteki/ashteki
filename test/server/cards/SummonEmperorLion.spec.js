describe('Summon Emperor Lion', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                spellboard: ['summon-emperor-lion'],
                dicepool: ['divine', 'divine', 'illusion', 'natural', 'divine', 'divine'],
                archives: ['emperor-lion'],
                deck: ['law-of-sight', 'open-memories', 'open-memories', 'open-memories'],
                hand: ['law-of-grace']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['hammer-knight'],
                spellboard: []
            }
        });
    });

    it('should place a lion into play without law tutor', function () {
        this.player1.clickCard(this.summonEmperorLion);
        this.player1.clickPrompt('Summon Emperor Lion');
        this.player1.clickDie(2);
        this.player1.clickPrompt('Done');
        expect(this.emperorLion.location).toBe('play area');
        expect(this.lawOfSight.location).toBe('deck');

        expect(this.player1).toHaveDefaultPrompt();
    });
});
