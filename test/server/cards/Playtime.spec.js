describe('Playtime', function () {
    describe('On declared Attacker', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'james-endersight',
                    inPlay: ['crystal-archer', 'mist-spirit', 'raptor-herder', 'time-hopper'],
                    hand: ['playtime'],
                    dicepool: ['ceremonial']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight', 'iron-rhino', 'flute-mage']
                }
            });
        });

        it('pb damage on attack', function () {
            this.player1.play(this.playtime);
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.upgrades.length).toBe(1);
            expect(this.hammerKnight.attack).toBe(2);

            this.player1.endTurn();
            this.player2.clickAttack(this.mistSpirit);
            this.player2.clickCard(this.hammerKnight);
            this.player1.clickDone();
            this.player1.clickNo();

            expect(this.aradelSummergaard.damage).toBe(1);
        });

        it('no trigger on other unit attack', function () {
            this.player1.play(this.playtime);
            this.player1.clickCard(this.hammerKnight);
            expect(this.hammerKnight.upgrades.length).toBe(1);
            expect(this.hammerKnight.attack).toBe(2);

            this.player1.endTurn();
            this.player2.clickAttack(this.mistSpirit);
            this.player2.clickCard(this.fluteMage);
            this.player1.clickDone();
            this.player1.clickNo();

            expect(this.aradelSummergaard.damage).toBe(0);
        });
    });

    describe('on defender declared', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'james-endersight',
                    inPlay: ['blood-archer', 'mist-spirit', 'raptor-herder', 'time-hopper'],
                    hand: ['playtime'],
                    dicepool: ['ceremonial'],
                    archives: ['blood-puppet']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight', 'iron-rhino']
                }
            });

            this.hammerKnight.tokens.damage = 1;
        });

        it('1 damage to pb', function () {
            this.player1.play(this.playtime);
            this.player1.clickCard(this.hammerKnight);
            this.player1.endTurn();
            this.player2.endTurn();

            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickCard(this.bloodArcher);
            this.player1.clickDone();

            this.player2.clickCard(this.hammerKnight);
            this.player2.clickCard(this.bloodArcher);
            this.player2.clickDone();

            expect(this.aradelSummergaard.damage).toBe(1);

            // check for blood puppet summon
            expect(this.bloodPuppet.location).toBe('play area');
        });
    });
});
