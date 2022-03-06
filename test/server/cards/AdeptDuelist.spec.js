describe('Adept duelist', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut', 'iron-worker'],
                dicepool: ['natural', 'illusion', 'ceremonial', 'charm'],
                hand: ['root-armor']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-rhino', 'mist-spirit', 'adept-duelist'],
                dicepool: ['natural', 'illusion', 'ceremonial', 'charm'],
                spellboard: ['cut-the-strings'],
                hand: ['regress']
            }
        });
    });

    it('removes upgrade', function () {
        this.player1.playUpgrade(this.rootArmor, this.anchornaut);
        this.player1.endTurn();
        this.player2.clickAttack(this.ironWorker);
        this.player2.clickCard(this.adeptDuelist);
        // reaction to onAttackersDeclared
        this.player2.clickCard(this.adeptDuelist);
        this.player2.clickCard(this.rootArmor); // remove this

        expect(this.rootArmor.location).toBe('discard');
    });

    it("removes own upgrade on opponent's unit", function () {
        this.player1.playUpgrade(this.rootArmor, this.anchornaut);
        this.player1.endTurn();
        this.player2.clickCard(this.regress);
        this.player2.clickPrompt('Play this alteration');
        this.player2.clickCard(this.anchornaut);
        this.player2.clickAttack(this.ironWorker);
        this.player2.clickCard(this.adeptDuelist);
        // reaction to onAttackersDeclared
        this.player2.clickCard(this.adeptDuelist);
        this.player2.clickCard(this.regress); // remove this

        expect(this.regress.location).toBe('discard');
    });

    it("can't remove upgrade on own unit", function () {
        this.player1.playUpgrade(this.rootArmor, this.anchornaut);
        this.player1.endTurn();
        this.player2.clickCard(this.regress);
        this.player2.clickPrompt('Play this alteration');
        this.player2.clickCard(this.adeptDuelist);
        this.player2.clickAttack(this.ironWorker);
        this.player2.clickCard(this.adeptDuelist);
        // reaction to onAttackersDeclared
        this.player2.clickCard(this.adeptDuelist);
        this.player2.clickCard(this.regress); // cannot remove this

        expect(this.regress.location).toBe('play area');
    });
});
