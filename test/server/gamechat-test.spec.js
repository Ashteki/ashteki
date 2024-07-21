describe('GameChat', function () {
    describe('short game', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    spellboard: ['summon-butterfly-monk'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    archives: ['butterfly-monk'],
                    hand: ['one-hundred-blades', 'will-to-survive']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage', 'hammer-knight', 'anchornaut'],
                    spellboard: [],
                    hand: ['redirect'],
                    dicepool: ['natural', 'natural', 'charm']
                }
            });
        });

        it('test for exploring simple text output', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.mistSpirit); // single attacker
            this.player1.clickPrompt('Done'); // end attacker select
            this.player2.clickPrompt('Done'); // don't place blocker

            // any interrupts?
            this.player2.clickCard(this.redirect); // click redirect to play as reaction
            this.player2.clickCard(this.hammerKnight); // redirect damage to hammerKnight

            const textChat = this.game.gameChat.getChatAsText();
            expect(textChat).not.toBe('');
        });
    });
});
