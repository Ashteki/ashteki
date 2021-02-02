describe('Blood Shaman with undying heart', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blood-shaman'],
                dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm'],
                hand: ['freezing-blast', 'undying-heart']
            },
            player2: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['stormwind-sniper', 'iron-worker'],
                spellboard: [],
                hand: ['out-of-the-mist'],
                dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm']
            }
        });

        this.aradelSummergaard.tokens.damage = 1;
        this.player1.dicepool[0].lower();
        this.bloodShaman.tokens.damage = 1; // ensure freezing blast kills unit

        this.player1.clickCard(this.undyingHeart);
        this.player1.clickPrompt('Play this alteration');
        this.player1.clickCard(this.bloodShaman);
    });

    it('triggers both abilities when destroyed by own spell', function () {
        expect(this.player1.dicepool[0].level).toBe('class');
        this.player1.clickCard(this.freezingBlast);
        this.player1.clickPrompt('Play this action');

        expect(this.player1).toHavePrompt('Choose a card');
        this.player1.clickCard(this.bloodShaman);
        // prompt for choice between shaman and heart interrupts
        this.player1.clickCard(this.bloodShaman);
        expect(this.player1).toHavePrompt('Which ability would you like to use?');
        this.player1.clickPrompt('Blood Shaman');
        this.player1.clickDie(0);

        expect(this.aradelSummergaard.damage).toBe(0);
        expect(this.player1.dicepool[0].level).toBe('power'); // blood shaman effect
        expect(this.undyingHeart.location).toBe('discard');
        expect(this.bloodShaman.location).toBe('hand'); // undying heart triggered after my chosen one
    });
});
