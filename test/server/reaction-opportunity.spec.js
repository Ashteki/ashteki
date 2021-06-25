describe('Reaction opportunities', function () {
    describe('Only once each', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'brennen-blackcloud',
                    inPlay: ['fire-archer'],
                    dicepool: [
                        'ceremonial',
                        'ceremonial',
                        'sympathy',
                        'ceremonial',
                        'illusion',
                        'charm',
                        'charm'
                    ],
                    spellboard: [],
                    hand: ['crescendo', 'iron-worker'],
                    archives: ['sleeping-widow', 'sleeping-widow']
                },
                player2: {
                    phoenixborn: 'jessa-na-ni',
                    inPlay: ['anchornaut', 'mist-spirit'],
                    spellboard: [],
                    dicepool: [
                        'charm',
                        'charm',
                        'time',
                        'ceremonial',
                        'ceremonial',
                        'natural',
                        'natural'
                    ],
                    hand: ['outmatch']
                }
            });
        });

        it('Only allow one reaction', function () {
            this.player1.clickAttack(this.jessaNaNi);
            this.player1.clickCard(this.fireArcher);
            this.player1.clickDone();

            expect(this.player1).toHavePrompt('Any reactions to attackers being declared?');
            this.player1.clickPass(); // first opportunity
            expect(this.player2).toHavePrompt('Any reactions to attackers being declared?');
            this.player2.clickCard(this.outmatch);
            this.player2.clickCard(this.anchornaut);

            expect(this.anchornaut.attack).toBe(4);
            expect(this.player1).not.toHavePrompt('Any reactions to attackers being declared?');
            expect(this.player2).toHavePrompt('Choose a blocker');
        });
    });
});
