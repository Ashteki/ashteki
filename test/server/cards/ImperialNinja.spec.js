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
                    hand: ['redirect', 'purge', 'abundance'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    deck: ['molten-gold', 'open-memories', 'molten-gold', 'empower']
                }
            });
        });

        it('prompts for choice when ninja is declared attacker - discard revealed card', function () {
            const handLength = this.player2.hand.length;
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.imperialNinja); // single attacker
            this.player1.clickPrompt('Done'); // end attacker select

            this.player1.clickOk(); // alert revealed card
            this.player2.clickPromptButton(0);
            expect(this.player2.hand.length).toBe(handLength - 1);
        });
    });

    describe('vs vanish', function () {
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
                    hand: ['vanish'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'illusion'],
                    deck: ['molten-gold', 'open-memories', 'molten-gold', 'empower']
                }
            });
        });

        it('prompts for choice when ninja is declared attacker', function () {
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // target
            this.player1.clickCard(this.imperialNinja); // single attacker
            this.player1.clickPrompt('Done'); // end attacker select

            // because vanish is prompting reaction
            expect(this.player2).not.toHavePromptButton('Discard Vanish');
            expect(this.player2).not.toHavePromptButton('Discard 2 top of deck');

            this.player2.clickCard(this.vanish); // cancel the reveal etc
            expect(this.player2).toHavePrompt('Choose a blocker');
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
            this.player1.clickOk(); // alert revealed card

            expect(this.player2).toHavePromptButton('Discard Redirect');
            expect(this.player2).not.toHavePromptButton('Discard 2 top of deck');
        });
    });
});
