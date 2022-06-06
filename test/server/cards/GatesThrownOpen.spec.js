describe('Gates Thrown Open', function () {
    describe('With multiple exhausted spells in one slot', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    spellboard: ['summon-gilder', 'summon-gilder', 'summon-iron-rhino', 'empower'],
                    dicepool: ['divine', 'illusion', 'illusion'],
                    hand: ['gates-thrown-open']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    hand: ['rins-fury'],
                    dicepool: ['natural', 'natural']
                }
            });
            for (let s of this.player1.spellboard) {
                s.tokens.exhaustion = 1;
            }
        });

        it('removes an exhaustion from a ready spell in each spellboard slot', function () {
            expect(this.empower.exhausted).toBe(true);
            expect(this.summonIronRhino.exhausted).toBe(true);
            expect(this.player1.spellboard[0].exhausted).toBe(true);
            expect(this.player1.spellboard[1].exhausted).toBe(true);
            this.player1.play(this.gatesThrownOpen);

            // unexhaust one copy of each exhausted spell
            expect(this.player1).toBeAbleToSelect(this.player1.spellboard[0]);
            this.player1.clickCard(this.player1.spellboard[0]);
            expect(this.player1).not.toBeAbleToSelect(this.player1.spellboard[1]);
            this.player1.clickCard(this.empower);
            this.player1.clickCard(this.summonIronRhino);
            this.player1.clickDone();
            expect(this.empower.exhausted).toBe(false);
            expect(this.summonIronRhino.exhausted).toBe(false);
            expect(this.player1.spellboard[0].exhausted).toBe(false);
            expect(this.player1.spellboard[1].exhausted).toBe(true);
        });
    });

    describe('With multiple exhausted spells in one slot - not all', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    spellboard: ['summon-gilder', 'summon-gilder', 'summon-iron-rhino', 'empower'],
                    dicepool: ['divine', 'illusion', 'illusion'],
                    hand: ['gates-thrown-open']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    hand: ['rins-fury'],
                    dicepool: ['natural', 'natural']
                }
            });
            for (let s of this.player1.spellboard) {
                s.tokens.exhaustion = 1;
            }
            this.empower.tokens.exhaustion = 0;
        });

        it('removes an exhaustion from a ready spell in each spellboard slot', function () {
            expect(this.empower.exhausted).toBe(false);
            expect(this.summonIronRhino.exhausted).toBe(true);
            expect(this.player1.spellboard[0].exhausted).toBe(true);
            expect(this.player1.spellboard[1].exhausted).toBe(true);
            this.player1.play(this.gatesThrownOpen);

            // unexhaust one copy of each exhausted spell
            expect(this.player1).toBeAbleToSelect(this.player1.spellboard[0]);
            this.player1.clickCard(this.player1.spellboard[0]);
            expect(this.player1).not.toBeAbleToSelect(this.player1.spellboard[1]);
            expect(this.player1).not.toBeAbleToSelect(this.empower);

            this.player1.clickCard(this.summonIronRhino);
            this.player1.clickDone();
            expect(this.empower.exhausted).toBe(false);
            expect(this.summonIronRhino.exhausted).toBe(false);
            expect(this.player1.spellboard[0].exhausted).toBe(false);
            expect(this.player1.spellboard[1].exhausted).toBe(true);
        });
    });

    describe('with no choices for spells in slot', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    spellboard: ['summon-gilder', 'summon-iron-rhino', 'empower'],
                    dicepool: ['divine', 'illusion', 'illusion'],
                    hand: ['gates-thrown-open']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['hammer-knight'],
                    spellboard: [],
                    hand: ['rins-fury'],
                    dicepool: ['natural', 'natural']
                }
            });
            for (let s of this.player1.spellboard) {
                s.tokens.exhaustion = 1;
            }
        });

        it('automatically removes tokens without prompts', function () {
            expect(this.empower.exhausted).toBe(true);
            expect(this.summonIronRhino.exhausted).toBe(true);
            expect(this.summonGilder.exhausted).toBe(true);
            this.player1.play(this.gatesThrownOpen);
            expect(this.player1).toHaveDefaultPrompt();
            expect(this.empower.exhausted).toBe(false);
            expect(this.summonIronRhino.exhausted).toBe(false);
            expect(this.summonGilder.exhausted).toBe(false);
        });
    });
});
