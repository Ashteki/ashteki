describe('Empyrean Mount', function () {
    describe('Battlemaster', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['empyrean-mount', 'fire-archer'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: [],
                    archives: ['empyrean-mount']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['flute-mage', 'hammer-knight'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
            //this.hammerKnight.tokens.exhaustion = 1;
        });

        it('forces unit to block', function () {
            this.player1.clickPrompt('Attack');

            this.player1.clickCard(this.aradelSummergaard); // target
            this.player1.clickCard(this.empyreanMount); // attacker
            this.player1.clickCard(this.fireArcher); //attacker

            this.player1.clickPrompt('Done'); // 2 attackers

            expect(this.player1).toHavePrompt('Choose a unit to force it to block');
            this.player1.clickCard(this.fluteMage); // single blocker

            expect(this.player2).toHavePrompt('Choose a blocker');
            expect(this.player2).toBeAbleToSelect(this.hammerKnight);
            this.player2.clickCard(this.hammerKnight);
            //expect(this.player2).not.toBeAbleToSelect(this.empyreanMount);
        });
    });
});
