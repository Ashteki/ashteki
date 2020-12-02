describe('Recovery phase dice pinning', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                spellboard: ['summon-butterfly-monk']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm']
            }
        });

        this.player1.dicepool[0].exhaust();
        this.savedUUID = this.player1.dicepool[1].uuid;

        this.player1.clickPrompt('End Turn');
        this.player2.clickPrompt('End Turn');

        expect(this.player1).toHavePrompt('Select dice to keep');
        expect(this.player2).toHavePrompt('Select dice to keep');
    });

    it('should not offer to pin exhausted dice', function () {
        expect(this.player1).toBeAbleToSelectDie(this.player1.dicepool[1]);
        expect(this.player1).not.toBeAbleToSelectDie(this.player1.dicepool[0]);
    });

    it('should not reroll pinned dice', function () {
        this.player1.clickDie(1);
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        expect(this.player1.dicepool.length).toBe(10);
        expect(this.player1.dicepool.filter((d) => d.uuid === this.savedUUID).length).toBe(1);
    });

    it('should reroll unpinned dice', function () {
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        expect(this.player1.dicepool.length).toBe(10);
        expect(this.player1.dicepool[1].uuid).not.toBe(this.savedUUID);
    });
});
