describe('Glory Aspirant', function () {
    describe('Enters play effect', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['mist-spirit'],
                    dicepool: ['divine', 'charm', 'ceremonial'],
                    hand: ['glory-aspirant'],
                    discard: ['radiant-light', 'anchornaut'],
                    deck: ['purge', 'chant-of-sacrifice', 'silver-paladin']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['particle-shield', 'safeguard']
                }
            });
        });

        it('tutor a card with lion play cost then change a die', function () {
            this.player1.dicepool[0].level = 'basic';
            this.player1.dicepool[1].level = 'basic';
            expect(this.player1.dicepool[0].level).toBe('basic');
            expect(this.player1.dicepool[1].level).toBe('basic');

            this.player1.clickCard(this.gloryAspirant);
            this.player1.clickPrompt('Play this Ally');
            this.player1.clickDie(2);
            expect(this.gloryAspirant.location).toBe('play area');

            expect(this.player1).toBeAbleToSelect(this.silverPaladin);
            expect(this.player1).not.toBeAbleToSelect(this.chantOfSacrifice);
            // not discard
            expect(this.player1).not.toBeAbleToSelect(this.radiantLight);
            this.player1.clickCard(this.silverPaladin);
            expect(this.silverPaladin.location).toBe('hand');

            this.player1.clickDie(1); // nope to charm etc
            this.player1.clickDie(0);
            this.player1.clickDone();
            expect(this.player1.dicepool[1].level).toBe('basic');
            expect(this.player1.dicepool[0].level).toBe('power');
        });
    });

    describe('Enters play effect with no lions', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'dimona-odinstar',
                    inPlay: ['mist-spirit'],
                    dicepool: ['divine', 'charm', 'ceremonial'],
                    hand: ['glory-aspirant'],
                    discard: ['radiant-light', 'anchornaut'],
                    deck: ['purge', 'chant-of-sacrifice']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['particle-shield', 'safeguard']
                }
            });
        });

        it('no card to tutor still triggers die change', function () {
            this.player1.dicepool[0].level = 'basic';
            expect(this.player1.dicepool[0].level).toBe('basic');

            this.player1.clickCard(this.gloryAspirant);
            this.player1.clickPrompt('Play this Ally');
            this.player1.clickDie(2);
            expect(this.gloryAspirant.location).toBe('play area');
            expect(this.player1).not.toBeAbleToSelect(this.chantOfSacrifice);

            this.player1.clickDie(0);
            this.player1.clickDone();
            expect(this.player1.dicepool[0].level).toBe('power');
        });
    });
});
