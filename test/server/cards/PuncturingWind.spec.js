describe('Puncturing Wind', function () {
    describe('with one target', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'kanna-galeheart',
                    inPlay: ['flute-mage', 'iron-worker'],
                    dicepool: ['natural', 'natural', 'astral', 'astral'],
                    spellboard: ['summon-storm-spirit', 'summon-galewind-hawk'],
                    archives: ['the-awakened-state'],
                    hand: ['anchornaut', 'hurricane', 'puncturing-wind', 'rayward-knight']
                },
                player2: {
                    phoenixborn: 'aradel-summergaard',
                    dicepool: ['divine', 'divine', 'natural', 'natural', 'time', 'time'],
                    inPlay: ['beast-tamer', 'blue-jaguar', 'hammer-knight'],
                    spellboard: ['chant-of-revenge']
                }
            });
        });

        it('lower 2 dice, prevent target unit block', function () {
            this.player1.play(this.puncturingWind);
            this.player1.clickOpponentDie(0);
            this.player1.clickOpponentDie(1);
            this.player1.clickDone();
            expect(this.player2.dicepool[1].level).toBe('class');
            this.player1.clickCard(this.hammerKnight);
            this.player1.clickAttack(this.aradelSummergaard);
            this.player1.clickCard(this.ironWorker);
            this.player1.clickDone();

            expect(this.player2).not.toBeAbleToSelect(this.hammerKnight);
            expect(this.player2).toBeAbleToSelect(this.blueJaguar);
            expect(this.player2).toBeAbleToSelect(this.beastTamer);

            this.player2.clickCard(this.hammerKnight);
            this.player2.clickCard(this.blueJaguar);
            this.player2.clickCard(this.ironWorker);
            this.player2.clickDone();

            expect(this.aradelSummergaard.damage).toBe(0);

            expect(this.player1).toHaveDefaultPrompt();
        });

        it('lower 2 dice, prevent phoenixborn guard', function () {
            this.player1.play(this.puncturingWind);
            this.player1.clickOpponentDie(0);
            this.player1.clickOpponentDie(1);
            this.player1.clickDone();
            expect(this.player2.dicepool[1].level).toBe('class');
            this.player1.clickCard(this.aradelSummergaard);

            expect(this.aradelSummergaard.checkRestrictions('guard')).toBe(false); // fails check
            this.player1.clickAttack(this.hammerKnight);
            this.player1.clickCard(this.ironWorker);

            this.player2.clickNo(); // counter
            expect(this.hammerKnight.damage).toBe(2);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('vs Dragonborn', function () {
        beforeEach(function () {
            this.setupTest({
                mode: 'dragonborn',
                player1: {
                    phoenixborn: 'kanna-galeheart',
                    inPlay: ['flute-mage', 'iron-worker'],
                    dicepool: ['natural', 'natural', 'astral', 'astral'],
                    spellboard: ['summon-storm-spirit', 'summon-galewind-hawk'],
                    archives: ['the-awakened-state'],
                    hand: ['anchornaut', 'hurricane', 'puncturing-wind', 'rayward-knight']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'scatha-kalani',
                    behaviour: 'scatha-behaviour',
                    ultimate: 'scatha-ultimate',
                    inPlay: ['dragon-rage'],
                    discard: ['iron-scales', 'firebelly', 'lurk'],
                    dicepool: ['dragon', 'dragon', 'dragon', 'dragon', 'dragon']
                }
            });
            this.player2.dicepool[0].level = 'power';
        });

        it('lower 2 dice, prevent phoenixborn guard', function () {
            this.player1.play(this.puncturingWind);
            this.player1.clickOpponentDie(0);
            this.player1.clickOpponentDie(1);
            this.player1.clickDone();
            expect(this.player2.dicepool[0].level).toBe('class');
            this.player1.clickCard(this.scathaKalani);

            expect(this.scathaKalani.checkRestrictions('guard')).toBe(false); // fails check
            this.player1.clickAttack(this.dragonRage);
            this.player1.clickCard(this.ironWorker);

            expect(this.dragonRage.damage).toBe(2);

            expect(this.player1).toHaveDefaultPrompt();
        });
    });
});
