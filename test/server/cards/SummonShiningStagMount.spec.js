describe('Summon Shining Stag Mount', function () {
    describe('Normal summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'brennen-blackcloud',
                    archives: ['shining-stag-mount'],
                    spellboard: ['summon-shining-stag-mount'],
                    hand: ['power-through'],
                    dicepool: ['divine', 'natural', 'time'],
                    inPlay: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage', 'hammer-knight']
                }
            });
        });

        it('Summon action', function () {
            this.player1.clickCard(this.summonShiningStagMount);
            this.player1.clickPrompt('Summon Shining Stag Mount');
            this.player1.clickDie(2);
            this.player1.clickDone();
            this.player1.clickCard(this.anchornaut);

            // smuggle
            this.player1.clickDie(0);
            this.player1.clickCard(this.shiningStagMount);
            expect(this.shiningStagMount.location).toBe('play area');
            expect(this.anchornaut.location).toBe('purged');
            expect(this.anchornaut.facedown).toBe(true);
            expect(this.shiningStagMount.childCards.length).toBe(1);
            expect(this.shiningStagMount.dieUpgrades.length).toBe(1);
        });
    });

    describe('ice trapped', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'brennen-blackcloud',
                    archives: ['shining-stag-mount'],
                    spellboard: ['summon-shining-stag-mount'],
                    hand: ['power-through'],
                    dicepool: ['divine', 'natural', 'time'],
                    inPlay: ['anchornaut']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['flute-mage', 'hammer-knight'],
                    hand: ['ice-trap'],
                    dicepool: ['natural']
                }
            });
        });

        it('stag goes to archive and rider goes to hand', function () {
            this.player1.clickCard(this.summonShiningStagMount);
            this.player1.clickPrompt('Summon Shining Stag Mount');
            this.player1.clickDie(2);
            this.player1.clickDone();
            this.player1.clickCard(this.anchornaut);
            expect(this.shiningStagMount.childCards.length).toBe(1);
            this.player1.clickDie(0);

            this.player1.clickCard(this.shiningStagMount);
            expect(this.shiningStagMount.attack).toBe(3);
            this.player2.clickCard(this.iceTrap);

            expect(this.shiningStagMount.location).toBe('archives');
            expect(this.anchornaut.location).toBe('hand');
            expect(this.anchornaut.facedown).toBe(false);
            expect(this.shiningStagMount.childCards.length).toBe(0);
            expect(this.shiningStagMount.dieUpgrades.length).toBe(0);
        });
    });
});
