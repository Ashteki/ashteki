describe('Vengeance action spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'odette-diamondcrest',
                inPlay: [
                    'hammer-knight',
                    'iron-worker',
                    'anchornaut',
                    'mist-spirit',
                    'orchid-dove',
                    'butterfly-monk'
                ],
                dicepool: ['divine', 'charm', 'divine', 'charm'],
                hand: ['vengeance']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['silver-snake'],
                spellboard: []
            }
        });
    });

    it('add 1 to 1 unit attack', function () {
        this.player1.clickCard(this.vengeance);
        this.player1.clickPrompt('Play this action');

        this.player1.clickDie(0);
        this.player1.clickDone();

        this.player1.clickCard(this.mistSpirit);
        this.player1.clickDone();

        this.player1.clickCard(this.ironWorker);
        this.player1.clickDone();

        expect(this.mistSpirit.location).toBe('archives');
        expect(this.ironWorker.attack).toBe(3);
    });

    it('multiple units with death triggers', function () {
        this.player1.clickCard(this.vengeance);
        this.player1.clickPrompt('Play this action');

        this.player1.clickDie(0);
        this.player1.clickDie(1);
        this.player1.clickDone();

        this.player1.clickCard(this.orchidDove);
        this.player1.clickCard(this.butterflyMonk);
        this.player1.clickDone();
        this.player1.clickCard(this.orchidDove);
        this.player1.clickYes();
        this.player1.clickCard(this.butterflyMonk);
        this.player1.clickDone();

        this.player1.clickCard(this.ironWorker);
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickDone();

        expect(this.orchidDove.location).toBe('archives');
        expect(this.butterflyMonk.location).toBe('archives');
        expect(this.ironWorker.attack).toBe(3);
        expect(this.hammerKnight.attack).toBe(4);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('add 1 to 2 unit attack', function () {
        this.player1.clickCard(this.vengeance);
        this.player1.clickPrompt('Play this action');

        this.player1.clickDie(0);
        this.player1.clickDie(1);
        this.player1.clickDone();

        this.player1.clickCard(this.mistSpirit);
        this.player1.clickCard(this.anchornaut);
        this.player1.clickDone();

        this.player1.clickCard(this.ironWorker);
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickDone();

        expect(this.mistSpirit.location).toBe('archives');
        expect(this.anchornaut.location).toBe('discard');
        expect(this.ironWorker.attack).toBe(3);
        expect(this.hammerKnight.attack).toBe(4);
    });
});
