describe('Armor of Valor', function () {
    describe('attached to pb', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'odette-diamondcrest',
                    inPlay: ['mist-spirit', 'raptor-herder', 'time-hopper'],
                    hand: ['armor-of-valor'],
                    dicepool: ['ceremonial', 'ceremonial'],
                    discard: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['hammer-knight', 'iron-rhino', 'adept-duelist'],
                    dicepool: ['ceremonial', 'charm'],
                    hand: ['choke']
                }
            });
        });

        it('attach. prevent 1 guard damage', function () {
            this.player1.play(this.armorOfValor);
            this.player1.clickDie(0);
            expect(this.odetteDiamondcrest.upgrades.length).toBe(1);

            this.player1.endTurn();
            this.player2.clickAttack(this.mistSpirit);
            this.player2.clickCard(this.ironRhino);
            this.player1.clickCard(this.odetteDiamondcrest);

            expect(this.odetteDiamondcrest.damage).toBe(this.ironRhino.attack - 1);
        });

        it('attach. does not prevent opponent attack damage', function () {
            this.player1.play(this.armorOfValor);
            this.player1.clickDie(0);
            expect(this.odetteDiamondcrest.upgrades.length).toBe(1);

            this.player1.endTurn();
            this.player2.clickAttack(this.odetteDiamondcrest);
            this.player2.clickCard(this.ironRhino);
            this.player2.clickDone();

            expect(this.odetteDiamondcrest.damage).toBe(this.ironRhino.attack);
        });

        it('attach, no trigger on self inflicted', function () {
            this.player1.play(this.armorOfValor);
            this.player1.clickDie(1);
            expect(this.odetteDiamondcrest.upgrades.length).toBe(1);

            this.player1.actions.side++; // fudge

            this.player1.clickDie(0);
            this.player1.clickPrompt('Ceremonial Dice Power');
            this.player1.clickCard(this.anchornaut);

            expect(this.anchornaut.location).toBe('hand');
            expect(this.odetteDiamondcrest.damage).toBe(1);
        });

        it('attach. does not prevent action spell damage', function () {
            this.player1.play(this.armorOfValor);
            this.player1.clickDie(1);
            expect(this.odetteDiamondcrest.upgrades.length).toBe(1);

            this.player1.endTurn();
            this.player2.play(this.choke);
            expect(this.odetteDiamondcrest.exhausted).toBe(true);
            expect(this.odetteDiamondcrest.damage).toBe(1);
            expect(this.player2).toHaveDefaultPrompt();
        });

        it('attach. prevent 1 damage from enter the fray', function () {
            this.player1.play(this.armorOfValor);
            this.player1.clickDie(0);
            expect(this.odetteDiamondcrest.upgrades.length).toBe(1);

            this.player1.clickCard(this.odetteDiamondcrest);
            this.player1.clickPrompt('Enter the Fray');
            this.player1.clickCard(this.hammerKnight);

            expect(this.hammerKnight.damage).toBe(2);
            expect(this.odetteDiamondcrest.damage).toBe(this.hammerKnight.attack - 1);
        });
    });
});
