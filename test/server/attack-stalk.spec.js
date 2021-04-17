describe('stalk keyword', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['shadow-hound', 'mist-spirit', 'winged-lioness'],
                spellboard: ['hypnotize'],
                dicepool: ['natural', 'natural', 'charm', 'charm']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut', 'iron-worker'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['anchornaut']
            }
        });
    });

    it('does not prevent block', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.shadowHound);
        this.player1.clickPrompt('Done'); // single attacker
        expect(this.player2).toHavePrompt('Choose a blocker');
        expect(this.player2).toBeAbleToSelect(this.anchornaut);
        this.player2.clickCard(this.anchornaut);
        this.player2.clickCard(this.shadowHound);
        this.player2.clickDone();
        expect(this.anchornaut.location).toBe('discard');
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('prevents guard', function () {
        this.player1.clickPrompt('Attack');
        expect(this.shadowHound.anyEffect('preventGuard')).toBe(true);
        this.player1.clickCard(this.anchornaut); // target
        this.player1.clickCard(this.shadowHound);
        expect(this.player2).not.toHavePrompt('Choose a guard?');
        expect(this.player2).toHavePrompt('Do you want to counter?');
    });

    it('does not prevent block - bug report', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.wingedLioness);
        this.player1.clickPrompt('Done'); // single attacker
        expect(this.player2).toHavePrompt('Choose a blocker');
        expect(this.player2).toBeAbleToSelect(this.anchornaut);
        this.player2.clickCard(this.anchornaut);
        this.player2.clickCard(this.wingedLioness);
        this.player2.clickDone();
        expect(this.anchornaut.location).toBe('discard');
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('prevents guard - bug report', function () {
        this.player1.clickPrompt('Attack');
        expect(this.shadowHound.anyEffect('preventGuard')).toBe(true);
        this.player1.clickCard(this.anchornaut); // target
        this.player1.clickCard(this.wingedLioness);
        expect(this.player2).not.toHavePrompt('Choose a guard?');
        expect(this.player2).toHavePrompt('Do you want to counter?');
    });
});
