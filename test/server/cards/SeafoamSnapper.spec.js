describe('Seafoam Snapper', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'orrick-gilstream',
                inPlay: ['flute-mage'],
                dicepool: ['sympathy', 'charm', 'charm', 'time', 'illusion'],
                spellboard: ['summon-seafoam-snapper'],
                deck: ['anchornaut']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                dicepool: ['natural'],
                inPlay: ['hammer-knight', 'anchornaut', 'seafoam-snapper'],
                spellboard: ['chant-of-revenge']
            }
        });
    });

    it('attack when no status damages as normal', function () {
        this.player1.clickAttack(this.seafoamSnapper);
        this.player1.clickCard(this.fluteMage);
        this.player2.clickDone();
        this.player2.clickNo();

        expect(this.seafoamSnapper.location).toBe('archives'); // dead
    });

    it('attack with status acts as armor', function () {
        this.seafoamSnapper.tokens.status = 1;
        this.player1.clickAttack(this.seafoamSnapper);
        this.player1.clickCard(this.fluteMage);
        this.player2.clickDone();
        this.player2.clickNo();

        expect(this.seafoamSnapper.damage).toBe(0);
        expect(this.seafoamSnapper.location).toBe('play area');
        expect(this.seafoamSnapper.status).toBe(0);
    });
});
