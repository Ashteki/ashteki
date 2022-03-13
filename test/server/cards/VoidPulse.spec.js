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
                    dicepool: ['ceremonial', 'charm', 'charm', 'time'],
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
            this.player1.clickPrompt('player2');
            this.player1.clickOpponentDie(0);
            this.player1.clickOpponentDie(3); // This is to avoid the duplicate charm dice, which tend to cause havoc with reordering

            this.player1.clickDone(); // finish all card effects

            expect(this.player2.dicepool[0].level).toBe('basic');
            expect(this.player2.dicepool[3].level).toBe('basic');

            expect(this.voidPulse.location).toBe('discard');
            expect(this.sonicSwordsman.location).toBe('discard');
        });

        it("deals damage and doesn't triggers additional benefits when unit is not destroyed", function () {
            let myDeck = this.player1.deck.length;

            this.player1.clickAttack(this.rinNorthfell);
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickCard(this.salamanderMonk);
            this.player1.clickDone();

            this.player1.clickCard(this.voidPulse);
            this.player1.clickDie(0);

            this.player1.clickCard(this.sonicSwordsman); // damage sonic swordsman

            this.player2.clickDone(); // no blockers

            expect(this.player1.deck.length).toBe(myDeck); // didn't draw 2 cards

            // try change dice
            this.player1.clickOpponentDie(0);
            this.player1.clickOpponentDie(1);

            // dice didn't change
            expect(this.player2.dicepool[0].level).toBe('power');
            expect(this.player2.dicepool[1].level).toBe('power');

            expect(this.voidPulse.location).toBe('discard');
            expect(this.sonicSwordsman.damage).toBe(2);
        });
    });
});
