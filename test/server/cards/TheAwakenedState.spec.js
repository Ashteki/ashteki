describe('Awakened State', function () {
    describe('with enemy units', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['hammer-knight'],
                    spellboard: ['frost-bite', 'concentration'],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    archives: ['the-awakened-state']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['flute-mage']
                }
            });
            this.orrickGilstream.tokens.status = 7;
        });

        it('awakened state attack action with enemy units', function () {
            // attach card to orrick.
            expect(this.orrickGilstream.status).toBe(7);
            this.player1.clickCard(this.concentration);
            this.player1.clickPrompt('Concentration');
            this.player1.clickPrompt('main');
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();
            this.player1.clickDone(); // choose exhausted dice
            expect(this.orrickGilstream.upgrades.length).toBe(1);

            this.player1.clickCard(this.theAwakenedState);
            this.player1.clickPrompt('awaken');
            this.player1.clickCard(this.fluteMage);
            expect(this.fluteMage.damage).toBe(1);
            expect(this.orrickGilstream.status).toBe(7); // added one via concentration, then used one
            expect(this.sariaGuideman.damage).toBe(1);
        });
    });
    describe('without enemy units', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'orrick-gilstream',
                    inPlay: ['hammer-knight'],
                    spellboard: ['frost-bite', 'concentration'],
                    dicepool: ['natural', 'natural', 'time', 'charm'],
                    archives: ['the-awakened-state']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain']
                }
            });
            this.orrickGilstream.tokens.status = 7;
        });

        it('do all parts but unit damage', function () {
            // attach card to orrick.
            expect(this.orrickGilstream.status).toBe(7);
            this.player1.clickCard(this.concentration);
            this.player1.clickPrompt('Concentration');
            this.player1.clickPrompt('main');
            this.player1.clickDie(0);
            this.player1.clickDie(1);
            this.player1.clickDone();
            this.player1.clickDone(); // choose exhausted dice
            expect(this.orrickGilstream.upgrades.length).toBe(1);

            this.player1.clickCard(this.theAwakenedState);
            this.player1.clickPrompt('awaken');
            expect(this.orrickGilstream.status).toBe(7); // added one via concentration, then used one
            expect(this.sariaGuideman.damage).toBe(1);
        });
    });
});
