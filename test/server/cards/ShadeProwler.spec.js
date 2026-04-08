describe('Shade Prowler reaction', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'lulu-firststone',
                inPlay: ['shade-prowler', 'mist-spirit'],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                archives: ['butterfly-monk', 'spark']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'emperor-lion'],
                spellboard: ['summon-butterfly-monk', 'empower'],
                hand: ['redirect'],
                dicepool: ['natural', 'natural', 'charm', 'charm']
            }
        });

        this.empower.tokens.exhaustion = 1;
    });

    it('prompts for reaction when prowler is declared attacker', function () {
        this.player1.clickCard(this.luluFirststone);
        this.player1.clickPrompt('Bolster');
        this.player1.clickDie(0);
        this.player1.clickCard(this.shadeProwler); // attach to ms

        expect(this.shadeProwler.attack).toBe(3);
        expect(this.shadeProwler.upgrades.length).toBe(1);
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.shadeProwler); // single attacker
        this.player1.clickPrompt('Done'); // end attacker select

        expect(this.player1).toBeAbleToSelect(this.emperorLion);
        expect(this.player1).not.toBeAbleToSelect(this.empower);

        this.player1.clickCard(this.emperorLion); // click to deal damage

        expect(this.emperorLion.damage).toBe(3);
        expect(this.player2).toHavePrompt('Choose a blocker'); // carry on with attack sequence
    });
});
