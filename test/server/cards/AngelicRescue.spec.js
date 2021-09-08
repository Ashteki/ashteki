describe('Angelic Rescue reaction spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['flute-mage', 'hammer-knight'],
                spellboard: [],
                hand: ['anchornaut'],
                dicepool: ['natural', 'natural', 'charm', 'charm']
            },
            player2: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['iron-worker', 'mist-spirit'],
                spellboard: ['summon-butterfly-monk'],
                dicepool: ['natural', 'natural', 'charm', 'charm', 'divine'],
                archives: ['butterfly-monk'],
                hand: ['angelic-rescue']
            }
        });

        this.ironWorker.tokens.damage = 1;
    });

    it('can be played when a unit takes damage', function () {
        this.player1.clickCard(this.anchornaut);
        this.player1.clickPrompt('Play This Ally');
        this.player1.clickDie(2);
        this.player1.clickCard(this.ironWorker); // target

        // any interrupts?
        expect(this.player2).toHavePrompt(
            'Any Reactions to Iron Worker receiving 1 damage from Anchornaut?'
        );
        this.player2.clickCard(this.angelicRescue); // click angelic rescue to play as reaction
        this.player2.clickDie(4);

        expect(this.angelicRescue.location).toBe('discard');
        expect(this.player2.hand.length).toBe(0);

        expect(this.hammerKnight.damage).toBe(0);
        expect(this.ironWorker.damage).toBe(0); // healed iron worker
    });

    it('cannot be played when an opposing unit takes damage', function () {
        this.player1.clickCard(this.anchornaut);
        this.player1.clickPrompt('Play This Ally');
        this.player1.clickDie(2);
        this.player1.clickCard(this.hammerKnight); // target

        // expect no interrupts
        expect(this.player2).not.toHavePrompt(
            'Any Reactions to Hammer Knight receiving 1 damage from Anchornaut?'
        );
        expect(this.player2).not.toBeAbleToSelect(this.angelicRescue);
    });
});
