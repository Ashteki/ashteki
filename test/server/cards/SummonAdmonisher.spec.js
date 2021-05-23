describe('Summon Admonisher', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['ice-golem'],
                    spellboard: ['summon-admonisher'],
                    dicepool: ['natural', 'divine', 'divine', 'natural'],
                    archives: ['admonisher', 'ice-golem']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should place an admonisher into play', function () {
            this.player1.clickCard(this.summonAdmonisher);
            this.player1.clickPrompt('Summon Admonisher');
            this.player1.clickCard(this.player1.archives[0]);

            expect(this.admonisher.location).toBe('play area');
            expect(this.coalRoarkwin.damage).toBe(0);
        });
    });

    describe('Focus 1 Summon - no damage on success', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['admonisher'],
                    spellboard: ['summon-admonisher', 'summon-admonisher'],
                    dicepool: ['natural', 'divine', 'divine', 'natural'],
                    archives: ['admonisher', 'ice-golem']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should deal 1 damage to opponents PB', function () {
            this.player1.clickCard(this.summonAdmonisher);
            this.player1.clickPrompt('Summon Admonisher');
            this.player1.clickCard(this.player1.archives[0]);
            expect(this.player1.inPlay.length).toBe(2);
            expect(this.coalRoarkwin.damage).toBe(0);
        });
    });

    describe('Focus 1 Summon - no admonisher in archives', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['admonisher'],
                    spellboard: ['summon-admonisher', 'summon-admonisher'],
                    dicepool: ['natural', 'divine', 'divine', 'natural'],
                    archives: ['ice-golem', 'ice-golem']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should deal 1 damage to opponents PB', function () {
            this.player1.clickCard(this.summonAdmonisher);
            this.player1.clickPrompt('Summon Admonisher');

            expect(this.coalRoarkwin.damage).toBe(1);
        });
    });

    describe('Focus 1 Summon - no room in battlefield', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'brennen-blackcloud',
                    inPlay: ['ice-golem', 'ice-golem', 'ice-golem', 'iron-worker', 'iron-worker'],
                    spellboard: ['summon-admonisher', 'summon-admonisher'],
                    dicepool: ['natural', 'divine', 'divine', 'natural'],
                    archives: ['admonisher']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });
        });

        it('should deal 1 damage to opponents PB', function () {
            this.player1.clickCard(this.summonAdmonisher);
            this.player1.clickPrompt('Summon Admonisher');
            this.player1.clickCard(this.player1.archives[0]);
            expect(this.admonisher.location).toBe('archives');

            expect(this.coalRoarkwin.damage).toBe(1);
        });
    });
});
