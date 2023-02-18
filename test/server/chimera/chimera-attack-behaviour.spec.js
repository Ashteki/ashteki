describe('When Attacked', function () {
    describe('an aspect will counter', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy', 'sympathy'],
                    hand: ['shatter-pulse', 'summon-iron-rhino']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'viros-s1',
                    behaviour: 'viros-behaviour-1',
                    ultimate: 'viros-ultimate-1',
                    inPlay: ['rampage'],
                    spellboard: [],
                    threatZone: ['hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
        });

        it('attacker takes damage and aspect is not exhausted', function () {
            this.player1.clickAttack(this.rampage);
            this.player1.clickCard(this.fluteMage);

            expect(this.rampage.location).toBe('play area');
            expect(this.rampage.damage).toBe(1);
            expect(this.fluteMage.location).toBe('discard');
            expect(this.rampage.exhausted).toBe(false);
        });
    });
});