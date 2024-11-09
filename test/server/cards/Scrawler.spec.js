describe('Scrawler', function () {
    describe('On Summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight', 'scrawler'],
                    spellboard: ['summon-scrawler'],
                    dicepool: ['natural', 'sympathy', 'time', 'charm'],
                    hand: ['shroud', 'purge'],
                    archives: ['scrawler', 'fox-spirit']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['flute-mage', 'iron-worker', 'sonic-swordsman']
                }
            });
        });

        it('second scrawler enters play, exhausts target', function () {
            this.player1.clickCard(this.summonScrawler);
            this.player1.clickPrompt('Summon Scrawler');
            this.player1.clickDie(0);
            expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
            expect(this.player1).toBeAbleToSelect(this.fluteMage);
            this.player1.clickCard(this.fluteMage);

            expect(this.fluteMage.exhausted).toBeTrue();

            expect(this.player1).toHaveDefaultPrompt();
        });
    });

    describe('Bug: Double Down summon', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'aradel-summergaard',
                    inPlay: ['iron-worker', 'flute-mage', 'ash-spirit'],
                    dicepool: ['natural', 'natural', 'charm', 'charm', 'ceremonial', 'ceremonial'],
                    hand: ['molten-gold', 'crimson-bomber', 'natures-wrath']
                },
                player2: {
                    phoenixborn: 'rin-northfell',
                    inPlay: ['scrawler'],
                    hand: ['double-down'],
                    dicepool: ['natural', 'natural', 'ceremonial', 'time', 'illusion'],
                    archives: ['scrawler', 'scrawler', 'light-bringer']
                }
            });
        });

        it('scrawler ability should reflect accurate scrawlers in play count', function () {
            this.player1.clickCard(this.aradelSummergaard);
            this.player1.clickPrompt('water blast');
            this.player1.clickCard(this.scrawler);
            // reactions window
            this.player2.clickCard(this.doubleDown);
            //scrawler 1
            this.player2.clickCard(this.player2.inPlay[0]); // simultaneous events - change this
            expect(this.player2).not.toBeAbleToSelect(this.ironWorker);
            expect(this.player2).not.toBeAbleToSelect(this.fluteMage);
            expect(this.player2).toBeAbleToSelect(this.ashSpirit);
            this.player2.clickCard(this.ashSpirit);
            expect(this.player2).not.toBeAbleToSelect(this.ironWorker);
            expect(this.player2).toBeAbleToSelect(this.fluteMage);
            expect(this.player2).not.toBeAbleToSelect(this.ashSpirit);

            this.player2.clickCard(this.fluteMage);
            expect(this.ironWorker.exhausted).toBe(false);
            expect(this.ashSpirit.exhausted).toBe(true);
        });
    });
});
