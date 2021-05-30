describe('Salamander Monk Spirit', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit', 'anchornaut'],
                dicepool: ['divine', 'illusion', 'charm', 'charm'],
                spellboard: [],
                hand: ['close-combat', 'power-through']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker', 'salamander-monk-spirit'],
                spellboard: ['summon-iron-rhino'],
                hand: ['molten-gold'],
                dicepool: ['natural', 'natural', 'charm', 'charm']
            }
        });
    });

    it('cannot be targetted for attack', function () {
        this.player1.clickPrompt('Attack');
        expect(this.player1).toBeAbleToSelect(this.ironWorker);
        expect(this.player1).not.toBeAbleToSelect(this.salamanderMonkSpirit);
    });

    it('cannot block', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin);
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickPrompt('Done');

        expect(this.player2).toHavePrompt('choose a blocker');
        expect(this.player2).toBeAbleToSelect(this.ironWorker);
        expect(this.player2).not.toBeAbleToSelect(this.salamanderMonkSpirit);
    });

    it('can be blocked', function () {
        this.player1.endTurn();
        this.player2.clickAttack(this.aradelSummergaard);
        this.player2.clickCard(this.salamanderMonkSpirit);
        this.player2.clickCard(this.ironWorker);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.mistSpirit);
        expect(this.player1).toBeAbleToSelect(this.salamanderMonkSpirit);
        this.player1.clickCard(this.salamanderMonkSpirit);
        this.player1.clickDone();
        this.player2.clickCard(this.salamanderMonkSpirit);
        expect(this.aradelSummergaard.damage).toBe(0);
        expect(this.salamanderMonkSpirit.location).toBe('archives');
    });
});
