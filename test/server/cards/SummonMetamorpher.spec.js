const { Level } = require('../../../server/constants');

describe('Summon Metamorpher', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-metamorpher'],
                    dicepool: [
                        'charm',
                        'time',
                        'natural',
                        'natural',
                        'time',
                        'sympathy',
                        'sympathy'
                    ],
                    archives: ['metamorpher']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
                    spellboard: []
                }
            });
        });

        it('should place a metamorpher into play', function () {
            this.player1.clickCard(this.summonMetamorpher);
            this.player1.clickPrompt('Summon Metamorpher');
            this.player1.clickDie(0);
            expect(this.metamorpher.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('when focus 1', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-metamorpher', 'summon-metamorpher'],
                    dicepool: [
                        'charm',
                        'time',
                        'natural',
                        'natural',
                        'time',
                        'sympathy',
                        'sympathy'
                    ],
                    hand: [],
                    archives: ['metamorpher'],
                    deck: ['purge', 'summon-gilder', 'anchornaut']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
                    spellboard: []
                }
            });
        });

        it('summon then draw 1 card', function () {
            const handSize = this.player1.hand.length;
            this.player1.clickCard(this.summonMetamorpher);
            this.player1.clickPrompt('Summon Metamorpher');
            this.player1.clickDie(0);
            expect(this.metamorpher.location).toBe('play area');
            expect(this.player1.hand.length).toBe(handSize + 1);
            expect(this.player2).toHavePrompt('Waiting for opponent');
        });
    });

    describe('when focus 2', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: ['summon-metamorpher', 'summon-metamorpher', 'summon-metamorpher'],
                    dicepool: [
                        'charm',
                        'time',
                        'natural',
                        'natural',
                        'time',
                        'sympathy',
                        'sympathy'
                    ],
                    hand: ['river-skald'],
                    archives: ['metamorpher'],
                    deck: ['purge', 'summon-gilder', 'anchornaut'],
                    discard: ['abundance', 'molten-gold', 'iron-worker']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: [],
                    spellboard: []
                }
            });
        });

        it('summon then draw 1 card then discard to tutor a spell from discard', function () {
            this.player1.player.deck = [this.purge, this.summonGilder, this.anchornaut];
            const handSize = this.player1.hand.length;
            this.player1.clickCard(this.summonMetamorpher);
            this.player1.clickPrompt('Summon Metamorpher');
            this.player1.clickDie(0);
            expect(this.metamorpher.location).toBe('play area');
            expect(this.player1.hand.length).toBe(handSize + 1);
            // this.player1.clickYes();
            this.player1.clickCard(this.riverSkald); // discard
            expect(this.player1).toBeAbleToSelect(this.abundance);
            expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
            this.player1.clickCard(this.moltenGold);
            expect(this.moltenGold.location).toBe('deck');
            expect(this.player1.deck[this.player1.deck.length - 1]).toBe(this.moltenGold);
            expect(this.player2).toHavePrompt('Waiting for opponent');
        });
    });
});
