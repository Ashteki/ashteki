describe('Blacksand Mechanic', function () {
    describe('Enters Play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'tash-cantasita',
                    inPlay: ['flute-mage', 'anchornaut'],
                    dicepool: ['artifice', 'charm'],
                    hand: ['blacksand-mechanic', 'massive-growth', 'purge'],
                    deck: [
                        'summon-gilder',
                        'hollow',
                        'tripwire',
                        'fate-reflection',
                        'summon-steadfast-guardian'
                    ]
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker']
                }
            });
        });

        it('discard an alteration to draw 2 cards', function () {
            expect(this.player1.deck.length).toBe(5);
            expect(this.player1.hand.length).toBe(3);
            this.player1.play(this.blacksandMechanic);
            this.player1.clickDie(1);
            this.player1.clickDone();
            expect(this.blacksandMechanic.location).toBe('play area');
            this.player1.clickYes(); // do you want to discard to draw 2

            expect(this.player1).toBeAbleToSelect(this.massiveGrowth);
            expect(this.player1).not.toBeAbleToSelect(this.purge);
            this.player1.clickCard(this.massiveGrowth);

            expect(this.massiveGrowth.location).toBe('discard');
            expect(this.player1.hand.length).toBe(3); // play 1 discard 1, draw 2
        });
    });

    describe('In Play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'tash-cantasita',
                    inPlay: ['blacksand-mechanic', 'flute-mage', 'anchornaut'],
                    dicepool: ['artifice']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker']
                }
            });

            this.player1.attachDie(0, this.fluteMage);
            this.fluteMage.tokens.damage = 1;
            this.anchornaut.tokens.damage = 1;
        });

        it('repairs a damaged charged unit and cannot target an uncharged unit', function () {
            expect(this.fluteMage.isCharged).toBe(true);
            expect(this.fluteMage.damage).toBe(1);
            expect(this.fluteMage.upgrades.length).toBe(0);

            this.player1.clickCard(this.blacksandMechanic);
            this.player1.clickPrompt('Repair 1');

            expect(this.player1).toBeAbleToSelect(this.fluteMage);
            expect(this.player1).not.toBeAbleToSelect(this.anchornaut);

            this.player1.clickCard(this.fluteMage);
            expect(this.fluteMage.damage).toBe(0);
        });
    });
});
