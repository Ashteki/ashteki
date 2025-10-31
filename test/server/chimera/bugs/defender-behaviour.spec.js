describe('Defender behaviour', function () {
    describe('on attack', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'solo',
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['essence-druid', 'iron-worker', 'flute-mage'],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    spellboard: ['summon-butterfly-monk'],
                    hand: ['generosity']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['iron-scales', 'scarlet-seed'],
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

        it('defender will guard for scarlet seed', function () {
            this.player1.clickAttack(this.scarletSeed);
            this.player1.clickCard(this.essenceDruid);
            this.player1.clickOk(); // guard!
            expect(this.ironScales.damage).toBe(1);
            expect(this.essenceDruid.damage).toBe(1);
            expect(this.player1).toHaveDefaultPrompt();
        });

        it('attacker order should mirror battlefield order', function () {
            this.player1.clickAttack(this.corpseOfViros);
            this.player1.clickCard(this.ironWorker); // iron worker chosen first but is not leftmost
            this.player1.clickCard(this.essenceDruid);
            this.player1.clickCard(this.fluteMage);
            this.player1.clickDone();
            this.player1.clickCard(this.ironWorker);
            this.player1.clickCard(this.essenceDruid);
            this.player1.clickCard(this.fluteMage);

            expect(this.ironScales.damage).toBe(1);
            expect(this.essenceDruid.damage).toBe(1);
            expect(this.ironWorker.damage).toBe(0);
            expect(this.ironWorker.location).toBe('play area');
            expect(this.player1).toHaveDefaultPrompt();
        });

    });
});
