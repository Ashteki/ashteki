describe('Crystal Armor', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit', 'iron-worker'],
                spellboard: ['summon-butterfly-monk']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage'],
                spellboard: [],
                dicepool: ['time', 'divine'],
                hand: ['crystal-armor', 'summon-sleeping-widows'],
                archives: ['sleeping-widow']
            }
        });

        this.player2.actions.main = false; // shouldn't need this
    });

    it('reaction on unit attack', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.mistSpirit); // single attacker

        expect(this.player2).toHavePrompt('Any reactions to attackers being declared?');
        expect(this.player2).toBeAbleToSelect(this.crystalArmor);

        this.player2.clickCard(this.crystalArmor);
        this.player2.clickCard(this.fluteMage);

        expect(this.crystalArmor.location).toBe('play area');
        expect(this.fluteMage.attack).toBe(2);
        expect(this.fluteMage.life).toBe(3);
        expect(this.fluteMage.recover).toBe(2);

        expect(this.player2.dicepool[1].exhausted).toBe(false);
        expect(this.player2.dicepool[0].exhausted).toBe(true);
    });

    it('does not count as reaction when played normally', function () {
        this.player1.endTurn();
        expect(this.player2).toHaveDefaultPrompt();
        this.player2.play(this.crystalArmor, this.fluteMage);
        expect(this.crystalArmor.location).toBe('play area');
        expect(this.fluteMage.attack).toBe(2);
        expect(this.fluteMage.life).toBe(3);
        expect(this.fluteMage.recover).toBe(2);
        expect(this.player2.dicepool[1].exhausted).toBe(true);
        expect(this.player2.dicepool[0].exhausted).toBe(false);
    });
});
