describe('Massive Growth alteration', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'rin-northfell',
                inPlay: ['mist-spirit'],
                dicepool: ['natural', 'natural', 'natural', 'natural', 'charm'],
                spellboard: [],
                hand: ['massive-growth', 'molten-gold']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker'],
                dicepool: ['charm'],
                hand: ['sympathy-pain']
            }
        });
    });

    it('attaches to target card, grants attack and life', function () {
        this.player1.clickCard(this.massiveGrowth);
        this.player1.clickPrompt('Play this Alteration');
        this.player1.clickDie(2);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.mistSpirit);
        expect(this.mistSpirit.upgrades.length).toBe(1);
        expect(this.massiveGrowth.parent).toBe(this.mistSpirit);
        expect(this.massiveGrowth.controller).toBe(this.player1.player);

        expect(this.mistSpirit.attack).toBe(5);
        expect(this.mistSpirit.life).toBe(5);

        this.player1.endTurn();
        this.player2.clickPrompt('Attack');
        this.player2.clickCard(this.mistSpirit);
        this.player2.clickCard(this.ironWorker);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('No'); // don't counter

        expect(this.mistSpirit.damage).toBe(2);
        expect(this.mistSpirit.location).toBe('play area');

        this.player2.endTurn();
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin);
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickPrompt('Done');

        expect(this.coalRoarkwin.damage).toBe(5);
    });

    it('attaches to opponent card, transfers control', function () {
        this.player1.clickCard(this.massiveGrowth);
        this.player1.clickPrompt('Play this Alteration');
        this.player1.clickDie(2);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.ironWorker);
        expect(this.ironWorker.upgrades.length).toBe(1);
        expect(this.massiveGrowth.parent).toBe(this.ironWorker);
        expect(this.massiveGrowth.controller).toBe(this.player2.player);
    });
});
