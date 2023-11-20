describe('Purify Action Spell', function () {
    describe('Happy Path', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker', 'anchornaut'],
                    dicepool: ['charm', 'charm'],
                    hand: ['blood-chains', 'purify'],
                    spellboard: []
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit'],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('return ally to hand then destroy conjuration', function () {
            this.player1.play(this.purify);
            this.player1.clickDie(0);
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.mistSpirit);
            expect(this.anchornaut.location).toBe('hand');
            expect(this.mistSpirit.location).toBe('archives');
            expect(this.purify.location).toBe('discard');
        });
    });

    describe('without conjuration target', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker', 'anchornaut'],
                    dicepool: ['charm', 'charm'],
                    hand: ['blood-chains', 'purify'],
                    spellboard: []
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: [],
                    spellboard: ['summon-butterfly-monk']
                }
            });
        });

        it('return ally to hand', function () {
            this.player1.play(this.purify);
            this.player1.clickDie(0);
            this.player1.clickCard(this.anchornaut);
            expect(this.purify.location).toBe('discard');
            expect(this.anchornaut.location).toBe('hand');
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('vs Chimera', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['iron-worker', 'anchornaut'],
                    dicepool: ['charm', 'charm'],
                    hand: ['blood-chains', 'purify'],
                    spellboard: []
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    discard: ['iron-scales', 'constrict', 'firebelly', 'lurk'],
                    inPlay: ['rampage']
                }
            });
        });

        it('return ally to hand then destroy conjuration', function () {
            this.player1.play(this.purify);
            this.player1.clickDie(0);
            this.player1.clickCard(this.anchornaut);
            this.player1.clickCard(this.rampage);
            expect(this.anchornaut.location).toBe('hand');
            expect(this.rampage.location).toBe('discard');
            expect(this.purify.location).toBe('discard');
        });
    });

});
