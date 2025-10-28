describe('Tranquility', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'rin-northfell',
                inPlay: ['mist-spirit'],
                dicepool: ['time', 'natural', 'natural', 'natural', 'charm', 'time'],
                spellboard: [],
                hand: ['tranquility', 'molten-gold']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
                dicepool: ['charm', 'natural', 'ceremonial'],
                hand: ['chant-of-revenge']
            }
        });
    });

    it('attaches to target pb, prevents side actions', function () {
        this.player1.clickCard(this.tranquility);
        this.player1.clickPrompt('Play this Alteration');
        this.player1.clickCard(this.coalRoarkwin);
        expect(this.coalRoarkwin.upgrades.length).toBe(1);
        expect(this.tranquility.parent).toBe(this.coalRoarkwin);
        this.player1.endTurn();

        // should not be able to use side action cards
        this.player2.clickCard(this.chantOfRevenge);
        expect(this.player2).toHaveDefaultPrompt();
        expect(this.chantOfRevenge.location).toBe('hand');
        this.player2.clickDie(1);
        expect(this.player2).toHaveDefaultPrompt();
        this.player2.clickPrompt('Meditate');
        expect(this.player2).not.toHaveDefaultPrompt();
    });

    it('gains status at the end of controllers turn', function () {
        this.player1.clickCard(this.tranquility);
        this.player1.clickPrompt('Play this Alteration');
        this.player1.clickCard(this.coalRoarkwin);
        expect(this.coalRoarkwin.upgrades.length).toBe(1);
        this.player1.endTurn();
        expect(this.tranquility.status).toBe(0);
        this.player2.player.actions.main = false;
        this.player2.endTurn();
        expect(this.tranquility.status).toBe(1);
        this.player1.endTurn();
        expect(this.tranquility.status).toBe(1);
        this.player2.player.actions.main = false;
        this.player2.endTurn();
        expect(this.tranquility.status).toBe(2);
        this.player1.endTurn();
        expect(this.tranquility.status).toBe(2);
        this.player2.player.actions.main = false;
        this.player2.endTurn();
        expect(this.tranquility.status).toBe(0);
        expect(this.tranquility.location).toBe('purged');
        expect(this.coalRoarkwin.upgrades.length).toBe(0);
    });

    it('does not prevent both player sides', function () {
        this.player1.clickCard(this.tranquility);
        this.player1.clickPrompt('Play this Alteration');
        this.player1.clickCard(this.coalRoarkwin);
        expect(this.coalRoarkwin.upgrades.length).toBe(1);
        expect(this.tranquility.parent).toBe(this.coalRoarkwin);
        this.player1.endTurn();

        this.player2.player.actions.main = false;
        this.player2.endTurn();

        this.player1.clickDie(1);
        expect(this.player1).not.toHaveDefaultPrompt();
    });

    it('vs time power ability', function () {
        this.player1.clickCard(this.tranquility);
        this.player1.clickPrompt('Play this Alteration');
        this.player1.clickCard(this.coalRoarkwin);
        expect(this.coalRoarkwin.upgrades.length).toBe(1);
        expect(this.tranquility.parent).toBe(this.coalRoarkwin);
        this.player1.endTurn();

        this.player2.player.actions.main = false;
        this.player2.endTurn();
        expect(this.tranquility.status).toBe(1);

        this.player1.useDie(5);
        this.player1.clickCard(this.mistSpirit);
        expect(this.mistSpirit.status).toBe(1);
        this.player1.clickCard(this.tranquility);
        expect(this.tranquility.status).toBe(0);
    });
});
