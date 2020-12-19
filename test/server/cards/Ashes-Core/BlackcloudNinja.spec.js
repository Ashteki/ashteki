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
                spellboard: ['summon-butterfly-monk'],
                hand: ['redirect'],
                dicepool: ['natural', 'natural', 'charm', 'charm']
            }
        });
    });

    it('prompts for reaction when ninja is declared attacker', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.blackcloudNinja); // single attacker
        this.player1.clickPrompt('Done'); // end attacker select

        expect(this.player1).toBeAbleToSelect(this.blackcloudNinja);
        this.player1.clickCard(this.blackcloudNinja); // redirect damage to hammerKnight

        expect(this.player2).toBeAbleToSelect(this.summonButterflyMonk);
        // any interrupts?
        this.player2.clickCard(this.summonButterflyMonk); // click to exhaust

        expect(this.summonButterflyMonk.exhausted).toBe(true);
        expect(this.player2).toHavePrompt('Choose a blocker'); // carry on with attack sequence
    });
});
