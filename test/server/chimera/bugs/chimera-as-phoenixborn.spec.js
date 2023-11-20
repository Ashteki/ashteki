describe('Chimera as Pb', function () {
    describe('Namine Calming Melody', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'namine-hymntide',
                    inPlay: ['blue-jaguar', 'mist-spirit'],
                    dicepool: ['natural', 'sympathy', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    discard: ['iron-scales', 'constrict', 'firebelly', 'lurk'],
                    deck: ['rampage']
                }
            });
        });

        it('can exhaust chimera', function () {
            expect(this.corpseOfViros.exhausted).toBe(false);
            this.player1.clickCard(this.namineHymntide);
            this.player1.clickPrompt('Calming Melody');
            this.player1.clickYes();
            expect(this.corpseOfViros.exhausted).toBe(true);
        });
    });
});
