const { Level } = require('../../../server/constants');

describe('Absorption reaction spell', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                phoenixborn: 'coal-roarkwin',
                inPlay: ['blue-jaguar', 'mist-spirit', 'iron-worker'],
                dicepool: ['natural']
            },
            player2: {
                phoenixborn: 'aradel-summergaard',
                inPlay: ['flute-mage'],
                dicepool: ['sympathy', 'natural', 'charm'],
                hand: ['absorption'],
                deck: ['molten-gold']
            }
        });
    });

    it('prevents one damage on unit attack by lowering one die one level', function () {
        expect(this.fluteMage.damage).toBe(0);
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage);
        this.player1.clickCard(this.ironWorker);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('No');

        this.player2.clickCard(this.absorption);
        this.player2.clickDie(1);
        this.player2.clickDone();
        expect(this.absorption.location).toBe('discard');
        expect(this.player2.dicepool[1].level).toBe(Level.Class);
        expect(this.fluteMage.damage).toBe(1);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('prevents one damage on pb attack by lowering one die one level', function () {
        expect(this.fluteMage.damage).toBe(0);
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.aradelSummergaard);
        this.player1.clickCard(this.ironWorker);
        this.player1.clickDone();
        this.player2.clickDone();

        this.player2.clickCard(this.absorption);
        this.player2.clickDie(1);
        this.player2.clickDone();
        expect(this.absorption.location).toBe('discard');
        expect(this.player2.dicepool[1].level).toBe(Level.Class);
        expect(this.aradelSummergaard.damage).toBe(1);
        expect(this.player1).toHaveDefaultPrompt();
    });

    it('prevents two damage on attack by lowering two dice one level', function () {
        expect(this.fluteMage.damage).toBe(0);
        this.player1.clickPrompt('Attack');
        this.player1.clickCard(this.fluteMage);
        this.player1.clickCard(this.ironWorker);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('No');

        this.player2.clickCard(this.absorption);
        this.player2.clickDie(1);
        this.player2.clickDie(2);
        this.player2.clickDone();
        expect(this.absorption.location).toBe('discard');
        expect(this.player2.dicepool[1].level).toBe(Level.Class);
        expect(this.player2.dicepool[2].level).toBe(Level.Class);
        expect(this.fluteMage.damage).toBe(0);
        expect(this.player1).toHaveDefaultPrompt();
    });
});
