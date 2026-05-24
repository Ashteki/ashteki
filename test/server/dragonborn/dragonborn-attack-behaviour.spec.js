const Dice = require('../../../server/game/dice');

describe('When Dragonborn aspect Attacked', function () {
    describe('dragonborn guard', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'flute-mage', 'hammer-knight', 'winged-lioness'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['summon-iron-rhino']
                },
                player2: {
                    dummy: true,

                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    inPlay: ['sear'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('Dragonborn will guard on a basic result', function () {
            spyOn(Dice, 'getRandomInt').and.returnValue(4); // basic
            this.player1.clickAttack(this.sear);
            this.player1.clickCard(this.fluteMage);

            this.player1.clickPrompt('Ok'); // guard roll alert
            expect(this.sear.location).toBe('play area');
            expect(this.sear.damage).toBe(0);
            expect(this.scathaKalani.damage).toBe(1);
            expect(this.fluteMage.location).toBe('play area');
        });

        it('cannot guard against stalk', function () {
            this.player1.clickAttack(this.sear);
            this.player1.clickCard(this.wingedLioness);

            expect(this.sear.location).toBe('discard');
            expect(this.scathaKalani.damage).toBe(2);
            expect(this.wingedLioness.location).toBe('archives');
        });
    });
});
