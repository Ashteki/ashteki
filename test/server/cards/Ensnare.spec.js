describe('Ensnare reaction spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                spellboard: ['summon-butterfly-monk'],
                dicepool: ['natural', 'natural', 'charm', 'charm', 'illusion'],
                hand: ['ensnare'],
                archives: ['butterfly-monk']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['flute-mage', 'biter'],
                spellboard: [],
                hand: [],
                dicepool: ['time']
            }
        });
    });

    it('can be played when a phoenixborn guards', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.ironWorker); // single attacker

        this.player2.clickCard(this.coalRoarkwin); // guard with pb

        expect(this.player1).toHavePrompt('Any Reactions to defenders being declared?');
        this.player1.clickCard(this.ensnare); // click ensnare to play as reaction

        // card played
        expect(this.ensnare.location).toBe('discard');
        expect(this.player1.hand.length).toBe(0);

        // damage prevented to pb
        expect(this.coalRoarkwin.tokens.damage).toBe(4); //2 damage from Ensnare, 2 damage from Iron Worker
        expect(this.coalRoarkwin.usedGuardThisRound).toBe(true);

        // no damage dealt to attacker
        expect(this.ironWorker.tokens.damage).toBeUndefined;
    });

    it('can be played when a unit guards', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage); // target
        this.player1.clickCard(this.ironWorker); // single attacker

        this.player2.clickCard(this.biter); // guard with Biter

        expect(this.player1).toHavePrompt('Any Reactions to defenders being declared?');
        this.player1.clickCard(this.ensnare); // click ensnare to play as reaction

        expect(this.ensnare.location).toBe('discard');
        expect(this.player1.hand.length).toBe(0);

        this.player2.clickYes(); //counter with Flute Mage
        expect(this.biter.location).toBe('archives'); // 2 damage from Ensnare
        expect(this.fluteMage.location).toBe('discard'); // 2 damage from Iron Worker
    });
});
