describe('Soulfire Action Spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'james-endersight',
                inPlay: ['hammer-knight', 'anchornaut'],
                dicepool: ['divine', 'charm', 'natural'],
                hand: ['soulfire'],
                deck: ['summon-butterfly-monk', 'kneel', 'summon-steadfast-guardian'],
                discard: ['raptor-herder', 'flute-mage', 'sun-sister', 'abundance']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['iron-worker'],
                dicepool: ['divine', 'charm', 'natural'],
                spellboard: [],
                deck: ['summon-gilder', 'empower', 'purge'],
                discard: ['molten-gold']
            }
        });
    });

    it('remove 3 from game deal 1 damage twice to units then pb damage', function () {
        this.player1.play(this.soulfire);
        this.player1.clickDie(0);

        expect(this.player1).not.toBeAbleToSelect(this.abundance);
        this.player1.clickCard(this.raptorHerder);
        this.player1.clickCard(this.fluteMage);
        this.player1.clickCard(this.sunSister);
        this.player1.clickDone();
        expect(this.raptorHerder.location).toBe('purged');
        expect(this.fluteMage.location).toBe('purged');
        expect(this.sunSister.location).toBe('purged');

        expect(this.player1).not.toBeAbleToSelect(this.aradelSummergaard);
        this.player1.clickCard(this.ironWorker);
        expect(this.ironWorker.damage).toBe(1);
        this.player1.clickCard(this.ironWorker);

        expect(this.ironWorker.location).toBe('discard');

        expect(this.player1).toBeAbleToSelect(this.aradelSummergaard);
        this.player1.clickCard(this.aradelSummergaard);
        expect(this.aradelSummergaard.damage).toBe(1);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('remove 2 from game deal 1 damage twice to units', function () {
        this.player1.play(this.soulfire);
        this.player1.clickDie(0);

        this.player1.clickCard(this.raptorHerder);
        this.player1.clickCard(this.fluteMage);
        this.player1.clickDone();
        expect(this.raptorHerder.location).toBe('purged');
        expect(this.fluteMage.location).toBe('purged');

        this.player1.clickCard(this.ironWorker);
        expect(this.ironWorker.damage).toBe(1);
        this.player1.clickCard(this.ironWorker);

        expect(this.ironWorker.location).toBe('discard');
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('remove 1 from game deal 1 damage once to units', function () {
        this.player1.play(this.soulfire);
        this.player1.clickDie(0);

        this.player1.clickCard(this.raptorHerder);
        this.player1.clickDone();
        expect(this.raptorHerder.location).toBe('purged');

        expect(this.player1).not.toBeAbleToSelect(this.aradelSummergaard);
        this.player1.clickCard(this.ironWorker);

        expect(this.player1).toHaveDefaultPrompt();
    });
});
