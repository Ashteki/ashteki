describe('Lethal Blade', function () {
    describe('attack buff', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'tash-cantasita',
                    inPlay: ['bastion-badger', 'mist-spirit'],
                    spellboard: ['summon-butterfly-monk'],
                    dicepool: ['charm', 'divine'],
                    hand: ['lethal-blade']
                },
                player2: {
                    phoenixborn: 'coal-roarkwin',
                    inPlay: ['anchornaut', 'iron-worker', 'flute-mage'],
                    spellboard: [],
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['anchornaut']
                }
            });
        });

        it('increase attached unit attack when in battle with pb', function () {
            this.player1.attachUpgrade(this.lethalBlade, this.mistSpirit);

            expect(this.mistSpirit.attack).toBe(1);
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.coalRoarkwin); // pb target
            this.player1.clickCard(this.mistSpirit); // single attacker
            this.player1.clickDone();
            this.player2.clickDone(); // no blockers
            expect(this.coalRoarkwin.damage).toBe(3);
        });

        it('no increase when in battle with a unit', function () {
            this.player1.attachUpgrade(this.lethalBlade, this.mistSpirit);

            expect(this.mistSpirit.attack).toBe(1);
            this.player1.clickPrompt('Attack');
            this.player1.clickCard(this.ironWorker); // unit target
            this.player1.clickCard(this.mistSpirit); // single attacker
            this.player2.clickDone(); // no guard
            this.player2.clickNo();
            expect(this.ironWorker.damage).toBe(1);
        });
    });
});
