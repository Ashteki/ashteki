describe('Tame vs Defender', function () {
    describe('discard 2 or discard the shown', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['essence-druid'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['generosity']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['iron-scales'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('tame should be in effect for guard', function () {
            this.player1.clickAttack(this.corpseOfViros);
            this.player1.clickCard(this.essenceDruid);
            this.player1.clickDone();
            expect(this.ironScales.damage).toBe(1);
            expect(this.essenceDruid.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
