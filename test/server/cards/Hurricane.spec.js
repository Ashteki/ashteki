describe('Hurricane', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'kanna-galeheart',
                inPlay: ['flute-mage', 'iron-worker'],
                dicepool: ['divine', 'divine', 'natural', 'natural', 'astral', 'astral'],
                spellboard: ['summon-storm-spirit', 'summon-galewind-hawk'],
                archives: ['the-awakened-state'],
                hand: [
                    'anchornaut',
                    'hurricane',
                    'searing-bolt',
                    'hammer-knight',
                    'rayward-knight'
                ],
                discard: ['concentration', 'concentration']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                dicepool: ['divine', 'divine', 'natural', 'natural', 'time', 'time'],
                inPlay: ['beast-tamer', 'blue-jaguar'],
                spellboard: ['chant-of-revenge']
            }
        });
    });

    it('remove exhaustion, lower 3 dice and deal 1 aoe damage to opp units', function () {
        this.kannaGaleheart.tokens.exhaustion = 1;
        this.summonStormSpirit.tokens.exhaustion = 1;
        this.fluteMage.tokens.exhaustion = 1;
        expect(this.kannaGaleheart.exhausted).toBe(true);
        this.player1.play(this.hurricane);
        this.player1.clickDie(0);
        this.player1.clickDie(1);
        this.player1.clickDie(2);
        this.player1.clickDone();

        expect(this.player1).toBeAbleToSelect(this.summonStormSpirit);
        expect(this.player1).not.toBeAbleToSelect(this.fluteMage);

        this.player1.clickCard(this.kannaGaleheart);
        expect(this.kannaGaleheart.exhausted).toBe(false);

        this.player1.clickOpponentDie(0);
        this.player1.clickOpponentDie(1);
        this.player1.clickOpponentDie(2);
        this.player1.clickDone();
        expect(this.player2.dicepool[1].level).toBe('class');

        this.player1.clickCard(this.beastTamer);
        this.player1.clickCard(this.blueJaguar);

        expect(this.beastTamer.damage).toBe(1);
        expect(this.blueJaguar.damage).toBe(1);

        expect(this.player1).toHaveDefaultPrompt();
    });
});
