describe('Blood Shaman', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blood-shaman'],
                dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm'],
                hand: ['freezing-blast', 'fear', 'molten-gold']
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
    });

    it('triggers when destroyed by own damage spell', function () {
        expect(this.player1.dicepool[0].level).toBe('class');
        this.player1.clickCard(this.freezingBlast);
        this.player1.clickPrompt('Play this action');

        expect(this.player1).toHavePrompt('Choose a card');
        this.player1.clickCard(this.bloodShaman);

        expect(this.player1).toHavePrompt('Choose a die');
        expect(this.player1).not.toBeAbleToSelectDie(this.player2.dicepool[0]);
        this.player1.clickDie(0);

        expect(this.aradelSummergaard.damage).toBe(0);
        expect(this.player1.dicepool[0].level).toBe('power');
    });

    it('triggers when destroyed by own wounds spell', function () {
        expect(this.player1.dicepool[0].level).toBe('class');
        this.player1.play(this.moltenGold);
        this.player1.clickCard(this.bloodShaman);

        expect(this.player1).toHavePrompt('Choose a die');
        this.player1.clickDie(0);

        expect(this.aradelSummergaard.damage).toBe(0);
        expect(this.player1.dicepool[0].level).toBe('power');
    });

    it('triggers dice choice when PB is undamaged', function () {
        this.aradelSummergaard.tokens.damage = 0;
        expect(this.player1.dicepool[0].level).toBe('class');
        this.player1.play(this.moltenGold);
        this.player1.clickCard(this.bloodShaman);

        expect(this.player1).toHavePrompt('Choose a die');
        this.player1.clickDie(0);

        expect(this.aradelSummergaard.damage).toBe(0);
        expect(this.player1.dicepool[0].level).toBe('power');
    });

    it('triggers when exhausted', function () {
        this.bloodShaman.tokens.exhaustion = 1;

        expect(this.player1.dicepool[0].level).toBe('class');
        this.player1.clickCard(this.freezingBlast);
        this.player1.clickPrompt('Play this action');

        expect(this.player1).toHavePrompt('Choose a card');
        this.player1.clickCard(this.bloodShaman);

        expect(this.player1).toHavePrompt('Choose a die');
        this.player1.clickDie(0);

        expect(this.aradelSummergaard.damage).toBe(0);
        expect(this.player1.dicepool[0].level).toBe('power');
    });

    it('no trigger when destroyed by opponent spell', function () {
        expect(this.player1.dicepool[0].level).toBe('class');
        this.player1.clickPrompt('End turn');
        this.player1.clickPrompt('Yes');

        this.player2.clickCard(this.outOfTheMist);
        this.player2.clickPrompt('Play this action');

        this.player2.clickCard(this.bloodShaman);

        expect(this.bloodShaman.location).toBe('discard');
        expect(this.aradelSummergaard.damage).toBe(1);
        expect(this.player1.dicepool[0].level).toBe('class');
    });

    it('triggers when destroyed by fear - no damagedealt', function () {
        expect(this.player1.dicepool[0].level).toBe('class');
        this.player1.clickCard(this.fear);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(0);
        this.player1.clickCard(this.bloodShaman);

        expect(this.player1).toHavePrompt('Choose a die');
        this.player1.clickDie(0);
        expect(this.aradelSummergaard.damage).toBe(0);
        expect(this.player1.dicepool[0].level).toBe('power');

        expect(this.player1).toHavePrompt('Choose a unit to discard'); // resume fear part 2...
    });
});
