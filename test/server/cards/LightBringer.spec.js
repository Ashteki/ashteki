describe('Light Bringer in play', function () {
    describe('with units', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: [
                        'illusion',
                        'natural',
                        'natural',
                        'sympathy',
                        'sympathy',
                        'ceremonial',
                        'charm'
                    ],
                    hand: ['call-upon-the-realms', 'molten-gold'],
                    spellboard: ['summon-gilder']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    spellboard: ['summon-light-bringer'],
                    archives: ['light-bringer'],
                    dicepool: ['divine'],
                    hand: ['summon-biter']
                }
            });

            this.player1.endTurn();
            this.player2.clickCard(this.summonLightBringer);
            this.player2.clickPrompt('Summon Light Bringer');
            this.player2.clickCard(this.lightBringer);
            this.player2.endTurn();
        });

        it('stops opponent playing main actions', function () {
            expect(this.player1).toHaveDefaultPrompt();

            this.player1.clickCard(this.callUponTheRealms);
            expect(this.player1).toHaveDefaultPrompt();
            this.player1.clickCard(this.moltenGold);
            expect(this.player1).toHaveDefaultPrompt();
            this.player1.clickCard(this.summonGilder); // spellboard
            expect(this.player1).toHaveDefaultPrompt();

            // check player can attack
            this.player1.clickPrompt('Attack');
            expect(this.player1).not.toHaveDefaultPrompt();
            this.player1.clickCard(this.lightBringer);
            this.player1.clickCard(this.mistSpirit);
            this.player2.clickPrompt('Done');
        });

        it('stops opponent passing main action (end turn)', function () {
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player1.actions.main).toBe(true);

            this.player1.clickPrompt('End Turn');
            expect(this.player1).toHaveDefaultPrompt();

            // check player can attack
            this.player1.clickPrompt('Attack');
            expect(this.player1).not.toHaveDefaultPrompt();
            this.player1.clickCard(this.lightBringer);
            this.player1.clickCard(this.mistSpirit);
            this.player2.clickPrompt('Done');
        });

        it('lasts only one turn', function () {
            // cannot pass so must attack
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.rinNorthfell);
            this.player1.clickCard(this.mistSpirit);
            this.player1.clickDone();
            this.player2.clickDone();
            this.player1.endTurn();

            this.player2.clickCard(this.summonBiter); // use main action
            this.player2.clickPrompt('Play this ready spell');
            this.player2.endTurn();

            this.player1.clickCard(this.callUponTheRealms);
            expect(this.player1).not.toHaveDefaultPrompt();
            expect(this.player1).toHavePrompt('Call upon the realms');
            this.player1.clickPrompt('Play this action');
        });
    });

    describe('no units - no effect', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
                    dicepool: [
                        'illusion',
                        'natural',
                        'natural',
                        'sympathy',
                        'sympathy',
                        'ceremonial'
                    ],
                    hand: ['call-upon-the-realms']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    spellboard: ['summon-light-bringer'],
                    archives: ['light-bringer'],
                    dicepool: ['divine']
                }
            });

            this.player1.endTurn();
            this.player2.clickCard(this.summonLightBringer);
            this.player2.clickPrompt('Summon Light Bringer');
            this.player2.clickCard(this.lightBringer);
            this.player2.endTurn();
        });

        it('does not stop opponent playing main actions spell', function () {
            this.player1.clickCard(this.callUponTheRealms);
            expect(this.player1).not.toHaveDefaultPrompt();
            expect(this.player1).toHavePrompt('Call upon the realms');
            this.player1.clickPrompt('Play this action');
        });
    });
});
