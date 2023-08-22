describe('Will to Survive ', function () {
    describe('In Play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'koji-wolfcub',
                    inPlay: ['mist-spirit'],
                    dicepool: ['ceremonial', 'charm', 'natural'],
                    hand: ['ritualist', 'jungle-forager', 'will-to-survive'],
                    discard: ['chant-of-revenge', 'anchornaut'],
                    deck: ['purge', 'chant-of-sacrifice', 'wallop', 'change-of-heart']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['frost-fang', 'iron-worker'],
                    dicepool: ['illusion', 'natural'],
                    hand: ['safeguard']
                }
            });

            this.kojiWolfcub.tokens.damage = 5;
        });

        it('buffs unit and unit gains life drain', function () {
            expect(this.kojiWolfcub.damage).toBe(5);
            this.player1.play(this.willToSurvive, this.mistSpirit);
            expect(this.mistSpirit.upgrades.length).toBe(1);
            expect(this.mistSpirit.attack).toBe(2);
            expect(this.mistSpirit.life).toBe(2);

            this.player1.clickAttack(this.ironWorker);
            this.player1.clickCard(this.mistSpirit);
            this.player2.clickDone();
            this.player2.clickNo();
            expect(this.ironWorker.location).toBe('discard');
            expect(this.kojiWolfcub.damage).toBe(4);
        });
    });
});
