describe('Hunting Weapons', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['iron-worker'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'time', 'charm'],
                hand: ['hunting-weapons', 'hunting-weapons'],
                archives: ['spark']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                inPlay: ['flute-mage']
            }
        });
    });

    it('attack when attached allows ping', function () {
        this.player1.play(this.huntingWeapons, this.ironWorker);
        expect(this.ironWorker.upgrades.length).toBe(1);
        this.player1.clickAttack(this.sariaGuideman);
        this.player1.clickCard(this.ironWorker);
        this.player1.clickDone();
        this.player1.clickCard(this.ironWorker);

        this.player1.clickCard(this.fluteMage);
        expect(this.fluteMage.damage).toBe(1);
    });

    it('two cards combine ability value', function () {
        this.player1.actions.side = 2;
        this.player1.play(this.huntingWeapons, this.ironWorker);
        this.player1.play(this.player1.hand[0], this.ironWorker);
        expect(this.ironWorker.upgrades.length).toBe(2);
        expect(this.ironWorker.attack).toBe(4);
        this.player1.clickAttack(this.sariaGuideman);
        this.player1.clickCard(this.ironWorker);
        this.player1.clickDone();
        this.player1.clickCard(this.ironWorker);

        this.player1.clickCard(this.fluteMage);
        expect(this.fluteMage.location).toBe('discard');

        expect(this.player1).toHaveDefaultPrompt();
    });
});
