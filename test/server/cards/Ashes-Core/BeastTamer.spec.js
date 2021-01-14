describe('Gigantic attacks', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['beast-tamer', 'mist-spirit'],
                spellboard: ['summon-butterfly-monk']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['anchornaut', 'iron-worker'],
                spellboard: [],
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['anchornaut']
            }
        });
    });

    it('reduces attack for unit atack', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.ironWorker); // target
        this.player1.clickCard(this.beastTamer); // single attacker
        this.player2.clickPrompt('Done'); // no guard

        expect(this.player2).toHavePrompt('Do you want to counter?');
        expect(this.ironWorker.attack).toBe(1);
        expect(this.mistSpirit.attack).toBe(1);
        expect(this.anchornaut.attack).toBe(0);
        expect(this.anchornaut.effects.length).toBe(0);
        this.player2.clickPrompt('No'); // ends attack
        expect(this.ironWorker.attack).toBe(2);
    });

    it('check for destroyed units', function () {
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.ironWorker); // target
        this.player1.clickCard(this.beastTamer); // single attacker
        this.player2.clickPrompt('Done'); // no guard

        expect(this.player2).toHavePrompt('Do you want to counter?');
        expect(this.ironWorker.attack).toBe(1);
        this.player2.clickPrompt('Yes'); // ends attack
        expect(this.ironWorker.location).toBe('discard');
        expect(this.ironWorker.attack).toBe(2);
    });
});
