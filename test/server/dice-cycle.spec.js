describe('Dice cycle', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['shadow-hound', 'mist-spirit'],
                spellboard: ['hypnotize'],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['call-upon-the-realms', 'molten-gold']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut', 'iron-worker'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                hand: ['shatter-pulse']
            }
        });
    });

    it('check for cycle up, and deselect of my dice', function () {
        this.player1.play(this.callUponTheRealms);
        const target = this.player1.dicepool[0];
        expect(target.level).toBe('power');
        this.player1.clickDie(0);
        expect(target.level).toBe('basic');
        expect(this.player1.player.selectedDice.length).toBe(1);

        this.player1.clickDie(0);
        expect(target.level).toBe('class');
        expect(this.player1.player.selectedDice.length).toBe(1);

        this.player1.clickDie(0);
        expect(target.level).toBe('power');
        expect(this.player1.player.selectedDice.length).toBe(0);

        this.player1.clickDie(0);
        this.player1.clickPrompt('Done');
        expect(target.level).toBe('basic');
    });

    it('check for cycle down and deselect of opponent', function () {
        this.player1.play(this.moltenGold);
        this.player1.clickCard(this.anchornaut);

        this.player2.clickCard(this.shatterPulse);
        this.player2.clickDie(0);
        this.player2.clickPrompt('Done');

        expect(this.player2).toHavePrompt('choose a card');
        this.player2.clickCard(this.mistSpirit);

        const target = this.player1.dicepool[0];

        expect(this.mistSpirit.location).toBe('archives');
        expect(target.level).toBe('power');
        this.player2.clickOpponentDie(0);
        expect(target.level).toBe('class');
        expect(this.player2.player.selectedDice.length).toBe(1);

        this.player2.clickOpponentDie(0);
        expect(target.level).toBe('basic');
        expect(this.player2.player.selectedDice.length).toBe(1);

        this.player2.clickOpponentDie(0);
        expect(target.level).toBe('power');
        expect(this.player2.player.selectedDice.length).toBe(0);

        this.player2.clickOpponentDie(0);
        this.player2.clickOpponentDie(0);
        this.player2.clickPrompt('Done');
        expect(target.level).toBe('basic');
    });
});
