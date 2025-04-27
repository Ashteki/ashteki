describe('Memory Theft', function () {
    describe('vs player', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker'],
                    dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                    spellboard: ['memory-theft']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    spellboard: ['empower', 'law-of-grace']
                }
            });
        });

        it('damage option taken deals wounds, ignores law of grace', function () {
            this.player1.clickCard(this.memoryTheft);
            this.player1.clickPrompt('Memory Theft');

            this.player2.clickPrompt('damage');
            expect(this.aradelSummergaard.damage).toBe(1);
        });
    });

    describe('vs chimera discarding last card in hand and deck', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'leo-sunshadow',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['memory-theft']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: [],
                    deck: ['rampage'],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    discard: [
                        'iron-scales',
                        'sowing-strike',
                        'proliferate',
                        'constrict',
                        'crushing-grip'
                    ]
                }
            });
        });

        it('it should trigger deck recycle', function () {
            this.player2.player.deck = [this.rampage];
            expect(this.ironScales.location).toBe('discard');
            this.player1.useAbility(this.memoryTheft);
            expect(this.player2.hand.length).toBe(1);
            expect(this.player2.deck.length).toBe(0);
            this.player1.clickCard(this.rampage);
            this.player1.clickPrompt('discard');

            expect(this.player2.hand.length).toBe(0);
            expect(this.player2.deck.length).toBe(6); // rampage goes into discard, then deck is reformed from discard pile

            expect(this.blightOfNeverset.damage).toBe(0);
            this.player1.clickOk(); // fatigue alert
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('it should trigger deck recycle when fatigued', function () {
            this.player2.player.applyFatigue();
            this.player2.player.deck = [this.rampage];

            this.player1.useAbility(this.memoryTheft);
            expect(this.player2.hand.length).toBe(1);
            expect(this.player2.deck.length).toBe(0);
            this.player1.clickCard(this.rampage);
            this.player1.clickPrompt('discard');

            expect(this.player2.hand.length).toBe(0);
            expect(this.player2.deck.length).toBe(6); // rampage goes into discard, then deck is reformed from discard pile

            expect(this.blightOfNeverset.damage).toBe(1); // 1 damage from discard when fatigued

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
