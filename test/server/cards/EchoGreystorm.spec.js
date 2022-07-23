describe('Echo Greystorm', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'echo-greystorm',
                inPlay: ['hammer-knight'],
                spellboard: [],
                dicepool: ['time', 'natural', 'charm', 'charm', 'sympathy', 'divine'],
                hand: ['cover', 'molten-gold', 'chaos-gravity', 'transfer'],
                deck: ['golden-veil', 'choke', 'fester', 'abundance', 'raptor-herder']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm', 'sympathy'],
                hand: ['sympathy-pain'],
                spellboard: ['summon-frostback-bear'],
                inPlay: ['flute-mage', 'salamander-monk']
            }
        });
        this.hammerKnight.tokens.exhaustion = 1;
    });

    it('places gravity flux token and removes at end of turn', function () {
        expect(this.fluteMage.tokens.gravityFlux).toBeUndefined();
        this.player1.clickCard(this.echoGreystorm);
        this.player1.clickPrompt('Gravity Flux');
        this.player1.clickCard(this.fluteMage);

        expect(this.fluteMage.tokens.gravityFlux).toBe(1);
        this.player1.clickPrompt('End Turn');
        this.player1.clickPrompt('Yes');
        expect(this.fluteMage.tokens.gravityFlux).toBeUndefined();
    });

    it('places gravity flux token which can move with chaos gravity', function () {
        expect(this.fluteMage.tokens.gravityFlux).toBeUndefined();
        this.player1.clickCard(this.echoGreystorm);
        this.player1.clickPrompt('Gravity Flux');
        this.player1.clickCard(this.fluteMage);

        expect(this.fluteMage.tokens.gravityFlux).toBe(1);
        this.player1.clickCard(this.chaosGravity);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(3);
        this.player1.clickDie(4);
        this.player1.clickPrompt('Done');

        expect(this.player1).toHavePrompt('Choose a unit to exhaust');
        this.player1.clickCard(this.salamanderMonk);
        expect(this.salamanderMonk.exhausted).toBe(true);

        expect(this.player1).toHavePrompt('Choose a unit to move exhaustion from');
        this.player1.clickCard(this.fluteMage);

        expect(this.player1).toHavePrompt('Choose a unit to move exhaustion to');
        this.player1.clickCard(this.salamanderMonk);
        expect(this.fluteMage.exhausted).toBe(false);
        expect(this.salamanderMonk.tokens.gravityFlux).toBe(1);

        expect(this.player1).toHavePrompt('Choose a unit to remove exhaustion from');
        this.player1.clickCard(this.hammerKnight);
        expect(this.hammerKnight.exhausted).toBe(false);

        this.player1.clickPrompt('End Turn');
        expect(this.salamanderMonk.tokens.gravityFlux).toBeUndefined();
        expect(this.fluteMage.tokens.gravityFlux).toBeUndefined();
    });

    it('places gravity flux token which can move with transfer', function () {
        expect(this.fluteMage.tokens.gravityFlux).toBeUndefined();
        this.fluteMage.tokens.status = 1; //  maintain choice

        this.player1.clickCard(this.echoGreystorm);
        this.player1.clickPrompt('Gravity Flux');
        this.player1.clickCard(this.fluteMage);

        expect(this.fluteMage.tokens.gravityFlux).toBe(1);
        this.player1.clickCard(this.transfer);
        this.player1.clickPrompt('Play this action');
        this.player1.clickDie(0);
        this.player1.clickPrompt('Done');

        expect(this.player1).toHavePrompt('Choose a card with tokens');
        this.player1.clickCard(this.fluteMage);

        expect(this.player1).toHavePrompt('Choose a type');
        this.player1.clickPrompt('gravityFlux');

        expect(this.player1).toHavePrompt('Choose a card to receive the token');
        this.player1.clickCard(this.summonFrostbackBear);
        expect(this.fluteMage.exhausted).toBe(false);
        expect(this.summonFrostbackBear.tokens.gravityFlux).toBe(1);

        this.player1.clickPrompt('End Turn');
        expect(this.summonFrostbackBear.tokens.gravityFlux).toBeUndefined();
    });
});
