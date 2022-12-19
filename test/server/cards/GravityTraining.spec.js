describe('Gravity Training', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                spellboard: ['gravity-training'],
                dicepool: ['time', 'divine'],
                archives: ['enhanced-strength']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['anchornaut']
            }
        });
    });

    it('buff a unit', function () {
        this.ironWorker.tokens.exhaustion = 1;
        this.player1.clickCard(this.gravityTraining);
        this.player1.clickPrompt('Gravity Training');
        this.player1.clickPrompt('Main');
        this.player1.clickCard(this.ironWorker);
        expect(this.ironWorker.life).toBe(3);
        expect(this.gravityTraining.exhausted).toBe(true);
    });

    it('cancels at targetting', function () {
        this.ironWorker.tokens.exhaustion = 1;
        this.player1.clickCard(this.gravityTraining);
        this.player1.clickPrompt('Gravity Training');
        this.player1.clickPrompt('Main');
        this.player1.clickPrompt('Cancel');
        expect(this.ironWorker.life).toBe(2);
        expect(this.gravityTraining.exhausted).toBe(false);
        expect(this.player1.dicepool[1].exhausted).toBe(false);
    });

    it('shows warning if no exhausted units', function () {
        this.player1.clickCard(this.gravityTraining);
        this.player1.clickPrompt('Gravity Training');
        expect(this.player1).toHavePromptTitle('Warning');
        this.player1.clickPrompt('No');
        expect(this.player1).toHaveDefaultPrompt();
        expect(this.gravityTraining.exhausted).toBe(false);
        expect(this.player1.dicepool[1].exhausted).toBe(false);
    });
});
