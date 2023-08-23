describe('Rejuvenate', function () {
    describe('Conjuration entering play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'iron-worker'],
                    dicepool: ['divine', 'divine', 'charm', 'charm', 'natural', 'natural'],
                    hand: ['ember-heart'],
                    archives: ['butterfly-monk'],
                    spellboard: ['summon-butterfly-monk', 'rejuvenate']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'holy-knight', 'anchornaut'],
                    spellboard: [],
                    hand: [],
                    dicepool: ['natural', 'natural', 'charm']
                }
            });
        });

        it('adds a token to rejuvenate', function () {
            this.player1.clickCard(this.summonButterflyMonk);
            this.player1.clickPrompt('Summon Butterfly Monk');
            expect(this.butterflyMonk.location).toBe('play area');
            expect(this.rejuvenate.status).toBe(1);
        });
    });

    describe('Rejuvenate action', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['mist-spirit', 'iron-worker', 'iron-rhino'],
                    dicepool: ['divine', 'divine', 'charm', 'charm', 'natural', 'natural'],
                    hand: ['ember-heart'],
                    archives: ['butterfly-monk'],
                    spellboard: ['summon-butterfly-monk', 'rejuvenate']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight', 'holy-knight', 'anchornaut'],
                    spellboard: [],
                    hand: [],
                    dicepool: ['natural', 'natural', 'charm']
                }
            });

            this.mistSpirit.tokens.exhaustion = 1;
            this.ironWorker.tokens.exhaustion = 1;
            this.rejuvenate.tokens.status = 3;
        });

        it('removes one exhaustion from a conjuration ', function () {
            expect(this.rejuvenate.status).toBe(3);

            this.player1.clickCard(this.rejuvenate);
            this.player1.clickPrompt('Rejuvenate');
            this.player1.clickDie(0);

            expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
            expect(this.player1).not.toBeAbleToSelect(this.ironRhino);

            this.player1.clickCard(this.mistSpirit);
            expect(this.mistSpirit.exhausted).toBe(false);
            expect(this.rejuvenate.status).toBe(0);
        });
    });
});
