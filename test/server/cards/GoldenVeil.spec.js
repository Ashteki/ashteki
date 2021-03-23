describe('Golden Veil', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['mist-spirit', 'iron-worker'],
                dicepool: ['ceremonial', 'natural', 'natural', 'illusion', 'charm'],
                hand: ['molten-gold', 'fade-away']
            },
            player2: {
                phoenixborn: 'rin-northfell',
                inPlay: ['hammer-knight'],
                dicepool: ['charm', 'natural'],
                hand: ['golden-veil']
            }
        });
    });

    it('cancels molten gold on unit', function () {
        this.player1.clickCard(this.moltenGold);
        this.player1.clickPrompt('Play this action');
        this.player1.clickCard(this.hammerKnight);

        expect(this.player2).toHavePrompt('Any Interrupts to molten gold?');
        this.player2.clickCard(this.goldenVeil);

        expect(this.hammerKnight.damage).toBe(0);
        expect(this.hammerKnight.location).toBe('play area');
        expect(this.player1).toHaveDefaultPrompt();
        expect(this.moltenGold.location).toBe('discard');
    });

    it('cancels natural dice power', function () {
        this.player1.clickDie(1);
        this.player1.clickPrompt('Natural Dice Power');
        this.player1.clickCard(this.hammerKnight);

        expect(this.player2).toHavePrompt('Any interrupts to natural dice power?');
        this.player2.clickCard(this.goldenVeil);

        expect(this.hammerKnight.damage).toBe(0);
        expect(this.hammerKnight.location).toBe('play area');
        expect(this.player1).toHaveDefaultPrompt();
        expect(this.player1.dicepool[1].exhausted).toBe(true);
    });

    it('cancels charm dice power', function () {
        this.player1.clickDie(4);
        this.player1.clickPrompt('Charm Dice Power');
        this.player1.clickCard(this.hammerKnight);

        expect(this.player2).toHavePrompt('Any interrupts to charm dice power?');
        this.player2.clickCard(this.goldenVeil);

        expect(this.player1).toHaveDefaultPrompt();
        expect(this.hammerKnight.dieUpgrades.length).toBe(0);
        expect(this.player1.dicepool[4].exhausted).toBe(true);
    });

    it('cancels alteration spell attachment to unit', function () {
        this.player1.clickCard(this.fadeAway);
        this.player1.clickPrompt('Play this alteration');
        this.player1.clickCard(this.hammerKnight);

        // expect(this.player2).toHavePrompt('Any Interrupts to molten gold?');
        this.player2.clickCard(this.goldenVeil);

        expect(this.hammerKnight.upgrades.length).toBe(0);
        expect(this.player1).toHaveDefaultPrompt();
        expect(this.fadeAway.location).toBe('discard');
    });

    it('cancels multi-target ability - Maeoni', function () {
        this.player1.clickCard(this.maeoniViper);
        this.player1.clickPrompt('Command Strike');
        this.player1.clickDie(0);
        this.player1.clickDie(2);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.ironWorker);
        this.player1.clickCard(this.hammerKnight);

        expect(this.player2).toHavePrompt('Any Interrupts to command strike?');
        this.player2.clickCard(this.goldenVeil);

        expect(this.hammerKnight.damage).toBe(0);
        expect(this.hammerKnight.location).toBe('play area');
        expect(this.player1).toHaveDefaultPrompt();
    });
});
