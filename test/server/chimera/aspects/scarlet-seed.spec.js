const Dice = require('../../../../server/game/dice');

describe('Scarlet Seed', function () {
    describe('Ability In Play', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'tsunami-shot']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['scarlet-seed'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });

            spyOn(Dice, 'd12Roll').and.returnValue(1);
            this.scarletSeed.tokens.status = 2;
            this.player2.dicepool.forEach(d => d.level = 'basic');
        });

        it('the last status discards and places a redrains token', function () {
            this.scarletSeed.tokens.status = 1;
            expect(this.scarletSeed.location).toBe('play area');
            this.player1.endTurn();
            this.player1.clickOk();
            expect(this.scarletSeed.location).toBe('archives');
            expect(this.corpseOfViros.redRains).toBe(1);
        });

        it('can kill with tsunami shot', function () {
            this.scarletSeed.tokens.status = 1;
            expect(this.scarletSeed.location).toBe('play area');
            this.player1.play(this.tsunamiShot);
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();
            this.player1.clickCard(this.scarletSeed);
            expect(this.scarletSeed.location).toBe('archives');
        });
    });
});
