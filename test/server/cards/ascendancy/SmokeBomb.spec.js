describe('Smoke Bomb', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'kanna-galeheart',
                inPlay: [],
                dicepool: ['natural', 'illusion', 'charm', 'artifice'],
                spellboard: ['precise-shot', 'summon-galewind-hawk'],
                archives: ['cloud-spirit', 'cloud-spirit', 'cloud-spirit', 'cloud-spirit'],
                hand: ['anchornaut', 'hurricane', 'smoke-bomb', 'hammer-knight'],
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

    it('lower four dice then exhaust a hosted die to deal 1 aoe', function () {
        this.player1.attachDie(3, this.preciseShot);
        expect(this.preciseShot.isCharged).toBe(true);
        expect(this.player1.dicepool.length).toBe(3);
        this.player1.play(this.smokeBomb);
        this.player1.clickDie(0);
        this.player1.clickDone();
        this.player1.clickOpponentDie(0);
        this.player1.clickDone();

        expect(this.player2.dicepool[0].level).toBe('class');
        // choose die to exhaust
        this.player1.clickDieUpgrade(this.preciseShot);
        this.player1.clickCard(this.beastTamer);
        this.player1.clickCard(this.blueJaguar);
        expect(this.blueJaguar.damage).toBe(1);
        expect(this.beastTamer.damage).toBe(1);
        expect(this.player1.dicepool.length).toBe(4);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
