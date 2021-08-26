describe('Insight ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'orrick-gilstream',
                inPlay: ['hammer-knight'],
                spellboard: ['frost-bite'],
                dicepool: ['natural', 'natural', 'time', 'charm'],
                hand: []
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['sympathy-pain'],
                inPlay: ['flute-mage']
            }
        });
        this.player1.dicepool[0].level = 'basic';
    });

    it('Triggers after meditation, return first TOD card to hand', function () {
        this.player1.clickPrompt('Meditate');
        const target = this.player1.dicepool[0];
        this.player1.clickPrompt('Choose top Of Deck');
        this.player1.clickDie(0);
        expect(target.level).toBe('power');
        this.player1.clickPrompt('Confirm');
        this.player1.clickPrompt('Stop meditating');

        expect(this.player1).not.toHaveDefaultPrompt();
        this.player1.clickYes(); // use insight 'may' prompt from forcedReaction
        expect(this.orrickGilstream.exhausted).toBe(true);
        expect(this.player1.hand.length).toBe(1);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('does not trigger on spellboard meditation', function () {
        this.player1.clickPrompt('Meditate');
        const target = this.player1.dicepool[0];
        this.player1.clickCard(this.frostBite);
        this.player1.clickDie(0);
        expect(target.level).toBe('power');
        this.player1.clickPrompt('Confirm');
        this.player1.clickPrompt('Stop meditating');

        expect(this.player1).toHaveDefaultPrompt();
        expect(this.orrickGilstream.exhausted).toBe(false);
        expect(this.player1.hand.length).toBe(0);
    });

    it('does not trigger on change of mind away from top of deck', function () {
        this.player1.clickPrompt('Meditate');
        const target = this.player1.dicepool[0];
        this.player1.clickPrompt('Choose top Of Deck');
        this.player1.clickPrompt('clear selection');
        this.player1.clickCard(this.frostBite);

        this.player1.clickDie(0);
        expect(target.level).toBe('power');
        this.player1.clickPrompt('Confirm');
        this.player1.clickPrompt('Stop meditating');

        expect(this.player1).toHaveDefaultPrompt();
        expect(this.orrickGilstream.exhausted).toBe(false);
        expect(this.player1.hand.length).toBe(0);
    });

    it('does trigger on change of mind to top of deck', function () {
        this.player1.clickPrompt('Meditate');
        const target = this.player1.dicepool[0];
        this.player1.clickCard(this.frostBite);
        this.player1.clickPrompt('clear selection');
        this.player1.clickPrompt('Choose top Of Deck');
        this.player1.clickDie(0);
        expect(target.level).toBe('power');
        this.player1.clickPrompt('Confirm');
        this.player1.clickPrompt('Stop meditating');

        expect(this.player1).not.toHaveDefaultPrompt();
        this.player1.clickYes(); // use insight 'may' prompt from forcedReaction
        expect(this.orrickGilstream.exhausted).toBe(true);
        expect(this.player1.hand.length).toBe(1);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
