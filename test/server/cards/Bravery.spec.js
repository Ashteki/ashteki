describe('Bravery reaction spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: [
                    'mist-spirit',
                    'iron-worker',
                    'fallen',
                    'squall-stallion',
                    'stormwind-sniper',
                    'shadow-hound'
                ],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                archives: [],
                hand: ['freezing-blast']
            },
            player2: {
                phoenixborn: 'rin-northfell',
                inPlay: ['hammer-knight'],
                spellboard: [],
                hand: ['bravery'],
                dicepool: ['divine', 'natural']
            }
        });
    });

    it('can be played when a unit takes damage', function () {
        this.player1.clickAttack(this.hammerKnight);
        this.player1.clickCard(this.ironWorker); // single attacker

        this.player2.clickPrompt('Done'); // no guard
        this.player2.clickPrompt('No'); // no counter

        expect(this.player2).toBeAbleToSelect(this.bravery);
        this.player2.clickCard(this.bravery); // click bravery to play as reaction

        expect(this.hammerKnight.damage).toBe(0);
    });

    it('cannot be played when a pb takes damage', function () {
        this.player1.clickAttack(this.rinNorthfell);
        this.player1.clickCard(this.ironWorker); // single attacker
        this.player1.clickDone();

        this.player2.clickDone();

        expect(this.player2).not.toBeAbleToSelect(this.bravery);
        this.player2.clickCard(this.bravery); // click bravery to play as reaction

        expect(this.rinNorthfell.damage).toBe(2);
    });

    it('cannot be played when opponents unit takes damage', function () {
        this.player1.endTurn();

        this.player2.clickAttack(this.ironWorker);
        this.player2.clickCard(this.hammerKnight); // single attacker

        this.player1.clickPrompt('Done'); // no guard
        this.player1.clickPrompt('No'); // no counter

        this.player2.clickPrompt('Done'); // aftershock
        expect(this.player2).not.toBeAbleToSelect(this.bravery);
        this.player2.clickCard(this.bravery); // click bravery to play as reaction

        expect(this.hammerKnight.damage).toBe(0);
        expect(this.player2).toHaveDefaultPrompt();
    });
});
