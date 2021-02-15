describe('Summon Sleeping Widows bugreport', function () {
    /*
    summon sleeping widows triggered and was cast but no widows were summoned, 
    initiating action was small sacrifice on a masked wolf, 
    jessa screamed in the middle
    */
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'noah-redmoon',
                inPlay: ['masked-wolf'],
                spellboard: ['small-sacrifice'],
                dicepool: [
                    'natural',
                    'illusion',
                    'ceremonial',
                    'ceremonial',
                    'ceremonial',
                    'ceremonial'
                ],
                hand: ['summon-sleeping-widows'],
                archives: ['sleeping-widow', 'sleeping-widow']
            },
            player2: {
                phoenixborn: 'jessa-na-ni',
                inPlay: ['iron-worker', 'anchornaut'],
                dicepool: ['natural', 'illusion', 'charm', 'charm'],
                spellboard: [],
                hand: []
            }
        });
    });

    it('own unit destruction during small sacrifice, should put 2 widows in play as normal', function () {
        this.player1.clickCard(this.smallSacrifice);
        this.player1.clickPrompt('Small Sacrifice');
        this.player1.clickCard(this.maskedWolf);
        this.player1.clickCard(this.ironWorker);
        this.player1.clickPrompt('Damage');
        expect(this.maskedWolf.location).toBe('archives');
        expect(this.player1).toHavePrompt('Any reactions to Masked Wolf being destroyed?');
        this.player1.clickCard(this.summonSleepingWidows);
        expect(this.player1).toBeAbleToSelect(this.player1.archives[0]);
        expect(this.player1).toBeAbleToSelect(this.player1.archives[1]);
        this.player1.clickCard(this.player1.archives[0]);
        this.player1.clickCard(this.player1.archives[1]);
        this.player1.clickPrompt('Done');
        expect(this.player1.inPlay.length).toBe(2);
        // prompt for jessa screams
        expect(this.player2).toHavePrompt('Any reactions to Masked Wolf being destroyed?');
        this.player2.clickPrompt('Pass');
    });

    it('their unit destruction during small sacrifice with jessa scream', function () {
        this.player1.clickCard(this.smallSacrifice);
        this.player1.clickPrompt('Small Sacrifice');
        this.player1.clickCard(this.maskedWolf);
        this.player1.clickCard(this.anchornaut);
        this.player1.clickPrompt('Damage');
        expect(this.maskedWolf.location).toBe('archives');
        expect(this.player1).toHavePrompt('Any reactions to Masked Wolf being destroyed?');
        this.player1.clickCard(this.summonSleepingWidows);
        expect(this.player1).toBeAbleToSelect(this.player1.archives[0]);
        expect(this.player1).toBeAbleToSelect(this.player1.archives[1]);
        this.player1.clickCard(this.player1.archives[0]);
        this.player1.clickCard(this.player1.archives[1]);
        this.player1.clickPrompt('Done');
        expect(this.player1.inPlay.length).toBe(2);
        // prompt for jessa screams
        expect(this.player2).toHavePrompt('Any reactions to Masked Wolf being destroyed?');
        this.player2.clickCard(this.jessaNaNi);
        this.player2.clickDie(0);
        expect(this.noahRedmoon.damage).toBe(1);
        expect(this.anchornaut.location).toBe('discard');
        expect(this.player1).toHaveDefaultPrompt();
    });
});
