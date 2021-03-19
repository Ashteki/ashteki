describe('Imperial Ninja reaction', function () {
    describe('with deck', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'brennen-blackcloud',
                    inPlay: ['imperial-ninja', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    archives: ['butterfly-monk']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage', 'hammer-knight'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['redirect'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    deck: ['molten-gold', 'open-memories', 'molten-gold', 'empower']
                }
            });
        });

        it('prompts for choice when ninja is declared attacker', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.imperialNinja); // single attacker
            this.player1.clickPrompt('Done'); // end attacker select

            expect(this.player2).toHavePromptButton('Discard Redirect');
            expect(this.player2).toHavePromptButton('Discard 2 top of deck');
        });
    });

    describe('empty deck', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'brennen-blackcloud',
                    inPlay: ['imperial-ninja', 'mist-spirit'],
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

        it('limits choice when empty deck', function () {
            this.player2.player.deck = [];

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.imperialNinja); // single attacker
            this.player1.clickPrompt('Done'); // end attacker select

            expect(this.player2).toHavePromptButton('Discard Redirect');
            expect(this.player2).not.toHavePromptButton('Discard 2 top of deck');
        });
    });
});
