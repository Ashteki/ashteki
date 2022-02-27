describe('Void pulse', function () {
    describe('standard test', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'hope-everthorn',
                    inPlay: ['hammer-knight', 'anchornaut', 'string-mage', 'salamander-monk'],
                    dicepool: ['ceremonial', 'time', 'charm', 'charm'],
                    hand: ['iron-worker', 'void-pulse'],
                    deck: ['remorse', 'change-psyche']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    dicepool: ['ceremonial', 'time', 'charm', 'charm'],
                    hand: ['molten-gold'],
                    inPlay: ['mist-spirit', 'sonic-swordsman']
                }
            });
        });

        it('deals damage and triggers additional benefits when unit is destroyed', function () {
            let myDeck = this.player1.deck.length;

            this.player1.clickAttack(this.rinNorthfell);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.stringMage);
            this.player1.clickCard(this.salamanderMonk);
            this.player1.clickDone();

            this.player1.clickCard(this.voidPulse);
            this.player1.clickDie(0);

            this.player1.clickCard(this.sonicSwordsman); // damage and destroy sonic swordsman

            expect(this.remorse.location).toBe('hand');
            expect(this.changePsyche.location).toBe('hand');

            expect(this.player1.deck.length).toBe(myDeck - 2); // drew 2 cards
            // change dice
            this.player1.clickOpponentDie(0);
            this.player1.clickOpponentDie(1);

            this.player1.clickDone(); // Finishes all card effects

            expect(this.player2.dicepool[0].level).toBe('basic');
            expect(this.player2.dicepool[1].level).toBe('basic');

            expect(this.voidPulse.location).toBe('discard');
            expect(this.sonicSwordsman.location).toBe('discard');
        });
    });
});
