describe('Body Inversion', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                dicepool: ['illusion', 'natural', 'natural'],
                spellboard: ['body-inversion'],
                hand: ['crystal-shield'],
                inPlay: ['crimson-bomber']
            },
            player2: {
                phoenixborn: 'maeoni-viper',
                inPlay: ['anchornaut', 'frost-fang', 'silver-snake'],
                dicepool: ['illusion', 'natural', 'natural'],
                spellboard: ['body-inversion'],
                hand: ['crystal-shield']
            }
        });
    });

    it('flips attack and life', function () {
        this.player1.clickCard(this.bodyInversion);
        this.player1.clickPrompt('Body Inversion a unit');
        this.player1.clickCard(this.frostFang);

        expect(this.frostFang.attack).toBe(1);
        expect(this.frostFang.life).toBe(3);
    });

    it('kills unit with 0 attack', function () {
        this.player1.clickCard(this.bodyInversion);
        this.player1.clickPrompt('Body Inversion a unit');
        this.player1.clickCard(this.anchornaut);

        expect(this.anchornaut.location).toBe('discard');
    });

    it('flips only printed attack and life', function () {
        // Put a Crystal Shield on the unit to give a persistent buff
        this.player1.clickCard(this.crystalShield);
        this.player1.clickPrompt('Play This Alteration');
        this.player1.clickDie(2);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.anchornaut);
        expect(this.anchornaut.attack).toBe(0);
        expect(this.anchornaut.life).toBe(3);

        // now body invert it. the buff from the shield should stay on the life
        this.player1.clickCard(this.bodyInversion);
        this.player1.clickPrompt('Body Inversion a unit');
        this.player1.clickCard(this.anchornaut);

        expect(this.anchornaut.location).toBe('play area');
        expect(this.anchornaut.attack).toBe(1);
        expect(this.anchornaut.life).toBe(2);
    });

    it('flips only printed attack and life with buff applied after', function () {
        // now body invert it. the buff from the shield should stay on the life
        this.player1.clickCard(this.bodyInversion);
        this.player1.clickPrompt('Body Inversion a unit');
        this.player1.clickCard(this.frostFang);

        expect(this.frostFang.attack).toBe(1);
        expect(this.frostFang.life).toBe(3);

        // Put a Crystal Shield on the unit to give a persistent buff
        this.player1.clickCard(this.crystalShield);
        this.player1.clickPrompt('Play This Alteration');
        this.player1.clickDie(2);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.frostFang);

        expect(this.frostFang.location).toBe('play area');
        expect(this.frostFang.attack).toBe(1);
        expect(this.frostFang.life).toBe(5);
    });

    it('interaction with silver snake', function () {
        this.player1.clickCard(this.crimsonBomber);
        this.player1.clickPrompt('Detonate 3');
        this.player1.clickPrompt('Done');

        expect(this.silverSnake.attack).toBe(1);
        expect(this.silverSnake.status).toBe(1);

        this.player1.endTurn();

        this.player2.clickCard('body-inversion', 'any', 'self');
        this.player2.clickPrompt('Body Inversion a unit');
        this.player2.clickCard(this.silverSnake);

        expect(this.silverSnake.location).toBe('play area');
        expect(this.silverSnake.attack).toBe(4);
        expect(this.silverSnake.life).toBe(1);

        this.player2.endTurn();

        expect(this.silverSnake.location).toBe('play area');
        expect(this.silverSnake.attack).toBe(1);
        expect(this.silverSnake.life).toBe(4);
    });

    it('interaction with silver snake with no status tokens', function () {
        expect(this.silverSnake.status).toBe(0);

        this.player1.endTurn();

        this.player2.clickCard('body-inversion', 'any', 'self');
        this.player2.clickPrompt('Body Inversion a unit');
        this.player2.clickCard(this.silverSnake);

        expect(this.silverSnake.location).toBe('archives');
    });

    it('interaction with silver snake and crystal shield', function () {
        this.player1.clickCard(this.crimsonBomber);
        this.player1.clickPrompt('Detonate 3');
        this.player1.clickPrompt('Done');

        expect(this.silverSnake.attack).toBe(1);
        expect(this.silverSnake.status).toBe(1);

        this.player1.endTurn();

        this.player2.clickCard('body-inversion', 'any', 'self');
        this.player2.clickPrompt('Body Inversion a unit');
        this.player2.clickCard(this.silverSnake);

        expect(this.silverSnake.location).toBe('play area');
        expect(this.silverSnake.attack).toBe(4);
        expect(this.silverSnake.life).toBe(1);

        this.player2.clickCard('crystal-shield', 'any', 'self');
        this.player2.clickPrompt('Play This Alteration');
        this.player2.clickDie(2);
        this.player2.clickPrompt('Done');
        this.player2.clickCard(this.silverSnake);

        expect(this.silverSnake.attack).toBe(4);
        expect(this.silverSnake.life).toBe(3);

        this.player2.endTurn();

        expect(this.silverSnake.location).toBe('play area');
        expect(this.silverSnake.attack).toBe(1);
        expect(this.silverSnake.life).toBe(6);
    });
});
