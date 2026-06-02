describe('Retreat', function () {
    describe('Action Spell', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'arren-frostpeak',
                    spellboard: ['supercharge', 'retreat'],
                    dicepool: ['astral', 'astral', 'natural', 'natural'],
                    archives: ['spark-drone'],
                    inPlay: ['anchornaut', 'iron-worker'],
                    hand: ['purge', 'massive-growth', 'retreat'],
                    deck: ['sleeping-bear', 'hammer-knight', 'flute-mage']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'iron-rhino'],
                    dicepool: ['artifice', 'ceremonial', 'natural', 'natural'],
                    spellboard: []
                }
            });
        });

        it('returns exhausted ally and all alterations (detached) to hand', function () {
            this.player1.attachUpgrade(this.massiveGrowth, this.anchornaut);
            this.anchornaut.exhaust();

            this.player1.play(this.retreat);
            expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
            this.player1.clickCard(this.anchornaut);

            expect(this.anchornaut.location).toBe('hand');
            expect(this.massiveGrowth.location).toBe('hand');
            expect(this.massiveGrowth.parent).toBeNull();
            expect(this.anchornaut.upgrades.length).toBe(0);
            expect(this.anchornaut.childCards.length).toBe(0);
        });
    });

    describe('Action Spell vs Chimera Conjured Alterations', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'arren-frostpeak',
                    spellboard: ['supercharge', 'retreat'],
                    dicepool: ['astral', 'astral', 'natural', 'natural'],
                    archives: ['spark-drone'],
                    inPlay: ['anchornaut', 'iron-worker'],
                    hand: ['purge', 'massive-growth', 'retreat'],
                    deck: ['sleeping-bear', 'hammer-knight', 'flute-mage']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'frostwild-scourge',
                    behaviour: 'scourge-behaviour',
                    ultimate: 'scourge-ultimate',
                    inPlay: [],
                    deck: [],
                    spellboard: [],
                    threatZone: ['storm-bolt', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage'],
                    archives: ['stun']
                }
            });
        });

        it('returns exhausted ally and stunned to hand', function () {
            this.player2.attachUpgrade(this.stun, this.anchornaut);
            this.anchornaut.exhaust();

            this.player1.play(this.retreat);
            expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
            this.player1.clickCard(this.anchornaut);

            expect(this.anchornaut.location).toBe('hand');
            expect(this.stun.location).toBe('archives');
            expect(this.stun.parent).toBeNull();
            expect(this.player2.archives.length).toBe(1);
            expect(this.anchornaut.upgrades.length).toBe(0);
        });
    });

});
