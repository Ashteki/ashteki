describe('Barrier reaction spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                dicepool: ['natural']
            },
            player2: {
                phoenixborn: 'issa-brightmore',
                inPlay: ['flute-mage'],
                dicepool: ['artifice', 'artifice', 'natural'],
                hand: ['barrier'],
                deck: ['molten-gold']
            }
        });
    });

    it('should prevent 3 damage on attack for a charged unit', function () {
        this.player2.attachDie(0, this.fluteMage);
        expect(this.fluteMage.damage).toBe(0);
        expect(this.fluteMage.isCharged).toBe(true);

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage);
        this.player1.clickCard(this.ironWorker);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('No');

        this.player2.clickCard(this.barrier);
        expect(this.barrier.location).toBe('discard');
        expect(this.fluteMage.damage).toBe(0);
        expect(this.fluteMage.location).toBe('play area');
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('no trigger for an uncharged unit', function () {
        expect(this.fluteMage.damage).toBe(0);
        expect(this.fluteMage.isCharged).toBe(false);

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage);
        this.player1.clickCard(this.ironWorker);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('No');

        this.player2.clickCard(this.barrier);
        expect(this.barrier.location).toBe('hand'); // unplayed
        expect(this.fluteMage.location).toBe('discard');
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('should prevent 3 damage on attack for a charged pb', function () {
        this.player2.attachDie(0, this.issaBrightmore);
        expect(this.issaBrightmore.damage).toBe(0);
        expect(this.issaBrightmore.isCharged).toBe(true);

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.issaBrightmore);
        this.player1.clickCard(this.ironWorker);
        this.player1.clickPrompt('Done');
        this.player2.clickDone(); // no blockers

        this.player2.clickCard(this.barrier);
        expect(this.barrier.location).toBe('discard');
        expect(this.issaBrightmore.damage).toBe(0);
        expect(this.issaBrightmore.location).toBe('play area');
        expect(this.player1).toHaveDefaultPrompt();
    });
});
