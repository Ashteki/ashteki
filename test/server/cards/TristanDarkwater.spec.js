describe('Tristan Darkwater, magnify', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'tristan-darkwater',
                inPlay: [
                    'prism-tetra',
                    'raptor-hatchling',
                    'crystal-archer',
                    'iron-worker',
                    'nightshade-swallow',
                    'shadow-spirit',
                    'psychic-vampire',
                    'beast-warrior',
                    'frost-frog'
                ],
                spellboard: [],
                dicepool: ['time', 'natural', 'charm', 'charm', 'natural'],
                hand: ['cover', 'molten-gold'],
                deck: ['golden-veil', 'choke', 'fester', 'abundance', 'raptor-herder']
            },
            player2: {
                phoenixborn: 'saria-guideman',
                dicepool: ['natural', 'natural', 'charm', 'charm'],
                hand: ['sympathy-pain', 'purge'],
                inPlay: ['flute-mage', 'hammer-knight', 'iron-rhino']
            }
        });
    });

    it('magnify group tactics', function () {
        this.player1.clickCard(this.tristanDarkwater);
        this.player1.clickPrompt('Magnify');
        this.player1.clickDie(0);
        this.player1.clickCard(this.prismTetra);
        this.player1.clickCard(this.raptorHatchling);
        this.player1.clickCard(this.ironWorker);

        // can't select ironWorker
        expect(this.player1.player.selectedCards.includes(this.ironWorker)).toBe(false);
        this.player1.clickDone();
        expect(this.prismTetra.getKeywordValue('grouptactics')).toBe(1);

        this.player1.clickAttack(this.sariaGuideman);
        this.player1.clickCard(this.prismTetra);
        this.player1.clickDone();

        expect(this.prismTetra.isAttacker).toBe(true);
        expect(this.prismTetra.getKeywordValue('grouptactics')).toBe(2);
    });

    it('magnify crystal archer', function () {
        this.player1.clickCard(this.tristanDarkwater);
        this.player1.clickPrompt('Magnify');
        this.player1.clickDie(0);
        this.player1.clickCard(this.crystalArcher);
        this.player1.clickDone();

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickCard(this.crystalArcher);
        this.player1.clickCard(this.ironRhino);

        expect(this.ironRhino.damage).toBe(2);
    });

    it('magnify nightshade swallow', function () {
        this.player1.clickCard(this.tristanDarkwater);
        this.player1.clickPrompt('Magnify');
        this.player1.clickDie(0);
        this.player1.clickCard(this.nightshadeSwallow);
        this.player1.clickDone();

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.hammerKnight);
        this.player1.clickCard(this.nightshadeSwallow);
        this.player2.clickDone();
        this.player2.clickYes();

        this.player1.clickCard(this.ironRhino);

        expect(this.ironRhino.exhaustion).toBe(2);
    });

    it('magnify shadow spirit', function () {
        expect(this.player2.dicepool[0].level).toBe('power');
        expect(this.player2.dicepool[1].level).toBe('power');
        this.player1.clickCard(this.tristanDarkwater);
        this.player1.clickPrompt('Magnify');
        this.player1.clickDie(0);
        this.player1.clickCard(this.shadowSpirit);
        this.player1.clickDone();

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.sariaGuideman);
        this.player1.clickCard(this.shadowSpirit);
        this.player1.clickPrompt('Done');
        this.player1.clickOpponentDie(0);
        this.player1.clickOpponentDie(1);
        this.player1.clickDone();
        expect(this.player2.dicepool[0].level).toBe('class');
        expect(this.player2.dicepool[1].level).toBe('class');
    });

    it('magnify psychic vampire', function () {
        expect(this.player2.dicepool[0].level).toBe('power');
        expect(this.player2.dicepool[1].level).toBe('power');
        this.player1.clickCard(this.tristanDarkwater);
        this.player1.clickPrompt('Magnify');
        this.player1.clickDie(0);
        this.player1.clickCard(this.psychicVampire);
        this.player1.clickDone();

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage);
        this.player1.clickCard(this.psychicVampire);
        this.player2.clickDone();
        this.player2.clickYes();
        this.player2.clickCard(this.sympathyPain);
        this.player2.clickCard(this.purge);
        this.player2.clickDone();

        expect(this.purge.location).toBe('discard');
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('magnify beast warrior transform', function () {
        this.game.setRoundFirstPlayer(this.player2.player);
        this.game.switchActivePlayer();
        expect(this.player1.player.firstPlayer).toBe(false);
        expect(this.player2.dicepool[0].level).toBe('power');
        expect(this.player2.dicepool[1].level).toBe('power');
        this.player1.clickCard(this.tristanDarkwater);
        this.player1.clickPrompt('Magnify');
        this.player1.clickDie(0);
        this.player1.clickCard(this.beastWarrior);
        this.player1.clickDone();

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage);
        this.player1.clickCard(this.beastWarrior);
        this.player2.clickDone();
        expect(this.beastWarrior.attack).toBe(3);
    });

    it('magnify frost frog', function () {
        this.player1.clickCard(this.tristanDarkwater);
        this.player1.clickPrompt('Magnify');
        this.player1.clickDie(0);
        this.player1.clickCard(this.frostFrog);
        this.player1.clickDone();

        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage);
        this.player1.clickCard(this.frostFrog);
        this.player1.clickPrompt('+1 Attack');
        this.player2.clickDone();
        expect(this.frostFrog.attack).toBe(3);
    });
});
