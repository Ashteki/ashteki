describe('Oceans Gift', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit', 'anchornaut'],
                dicepool: ['time', 'illusion', 'charm', 'charm'],
                spellboard: [],
                hand: ['close-combat', 'oceans-gift']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker']
            }
        });
    });

    it('when played raises 3 dice', function () {
        // fudge dice
        this.player1.dicepool[1].level = 'basic';
        this.player1.dicepool[2].level = 'class';
        this.player1.dicepool[3].level = 'basic';

        this.player1.clickCard(this.oceansGift); // play card
        this.player1.clickPrompt('Play this alteration');
        this.player1.clickCard(this.mistSpirit); // attach to ms
        expect(this.mistSpirit.upgrades.length).toBe(1);
        this.player1.clickDie(1);
        this.player1.clickDie(2);
        this.player1.clickDie(3);
        this.player1.clickDone();

        expect(this.player1.dicepool[1].level).toBe('class');
        expect(this.player1.dicepool[2].level).toBe('power');
        expect(this.player1.dicepool[3].level).toBe('class');
    });

    it('when declared as an attacker', function () {
        this.player1.clickCard(this.oceansGift);
        this.player1.clickPrompt('Play this alteration');
        this.player1.clickCard(this.mistSpirit); // attach to ms

        expect(this.anchornaut.status).toBe(0);
        this.player1.clickAttack(this.ironWorker);
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickCard(this.anchornaut); // Bestow
        this.player2.clickDone();
        this.player2.clickNo();

        expect(this.anchornaut.status).toBe(1);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
