describe('Devotion', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit', 'anchornaut', 'iron-worker'],
                dicepool: ['natural', 'illusion', 'charm', 'divine'],
                spellboard: [],
                hand: ['devotion']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-rhino', 'sleeping-widow'],
                spellboard: ['summon-iron-rhino'],
                dicepool: ['natural', 'illusion', 'charm', 'divine'],
                hand: ['summon-mist-spirit']
            }
        });
    });

    it('stops attached card from attacking', function () {
        this.player1.play(this.devotion, this.mistSpirit); // attach to ms
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin);

        expect(this.player1).not.toBeAbleToSelect(this.mistSpirit);
        expect(this.player1).toBeAbleToSelect(this.anchornaut);
    });

    it('adds alert behaviour to attached card', function () {
        this.player1.play('devotion', this.ironWorker);
        this.player1.endTurn();

        this.player2.clickPrompt('Attack');
        this.player2.clickCard(this.aradelSummergaard);
        this.player2.clickCard(this.sleepingWidow);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.ironWorker);
        this.player1.clickCard(this.sleepingWidow);
        this.player1.clickPrompt('Done');
        expect(this.sleepingWidow.location).toBe('archives');
        expect(this.ironWorker.exhausted).toBe(false);
    });

    it('can only be attached to my own units', function () {
        this.ironWorker.tokens.exhaustion = 1;

        this.player1.play(this.devotion, this.ironWorker);

        expect(this.ironWorker.exhausted).toBe(false);
    });

    it('removes an exhaustion token from ', function () {
        this.player1.clickCard(this.devotion);
        this.player1.clickPrompt('Play this Alteration');
        expect(this.player1).toBeAbleToSelect(this.sleepingWidow);
        expect(this.player1).not.toBeAbleToSelect(this.ironWorker);
    });
});
