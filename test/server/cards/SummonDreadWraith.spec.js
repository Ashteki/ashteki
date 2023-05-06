describe('Summon Dread Wraith', function () {
    describe('Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['dread-wraith'],
                    spellboard: ['summon-dread-wraith'],
                    dicepool: ['ceremonial', 'ceremonial', 'ceremonial', 'natural'],
                    archives: ['dread-wraith', 'dread-wraith']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });

            this.player1.inPlay[0].tokens.exhaustion = 1;
        });

        it('should place a dread wraith play', function () {
            this.player1.clickCard(this.summonDreadWraith);
            this.player1.clickPrompt('Summon Dread Wraith');

            expect(this.player1.inPlay.length).toBe(2);
            expect(this.player1.inPlay.every((c) => c.exhaustion == 0)).toBe(false);
            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Focus 2 Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['dread-wraith'],
                    spellboard: [
                        'summon-dread-wraith',
                        'summon-dread-wraith',
                        'summon-dread-wraith'
                    ],
                    dicepool: ['ceremonial', 'ceremonial', 'ceremonial', 'natural'],
                    archives: ['dread-wraith']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });

            this.player1.inPlay[0].tokens.exhaustion = 1;
        });

        it('remove 1 exhaustion from a dread wraith in play', function () {
            expect(this.player1.inPlay[0].exhaustion).toBe(1);
            this.player1.clickCard(this.summonDreadWraith);
            this.player1.clickPrompt('Summon Dread Wraith');
            this.player1.clickCard(this.dreadWraith);

            expect(this.player1.inPlay.length).toBe(2);
            expect(this.player1.inPlay.some((c) => c.exhausted)).toBe(false);
        });
    });

    describe('Focus 2 Summon when both DWs in play', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['dread-wraith', 'dread-wraith'],
                    spellboard: [
                        'summon-dread-wraith',
                        'summon-dread-wraith',
                        'summon-dread-wraith'
                    ],
                    dicepool: ['ceremonial', 'ceremonial', 'ceremonial', 'natural'],
                    archives: []
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['hammer-knight'],
                    spellboard: []
                }
            });

            this.player1.inPlay[0].tokens.exhaustion = 1;
            this.player1.inPlay[1].tokens.exhaustion = 1;
        });

        it('remove 1 exhaustion from a dread wraith in play', function () {
            expect(this.player1.inPlay[0].exhaustion).toBe(1);
            expect(this.player1.inPlay[1].exhaustion).toBe(1);
            this.player1.clickCard(this.summonDreadWraith);
            this.player1.clickPrompt('Summon Dread Wraith');
            this.player1.clickCard(this.dreadWraith);

            expect(this.player1).toHaveDefaultPrompt();
            expect(this.player1.inPlay.length).toBe(2);
            expect(this.player1.inPlay.filter((c) => c.exhausted).length).toBe(1);
        });
    });
});
