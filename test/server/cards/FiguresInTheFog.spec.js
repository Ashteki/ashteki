describe('Figures in the fog reaction spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                spellboard: ['summon-butterfly-monk'],
                dicepool: ['natural', 'illusion', 'charm', 'charm'],
                archives: ['butterfly-monk']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'string-mage'],
                spellboard: [],
                hand: ['figures-in-the-fog'],
                dicepool: ['natural', 'illusion']
            }
        });
    });

    it('can be played when attackers are declared - Unit attack', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.ironWorker); // single attacker

        // card played
        expect(this.player2).toHavePrompt('Any reactions to attackers being declared?');
        this.player2.clickCard(this.figuresInTheFog);
        this.player2.clickCard(this.ironWorker);

        expect(this.player1).toHaveDefaultPrompt();
        expect(this.player1.actions.main).toBe(false); // wasted main action on fizzled attack
    });

    it('can be played when attackers are declared - PB attack', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.coalRoarkwin); // target
        this.player1.clickCard(this.ironWorker);
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickPrompt('Done');

        // card played
        expect(this.player2).toHavePrompt('Any reactions to attackers being declared?');
        this.player2.clickCard(this.figuresInTheFog);
        this.player2.clickCard(this.ironWorker);
        expect(this.ironWorker.exhausted).toBe(true);
        expect(this.game.attackState.battles.length).toBe(1); // only mistSpirit
        expect(this.player2).toHavePrompt('Choose a blocker');
        // ... attack continues ...
    });
});
