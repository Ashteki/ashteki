describe('Arrogance', function () {
    describe('standard test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'flute-mage'],
                    dicepool: ['ceremonial', 'sympathy', 'charm', 'charm'],
                    hand: ['arrogance', 'molten-gold']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['iron-rhino', 'mist-spirit']
                }
            });
        });

        it('can prevent block by charmed - only attacker', function () {
            this.player1.useDie(2);
            this.player1.clickCard(this.ironRhino);
            expect(this.ironRhino.attack).toBe(6);
            this.player1.clickAttack(this.rinNorthfell);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickDone();
            this.player1.clickCard(this.arrogance);
            this.player1.clickCard(this.hammerKnight);

            expect(this.player2).toHavePrompt('Choose a blocker');
            expect(this.player2).not.toBeAbleToSelect(this.ironRhino);
            expect(this.player2).toBeAbleToSelect(this.mistSpirit);

            expect(this.arrogance.location).toBe('discard');
        });

        it('can prevent block of chosen unit by charmed - multiple attackers attacker', function () {
            this.player1.useDie(2);
            this.player1.clickCard(this.ironRhino);
            expect(this.ironRhino.attack).toBe(6);
            this.player1.clickAttack(this.rinNorthfell);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.fluteMage);
            this.player1.clickDone();
            this.player1.clickCard(this.arrogance);
            this.player1.clickCard(this.hammerKnight);

            expect(this.player2).toHavePrompt('Choose a blocker');
            this.player2.clickCard(this.ironRhino);
            expect(this.player2).not.toBeAbleToSelect(this.hammerKnight);
            expect(this.player2).toBeAbleToSelect(this.fluteMage);
            this.player2.clickCard(this.fluteMage);
            this.player2.clickCard(this.mistSpirit);
            this.player2.clickCard(this.hammerKnight);
            this.player2.clickDone();
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickDone(); // no aftershock
            this.player1.clickCard(this.fluteMage);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.mistSpirit.location).toBe('archives');
        });
    });
});
