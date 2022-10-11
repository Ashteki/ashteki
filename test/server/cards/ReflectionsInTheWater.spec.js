describe('Reflections In the Water', function () {
    describe('blanking effects', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker'],
                    spellboard: ['hypnotize', 'strengthen'],
                    dicepool: ['charm', 'charm', 'illusion'],
                    hand: ['reflections-in-the-water']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'iron-rhino'],
                    spellboard: []
                }
            });
        });

        it('reflections in the water blanks hypnotize bypass effect', function () {
            expect(this.ironWorker.anyEffect('bypass')).toBe(false);
            this.player1.clickCard(this.hypnotize);
            this.player1.clickPrompt('Hypnotize a unit');
            this.player1.clickCard(this.ironWorker);

            expect(this.ironWorker.anyEffect('bypass')).toBe(true);

            this.player1.actions.side += 1;
            this.player1.play(this.reflectionsInTheWater);
            this.player1.clickDie(2);
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.upgrades.length).toBe(1);
            expect(this.ironWorker.anyEffect('bypass')).toBe(false);
        });

        it('blanks printed ability - overkill', function () {
            expect(this.ironRhino.hasKeyword('overkill')).toBe(true);
            this.player1.play(this.reflectionsInTheWater);
            this.player1.clickDie(2);
            this.player1.clickCard(this.ironRhino);
            expect(this.ironRhino.hasKeyword('overkill')).toBe(false);
        });

        it('does not remove strengthen attack boost', function () {
            expect(this.ironWorker.attack).toBe(2);
            this.player1.clickCard(this.strengthen);
            this.player1.clickPrompt('Strengthen a unit');
            this.player1.clickCard(this.ironWorker);

            expect(this.ironWorker.attack).toBe(4);

            this.player1.actions.side += 1;
            this.player1.play(this.reflectionsInTheWater);
            this.player1.clickDie(2);
            this.player1.clickCard(this.ironWorker);
            expect(this.ironWorker.upgrades.length).toBe(1);
            expect(this.ironWorker.attack).toBe(4);
        });
    });

    describe('blanking effects vs root armor', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker'],
                    spellboard: ['hypnotize', 'strengthen'],
                    dicepool: ['charm', 'natural', 'illusion'],
                    hand: ['root-armor']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'iron-rhino'],
                    spellboard: [],
                    dicepool: ['charm', 'charm', 'illusion'],
                    hand: ['reflections-in-the-water']
                }
            });
        });

        it('reflections in the water blanks ability but not stat buff', function () {
            this.player1.play(this.rootArmor, this.ironWorker);
            expect(this.ironWorker.life).toBe(3);
            expect(this.ironWorker.armor).toBe(1);

            this.player1.endTurn();
            this.player2.play(this.reflectionsInTheWater);
            this.player2.clickDie(2);
            this.player2.clickCard(this.ironWorker);
            expect(this.ironWorker.upgrades.length).toBe(2);
            expect(this.ironWorker.life).toBe(3);
            expect(this.ironWorker.isBlank()).toBe(true);
            expect(this.ironWorker.armor).toBe(0);
        });
    });
});
