describe('Soul Delver', function () {
    describe('PvP', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight', 'soul-delver'],
                    spellboard: ['abundance'],
                    dicepool: ['natural', 'sympathy', 'time', 'charm'],
                    hand: ['seek-the-depths', 'purge'],
                    archives: ['spark', 'soul-delver']
                },
                player2: {
                    phoenixborn: 'saria-guideman',
                    dicepool: ['natural', 'natural', 'charm', 'charm'],
                    hand: ['sympathy-pain'],
                    inPlay: ['flute-mage', 'iron-rhino', 'sonic-swordsman']
                }
            });
            this.luluFirststone.tokens.status = 1;
        });

        it('lower opponent single die on attack', function () {
            expect(this.player2.dicepool[0].level).toBe('power');
            this.player1.clickAttack(this.sariaGuideman);
            this.player1.clickCard(this.soulDelver);
            this.player1.clickDone();
            this.player1.clickPrompt('Opponent');
            this.player1.clickOpponentDie(0);

            expect(this.player2.dicepool[0].level).toBe('class');
            this.player1.clickDone();
            expect(this.player2).toHavePrompt('Choose a blocker');
        });

        it('lower two opponent dice on attack', function () {
            this.luluFirststone.tokens.status = 2;

            expect(this.player2.dicepool[0].level).toBe('power');
            expect(this.player2.dicepool[1].level).toBe('power');
            this.player1.clickAttack(this.sariaGuideman);
            this.player1.clickCard(this.soulDelver);
            this.player1.clickDone();
            this.player1.clickPrompt('Opponent');
            this.player1.clickOpponentDie(0);
            this.player1.clickOpponentDie(1);
            this.player1.clickDone();

            expect(this.player2.dicepool[0].level).toBe('class');
            expect(this.player2.dicepool[1].level).toBe('class');
            expect(this.player2).toHavePrompt('Choose a blocker');
        });

        it('raise my single die on attack', function () {
            this.player1.dicepool[0].level = 'class';
            expect(this.player1.dicepool[0].level).toBe('class');
            this.player1.clickAttack(this.sariaGuideman);
            this.player1.clickCard(this.soulDelver);
            this.player1.clickDone();
            this.player1.clickPrompt('Me');
            this.player1.clickDie(0);

            expect(this.player1.dicepool[0].level).toBe('power');
            this.player1.clickDone();
            expect(this.player2).toHavePrompt('Choose a blocker');
        });

        it('click twice cycles my class die to power then basic then off', function () {
            this.player1.dicepool[0].level = 'class';
            expect(this.player1.dicepool[0].level).toBe('class');
            this.player1.clickAttack(this.sariaGuideman);
            this.player1.clickCard(this.soulDelver);
            this.player1.clickDone();
            this.player1.clickPrompt('Me');
            this.player1.clickDie(0);
            expect(this.player1.dicepool[0].level).toBe('power');
            this.player1.clickDie(0);
            expect(this.player1.dicepool[0].level).toBe('basic');
            this.player1.clickDie(0);
            expect(this.player1.dicepool[0].level).toBe('class');
            this.player1.clickDie(0);
            expect(this.player1.dicepool[0].level).toBe('power');
            this.player1.clickDone();
            expect(this.player2).toHavePrompt('Choose a blocker');
        });

        it('click twice cycles opponent class die to basic then power', function () {
            this.player2.dicepool[0].level = 'class';
            expect(this.player2.dicepool[0].level).toBe('class');
            this.player1.clickAttack(this.sariaGuideman);
            this.player1.clickCard(this.soulDelver);
            this.player1.clickDone();
            this.player1.clickPrompt('Opponent');
            this.player1.clickOpponentDie(0);
            expect(this.player2.dicepool[0].level).toBe('basic');
            this.player1.clickOpponentDie(0);
            expect(this.player2.dicepool[0].level).toBe('power');
            this.player1.clickDone();
            expect(this.player2).toHavePrompt('Choose a blocker');
        });

        it('click twice removes a basic die selection', function () {
            this.player1.dicepool[0].level = 'basic';
            expect(this.player1.dicepool[0].level).toBe('basic');
            this.player1.clickAttack(this.sariaGuideman);
            this.player1.clickCard(this.soulDelver);
            this.player1.clickDone();
            this.player1.clickPrompt('Me');
            this.player1.clickDie(0);
            expect(this.player1.dicepool[0].level).toBe('class');
            this.player1.clickDie(0);
            expect(this.player1.dicepool[0].level).toBe('basic');
            this.player1.clickDone();
            expect(this.player2).toHavePrompt('Choose a blocker');
        });
    });

    describe('PvE', function () {
        beforeEach(function () {
            this.setupTest({
                player1: {
                    phoenixborn: 'lulu-firststone',
                    inPlay: ['hammer-knight', 'soul-delver'],
                    spellboard: ['abundance'],
                    dicepool: ['natural', 'sympathy', 'time', 'charm'],
                    hand: ['seek-the-depths', 'purge'],
                    archives: ['spark', 'soul-delver']
                },
                player2: {
                    dummy: true,
                    phoenixborn: 'corpse-of-viros',
                    behaviour: 'viros-behaviour',
                    ultimate: 'viros-ultimate',
                    inPlay: ['rampage'],
                    spellboard: [],
                    threatZone: ['whiplash', 'hunting-instincts'],
                    dicepool: ['rage', 'rage', 'rage', 'rage', 'rage']
                }
            });
            this.luluFirststone.tokens.status = 1;
            this.player2.dicepool[0].level = 'power';
        });

        it('lower chimera rage die on attack', function () {
            expect(this.player2.dicepool[0].level).toBe('power');
            this.player1.clickAttack(this.corpseOfViros);
            this.player1.clickCard(this.soulDelver);
            this.player1.clickDone();
            this.player1.clickPrompt('Opponent');
            this.player1.clickOpponentDie(0);

            expect(this.player2.dicepool[0].level).toBe('basic');
            this.player1.clickDone();
            expect(this.player2).toHavePrompt('Choose a blocker');
        });
    });
});
