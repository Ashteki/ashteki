describe('String Mage ability', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut', 'string-mage'],
                dicepool: ['natural', 'ceremonial', 'charm', 'charm'],
                hand: ['transfer'],
                spellboard: ['chant-of-revenge']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-worker', 'mist-spirit'],
                spellboard: ['empower', 'summon-mist-spirit']
            }
        });
        this.ironWorker.tokens.status = 2;
        this.ironWorker.tokens.damage = 1;
        this.stringMage.tokens.damage = 1;
    });

    it('should move 1 status token type from card to string mage', function () {
        expect(this.ironWorker.tokens.status).toBe(2);
        this.player1.clickCard(this.stringMage);
        this.player1.clickPrompt('Exchange Link');
        expect(this.player1).toBeAbleToSelect(this.ironWorker); // other player
        expect(this.player1).toBeAbleToSelect(this.stringMage); // my string mage
        expect(this.player1).not.toBeAbleToSelect(this.empower); // not a unit
        expect(this.player1).not.toBeAbleToSelect(this.anchornaut); // no tokens
        expect(this.player1).toHavePrompt('Choose a unit with wound or status tokens');

        this.player1.clickCard(this.ironWorker);
        expect(this.player1).toHavePrompt('Choose a type');
        expect(this.player1).toHavePromptButton('Damage');
        expect(this.player1).toHavePromptButton('Status');

        this.player1.clickPrompt('Status');
        expect(this.player1).not.toBeAbleToSelect(this.anchornaut);
        expect(this.player1).toHavePrompt('Choose a card to receive the token');

        this.player1.clickCard(this.stringMage);
        expect(this.ironWorker.status).toBe(1);
        expect(this.stringMage.status).toBe(1);
    });

    it('should move 1 chosen from string mage to another', function () {
        this.ironWorker.tokens.damage = 0;
        this.stringMage.tokens.damage = 1;

        this.player1.clickCard(this.stringMage);
        this.player1.clickPrompt('Exchange Link');
        expect(this.player1).toBeAbleToSelect(this.stringMage); // my string mage
        expect(this.player1).toBeAbleToSelect(this.ironWorker); // other player
        expect(this.player1).not.toBeAbleToSelect(this.empower); // not a unit
        expect(this.player1).not.toBeAbleToSelect(this.anchornaut); // no tokens
        expect(this.player1).toHavePrompt('Choose a unit with wound or status tokens');

        this.player1.clickCard(this.stringMage);
        expect(this.player1).toHavePrompt('Choose a type');
        expect(this.player1).toHavePromptButton('Damage');

        this.player1.clickPrompt('Damage');
        expect(this.player1).toBeAbleToSelect(this.anchornaut);
        expect(this.player1).toBeAbleToSelect(this.ironWorker); // other player
        expect(this.player1).not.toBeAbleToSelect(this.empower); // not a unit
        expect(this.player1).not.toBeAbleToSelect(this.stringMage); // my string mage
        expect(this.player1).toHavePrompt('Choose a card to receive the token');

        this.player1.clickCard(this.ironWorker);
        expect(this.ironWorker.damage).toBe(1);
        expect(this.stringMage.damage).toBe(0);
    });

    it('should move 1 wound from string mage to kill another', function () {
        expect(this.ironWorker.damage).toBe(1);

        this.player1.clickCard(this.stringMage);
        this.player1.clickPrompt('Exchange Link');
        expect(this.player1).toBeAbleToSelect(this.stringMage); // my string mage
        expect(this.player1).toBeAbleToSelect(this.ironWorker); // other player
        expect(this.player1).not.toBeAbleToSelect(this.empower); // not a unit
        expect(this.player1).not.toBeAbleToSelect(this.anchornaut); // no tokens
        expect(this.player1).toHavePrompt('Choose a unit with wound or status tokens');

        this.player1.clickCard(this.stringMage);
        expect(this.player1).toHavePrompt('Choose a type');
        expect(this.player1).toHavePromptButton('Damage');

        this.player1.clickPrompt('Damage');
        expect(this.player1).toBeAbleToSelect(this.anchornaut);
        expect(this.player1).toBeAbleToSelect(this.ironWorker); // other player
        expect(this.player1).not.toBeAbleToSelect(this.empower); // not a unit
        expect(this.player1).not.toBeAbleToSelect(this.stringMage); // my string mage
        expect(this.player1).toHavePrompt('Choose a card to receive the token');

        this.player1.clickCard(this.ironWorker);
        expect(this.ironWorker.location).toBe('discard');
        expect(this.stringMage.damage).toBe(0);
    });
});
