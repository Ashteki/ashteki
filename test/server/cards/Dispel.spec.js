describe('Dispel action spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'brennen-blackcloud',
                inPlay: ['mist-spirit', 'iron-worker'],
                dicepool: ['natural', 'natural', 'charm', 'charm', 'ceremonial'],
                spellboard: [],
                hand: ['root-armor', 'deep-freeze', 'change-of-heart']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut'],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['dispel']
            }
        });

        this.mistSpirit.tokens.status = 2;
    });

    it('should remove status tokens', function () {
        this.player1.play(this.rootArmor);
        this.player1.clickCard(this.ironWorker);
        this.player1.endTurn();

        this.player2.clickCard(this.dispel);
        this.player2.clickPrompt('Play this action');
        this.player2.clickDie(2);
        this.player2.clickPrompt('remove status tokens');
        this.player2.clickCard(this.mistSpirit);

        expect(this.rootArmor.location).toBe('play area');
        expect(this.mistSpirit.status).toBe(0);
    });

    it('should remove chosen upgrade', function () {
        this.player1.play(this.rootArmor);
        this.player1.clickCard(this.ironWorker);
        this.player1.endTurn();

        this.player2.clickCard(this.dispel);
        this.player2.clickPrompt('Play this action');
        this.player2.clickDie(2);
        this.player2.clickPrompt('Return Alteration');
        this.player2.clickCard(this.rootArmor);

        expect(this.rootArmor.location).toBe('deck');
    });

    it('should remove change of heart upgrade', function () {
        this.player1.play(this.changeOfHeart);
        this.player1.clickDie(0);
        this.player1.endTurn();

        this.player2.clickCard(this.dispel);
        this.player2.clickPrompt('Play this action');
        this.player2.clickDie(2);
        this.player2.clickPrompt('Return Alteration');
        this.player2.clickCard(this.changeOfHeart);

        expect(this.changeOfHeart.location).toBe('deck');
    });
});
