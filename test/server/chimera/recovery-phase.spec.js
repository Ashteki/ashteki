const Dice = require('../../../server/game/dice');

describe('Chimera recovery phase', function () {
    describe('Player Prompts', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            this.player1.endTurn();
            // no threat to reveal, no units to attack should PASS chimera turn
        });

        it('should not prompt during recovery phase', function () {
            expect(this.player1).toHavePrompt('Select dice to keep');
            expect(this.player2).not.toHavePrompt('Select dice to keep');

            this.player1.clickDie(0);
            this.player1.clickDone();
            // next turn
            expect(this.game.round).toBe(2);
        });
    });

    describe('Red Rains - status tokens', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['rampage'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            this.rampage.tokens.exhaustion = 1; // should end turn
            this.player1.endTurn();
            // no threat to reveal, no unexhausted units to attack should PASS chimera turn
        });

        it('should refill status tokens for each aspect in play', function () {
            this.rampage.tokens.status = 0;
            expect(this.rampage.status).toBe(0);
            expect(this.game.round).toBe(1);

            // player 1 pin dice
            this.player1.clickDie(0);
            this.player1.clickDone();
            // recovery makes status 2, then status effect and reroll makes -1, so 1
            expect(this.rampage.status).toBe(1);
            // next turn
            expect(this.game.round).toBe(2);
        });
    });

    describe('Red Rains tokens', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['iron-scales'],
                    deck: [],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            this.ironScales.tokens.exhaustion = 1; // should end turn
            this.corpseOfViros.tokens.redRains = 1;
            this.corpseOfViros.tokens.exhaustion = 1;
            this.player1.endTurn();
            // no threat to reveal, no unexhausted units to attack should PASS chimera turn
        });

        it('should place a RR token for each aspect in play, remove 1 for each exhaustion', function () {
            expect(this.game.round).toBe(1);
            // player 1 pin dice
            this.player1.clickDie(0);
            this.player1.clickDone();

            // recovery
            expect(this.corpseOfViros.redRains).toBe(1); // remove 1 from exhaustion

            // next turn
            expect(this.game.round).toBe(2);
            expect(this.corpseOfViros.exhaustion).toBe(0);
        });
    });

    describe('Replenish aspects when battlefield full', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'blight-of-neverset',
                    behaviour: 'neverset-behaviour',
                    ultimate: 'neverset-ultimate',
                    inPlay: [
                        'iron-scales',
                        'sowing-strike',
                        'proliferate',
                        'constrict',
                        'crushing-grip'
                    ],
                    deck: ['wild-throw', 'soothing-scent', 'soothing-scent'],
                    spellboard: [],
                    threatZone: [],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            this.ironScales.tokens.exhaustion = 1; // should end turn
            this.sowingStrike.tokens.exhaustion = 1; // should end turn
            this.proliferate.tokens.exhaustion = 1; // should end turn
            this.constrict.tokens.exhaustion = 1; // should end turn
            this.crushingGrip.tokens.exhaustion = 1; // should end turn
            this.player1.endTurn();
            // no threat to reveal, no unexhausted units to attack should PASS chimera turn
        });

        it('should not place aspects if battlefield is greater than threat', function () {
            expect(this.game.round).toBe(1);
            // player 1 pin dice
            this.player1.clickDie(0);
            this.player1.clickDone();

            // next turn
            expect(this.game.round).toBe(2);
            expect(this.blightOfNeverset.exhaustion).toBe(0);
            expect(this.player2.threatZone.length).toBe(0);
            expect(this.player2.deck.length).toBe(3);
        });
    });

    describe('Replenish Aspects when deck empty', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
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

        it('deck should refill from discard and fill threat zone', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(1); // reveal

            expect(this.player2.player.chimera.threat).toBe(4);
            this.player2.player.deck = [this.rampage]; // ensure only one card in deck
            this.player1.endTurn();
            expect(this.game.round).toBe(1);
            // player 1 pin dice
            this.player1.clickDie(0);
            this.player1.clickDone();
            this.player1.clickOk(); // fatigue alert

            // next turn
            expect(this.game.round).toBe(2);
            expect(this.blightOfNeverset.exhaustion).toBe(0);
            expect(this.player2.threatZone.length).toBe(4);
            expect(this.player2.deck.length).toBe(2);
            expect(this.player2.discard.length).toBe(0);
            this.player1.clickOk(); // rage and behaviour alert

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('Fatigue should not affect reshuffle', function () {
            spyOn(Dice, 'd12Roll').and.returnValue(1); // reveal

            this.player2.player.applyFatigue();
            expect(this.player2.player.chimera.threat).toBe(4);
            this.player2.player.deck = [this.rampage]; // ensure only one card in deck
            this.player1.endTurn();
            expect(this.game.round).toBe(1);
            // player 1 pin dice
            this.player1.clickDie(0);
            this.player1.clickDone();
            // next turn
            expect(this.game.round).toBe(2);
            expect(this.blightOfNeverset.exhaustion).toBe(0);
            expect(this.player2.threatZone.length).toBe(4);
            expect(this.player2.deck.length).toBe(2);
            expect(this.player2.discard.length).toBe(0);

            this.player1.clickOk(); // rage and behaviour alert

            expect(this.player1).toHaveDefaultPrompt();
        });

        // it('should cope with empty deck error state', function () {
        //     spyOn(Dice, 'd12Roll').and.returnValue(1); // reveal

        //     this.player2.player.applyFatigue();
        //     expect(this.player2.player.chimera.threat).toBe(4);
        //     this.player2.player.deck = []; // ensure no card in deck
        //     this.player1.endTurn();
        //     expect(this.game.round).toBe(1);
        //     // player 1 pin dice
        //     this.player1.clickDie(0);
        //     this.player1.clickDone();
        //     // next turn
        //     expect(this.game.round).toBe(2);
        //     expect(this.blightOfNeverset.exhaustion).toBe(0);
        //     expect(this.player2.threatZone.length).toBe(4);
        //     expect(this.player2.deck.length).toBe(2);
        //     expect(this.player2.discard.length).toBe(0);

        //     this.player1.clickOk(); // rage and behaviour alert

        //     expect(this.player1).toHaveDefaultPrompt();
        // });
    });
});
