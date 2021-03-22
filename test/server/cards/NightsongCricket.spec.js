describe('Nightsong Cricket', function () {
    // these tests make sure that renewed harmony doesn't force users to pick from an empty discard pile
    describe('Renewed Harmony - with discard cards', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: [],
                    discard: ['hammer-knight'],
                    inPlay: ['iron-worker'],
                    dicepool: ['sympathy', 'charm', 'natural', 'natural'],
                    archives: []
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['nightsong-cricket'],
                    spellboard: [],
                    discard: ['exhortation']
                }
            });
        });

        it('on destroy returns cards to hand', function () {
            this.player1.clickAttack(this.nightsongCricket);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickDone();
            this.player2.clickPrompt('No');

            this.player2.clickPrompt('Renewed Harmony');

            this.player1.clickCard(this.player2.discard[0]);
            this.player2.clickCard(this.player1.discard[0]);

            expect(this.exhortation.location).toBe('hand');
            expect(this.hammerKnight.location).toBe('hand');
        });
    });

    describe('Renewed Harmony - with empty discard (me)', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: [],
                    inPlay: ['iron-worker'],
                    dicepool: ['sympathy', 'charm', 'natural', 'natural'],
                    archives: [],
                    discard: ['hammer-knight']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['nightsong-cricket'],
                    spellboard: [],
                    discard: []
                }
            });
        });

        it('on destroy returns card to hand', function () {
            this.player1.clickAttack(this.nightsongCricket);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickDone();
            this.player2.clickPrompt('No');

            this.player2.clickPrompt('Renewed Harmony');

            //this.player1.clickCard(this.player2.discard[0]);
            this.player2.clickCard(this.player1.discard[0]);

            //expect(this.exhortation.location).toBe('hand');
            expect(this.hammerKnight.location).toBe('hand');
        });
    });

    describe('Renewed Harmony - with empty discard (them)', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: [],
                    inPlay: ['iron-worker'],
                    dicepool: ['sympathy', 'charm', 'natural', 'natural'],
                    archives: [],
                    discard: []
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['nightsong-cricket'],
                    spellboard: [],
                    discard: ['exhortation']
                }
            });
        });

        it('on destroy returns card to hand', function () {
            this.player1.clickAttack(this.nightsongCricket);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickDone();
            this.player2.clickPrompt('No');

            this.player2.clickPrompt('Renewed Harmony');

            this.player1.clickCard(this.player2.discard[0]);
            // this.player2.clickCard(this.player1.discard[0]);

            expect(this.exhortation.location).toBe('hand');
            // expect(this.hammerKnight.location).toBe('hand');
        });
    });

    describe('Renewed Harmony - with empty discard (both)', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    spellboard: [],
                    inPlay: ['iron-worker'],
                    dicepool: ['sympathy', 'charm', 'natural', 'natural'],
                    archives: [],
                    discard: []
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['nightsong-cricket'],
                    spellboard: [],
                    discard: []
                }
            });
        });

        it('on destroy returns card to hand', function () {
            this.player1.clickAttack(this.nightsongCricket);
            this.player1.clickCard(this.ironWorker);
            this.player2.clickDone();
            this.player2.clickPrompt('No');

            expect(this.player2).not.toHavePrompt('Renewed Harmony');
        });
    });
});
