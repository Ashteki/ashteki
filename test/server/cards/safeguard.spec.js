describe('Safeguard', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['mist-spirit'],
                dicepool: ['ceremonial', 'natural', 'charm', 'charm'],
                hand: ['safeguard', 'natures-wrath']
            },
            player2: {
                phoenixborn: 'rin-northfell',
                inPlay: ['hammer-knight'],
                spellboard: ['summon-butterfly-monk'],
                dicepool: ['charm', 'natural', 'natural', 'illusion', 'charm', 'charm'],
                hand: ['mist-typhoon'],
                archives: ['butterfly-monk']
            }
        });
    });

    it('prevents damage from opponents action spell', function () {
        expect(this.mistSpirit.damage).toBe(0);

        this.player1.clickCard(this.safeguard);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(0);
        this.player1.clickCard(this.mistSpirit);
        this.player1.endTurn();
        this.player2.clickCard(this.mistTyphoon);
        this.player2.clickPrompt('Play this action');

        expect(this.mistSpirit.damage).toBe(0);
        expect(this.mistSpirit.location).toBe('play area');
    });

    it('prevents damage from opponents attack', function () {
        expect(this.mistSpirit.damage).toBe(0);

        this.player1.clickCard(this.safeguard);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(0);
        this.player1.clickCard(this.mistSpirit);
        this.player1.endTurn();
        this.player2.clickAttack(this.mistSpirit);
        this.player2.clickCard(this.hammerKnight);
        this.player1.clickDone();
        this.player1.clickYes();
        expect(this.mistSpirit.damage).toBe(0);
        expect(this.mistSpirit.location).toBe('play area');
    });

    it('does not prevent damage from own action spell', function () {
        expect(this.mistSpirit.damage).toBe(0);

        this.player1.clickCard(this.safeguard);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(0);
        this.player1.clickCard(this.mistSpirit);
        this.player1.clickCard(this.naturesWrath);
        this.player1.clickPrompt('Play this action');

        expect(this.hammerKnight.damage).toBe(1);
        expect(this.mistSpirit.location).toBe('archives');
    });

    it('it lasts until my next turn', function () {
        expect(this.mistSpirit.damage).toBe(0);

        this.player1.clickCard(this.safeguard);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(0);
        this.player1.clickCard(this.mistSpirit);
        this.player1.actions.main = false; // fudge
        this.player1.endTurn();
        // lasts opponent turn
        this.player2.clickDie(1);
        this.player2.clickPrompt('Natural Dice Power');
        this.player2.clickCard(this.mistSpirit);
        this.player2.endTurn();
        expect(this.mistSpirit.location).toBe('play area');

        this.player1.clickDie(1);
        this.player1.clickPrompt('Natural Dice Power');
        this.player1.clickCard(this.mistSpirit);

        expect(this.mistSpirit.location).toBe('archives');
    });

    it('lasts across round boundaries', function () {
        expect(this.mistSpirit.damage).toBe(0);

        this.player1.clickCard(this.safeguard);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(0);
        this.player1.clickCard(this.mistSpirit);
        this.player1.endTurn();
        this.player2.endTurn();

        this.player1.clickDone();
        this.player2.clickDone();

        this.player1.clickPrompt('No');
        this.player2.clickPrompt('No');

        this.player2.clickCard(this.mistTyphoon);
        this.player2.clickPrompt('Play this action');

        expect(this.mistSpirit.damage).toBe(0);
        expect(this.mistSpirit.location).toBe('play area');
    });
});
