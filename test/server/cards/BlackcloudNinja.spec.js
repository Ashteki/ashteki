describe('Blackcloud Ninja reaction', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'brennen-blackcloud',
                inPlay: ['blackcloud-ninja', 'mist-spirit'],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                archives: ['butterfly-monk']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'hammer-knight'],
                spellboard: ['summon-butterfly-monk', 'empower'],
                hand: ['redirect'],
                dicepool: ['natural', 'natural', 'charm', 'charm']
            }
        });

        this.empower.tokens.exhaustion = 1;
    });

    it('prompts for reaction when ninja is declared attacker', function () {
        expect(this.empower.exhausted).toBe(true);
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.blackcloudNinja); // single attacker
        this.player1.clickPrompt('Done'); // end attacker select

        expect(this.player1).toBeAbleToSelect(this.blackcloudNinja);
        this.player1.clickCard(this.blackcloudNinja); // redirect damage to hammerKnight

        expect(this.player2).toBeAbleToSelect(this.summonButterflyMonk);
        expect(this.player2).not.toBeAbleToSelect(this.empower);
        // any interrupts?
        this.player2.clickCard(this.summonButterflyMonk); // click to exhaust

        expect(this.summonButterflyMonk.exhausted).toBe(true);
        expect(this.player2).toHavePrompt('Choose a blocker'); // carry on with attack sequence
    });

    it('cannot play if opponent has no unexhausted ready spells', function () {
        this.summonButterflyMonk.tokens.exhaustion = 1;
        expect(this.empower.exhausted).toBe(true);
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.blackcloudNinja); // single attacker
        this.player1.clickPrompt('Done'); // end attacker select

        expect(this.player1).not.toBeAbleToSelect(this.blackcloudNinja);

        expect(this.player2).toHavePrompt('Choose a blocker'); // carry on with attack sequence
    });
});
