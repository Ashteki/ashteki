describe('Disengage', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit', 'iron-worker', 'time-hopper'],
                spellboard: ['summon-butterfly-monk'],
                dicepool: ['time', 'natural', 'illusion'],
                hand: ['disengage']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'hammer-knight'],
                spellboard: [],
                archives: ['sleeping-widow']
            }
        });
    });

    it('reaction on defender choice - pb attack', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.ironWorker); // ALLY attacker
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickDone();
        this.player2.clickCard(this.hammerKnight);
        this.player2.clickCard(this.ironWorker);
        this.player2.clickDone();

        this.player1.clickCard(this.disengage);

        //needs status tokens
        expect(this.player1).not.toBeAbleToSelect(this.mistSpirit);
        expect(this.player1).not.toBeAbleToSelect(this.timeHopper);
        expect(this.player1).toBeAbleToSelect(this.ironWorker);
        expect(this.player1).not.toBeAbleToSelect(this.fluteMage);

        this.player1.clickCard(this.ironWorker);
        expect(this.hammerKnight.exhausted).toBe(true);
        expect(this.ironWorker.location).toBe('play area');
        expect(this.ironWorker.damage).toBe(0);
        expect(this.ironWorker.exhausted).toBe(false);

        expect(this.player1).toHaveDefaultPrompt();
    });

    it('no reaction on unit attack', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.ironWorker); // ALLY attacker
        this.player2.clickCard(this.coalRoarkwin); // guard

        expect(this.player1).toHaveDefaultPrompt();
    });
});
