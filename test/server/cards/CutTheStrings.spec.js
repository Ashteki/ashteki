describe('Cut the strings action', function () {
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
                inPlay: ['iron-rhino', 'mist-spirit'],
                dicepool: ['natural', 'illusion', 'ceremonial', 'charm'],
                spellboard: ['cut-the-strings']
            }
        });
    });

    it('damages when no upgrade available', function () {
        this.player1.endTurn();
        this.player2.clickCard(this.cutTheStrings); // play card
        this.player2.clickPrompt('Cut the Strings');
        this.player2.clickDie(0);
        this.player2.clickPrompt('Done');
        this.player2.clickCard(this.ironRhino); // choose ms for 1 damage
        // no prompt for upgrade target

        expect(this.ironRhino.damage).toBe(2);
    });

    it('damages even when no upgrade chosen', function () {
        this.player1.playUpgrade(this.rootArmor, this.anchornaut);
        this.player1.endTurn();
        this.player2.clickCard(this.cutTheStrings); // play card
        this.player2.clickPrompt('Cut the Strings');
        this.player2.clickDie(0);
        this.player2.clickPrompt('Done');
        this.player2.clickCard(this.ironRhino); // choose ms for 1 damage
        this.player2.clickPrompt('Done');

        expect(this.ironRhino.damage).toBe(2);
    });

    it('damages and removes upgrade', function () {
        this.player1.playUpgrade(this.rootArmor, this.anchornaut);
        this.player1.endTurn();
        this.player2.clickCard(this.cutTheStrings); // play card
        this.player2.clickPrompt('Cut the Strings');
        this.player2.clickDie(0);
        this.player2.clickPrompt('Done');
        this.player2.clickCard(this.ironRhino); // choose ms for 1 damage
        this.player2.clickCard(this.rootArmor); // remove this

        expect(this.rootArmor.location).toBe('discard');
        expect(this.ironRhino.damage).toBe(2);
    });

    it('dice cancel gives no damage and no upgrade choice', function () {
        this.player1.playUpgrade(this.rootArmor, this.anchornaut);
        this.player1.endTurn();
        this.player2.clickCard(this.cutTheStrings); // play card
        this.player2.clickPrompt('Cut the Strings');
        this.player2.clickPrompt('Cancel');
        this.player2.clickCard(this.ironRhino); // choose ms for 1 damage
        // no prompt for upgrade target
        expect(this.player2).toHaveDefaultPrompt();
        expect(this.ironRhino.damage).toBe(0);
    });
});
