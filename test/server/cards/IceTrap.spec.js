describe('Ice Trap reaction spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['mist-spirit'],
                dicepool: ['illusion', 'ceremonial', 'illusion', 'charm'],
                spellboard: [],
                hand: ['massive-growth', 'stormwind-sniper', 'iron-worker', 'golden-veil']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut'],
                dicepool: ['natural', 'natural', 'charm', 'charm', 'ceremonial'],
                hand: ['ice-trap', 'fire-archer']
            }
        });

        this.mistSpirit.tokens.status = 2;
        this.player1.dicepool[3].level = 'basic';
    });

    it('can trap life 2 - iron worker', function () {
        this.player1.play(this.ironWorker);
        this.player1.clickDie(0);
        this.player1.clickDie(1);
        this.player1.clickDone();

        this.player2.clickCard(this.iceTrap); // reaction

        expect(this.ironWorker.location).toBe('discard');
    });

    it('setting to not ice trap own units OFF', function () {
        this.player1.endTurn();
        this.player2.play(this.fireArcher);
        this.player2.clickDone(); // ambush
        this.player2.clickCard(this.iceTrap); // reaction

        expect(this.fireArcher.location).toBe('discard');
    });

    it('setting to not ice trap own units ON', function () {
        this.player2.player.optionSettings.dontIceTrapOwnUnits = true;
        this.player1.endTurn();
        this.player2.play(this.fireArcher);
        this.player2.clickDone(); // ambush
        this.player2.clickCard(this.iceTrap); // reaction

        expect(this.fireArcher.location).toBe('play area');
    });

    it('cannot trap concealed unit - stormwind sniper', function () {
        this.player1.play(this.stormwindSniper);
        expect(this.stormwindSniper.location).toBe('play area');
        this.player2.clickCard(this.iceTrap); // reaction

        expect(this.stormwindSniper.location).toBe('play area');
    });

    it('can golden veil an ice trap', function () {
        this.player1.dicepool[3].level = 'power';
        this.player1.play(this.ironWorker);
        this.player1.clickDie(0);
        this.player1.clickDie(1);
        this.player1.clickDone();

        this.player2.clickCard(this.iceTrap); // reaction
        this.player1.clickCard(this.goldenVeil);

        expect(this.ironWorker.location).toBe('play area');
        expect(this.goldenVeil.location).toBe('discard');
        expect(this.iceTrap.location).toBe('discard');
    });
});
