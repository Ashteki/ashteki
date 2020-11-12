const Dice = require('../../server/game/dice.js');
const DiceCount = require('../../server/game/DiceCount.js');
const { Magic, Level } = require('../../server/constants');

describe('dice matching', function () {
    const dice = [
        { uuid: '1', magic: 'natural', level: 'power' },
        { uuid: '2', magic: 'natural', level: 'class' },
        { uuid: '3', magic: 'ceremonial', level: 'basic' },
        { uuid: '4', magic: 'ceremonial', level: 'class' },
        { uuid: '5', magic: 'ceremonial', level: 'power' }
    ];

    it('should match exact class when power is available', function () {
        const diceReq = [
            new DiceCount(1, Level.Class, Magic.Ceremonial),
            new DiceCount(1, Level.Class, Magic.Natural)
        ];

        let chosenDice = Dice.matchDice(dice, diceReq);

        expect(chosenDice.length).toBe(2);
        expect(chosenDice[0].level).toBe('class');
        expect(chosenDice[1].level).toBe('class');
    });

    it('should match basic', function () {
        const diceReq = [new DiceCount(1, Level.Basic)];

        let chosenDice = Dice.matchDice(dice, diceReq);

        expect(chosenDice.length).toBe(1);
        expect(chosenDice[0].level).toBe('basic');
    });

    it('should match basic to class before power', function () {
        const dice = [
            { uuid: '1', magic: 'natural', level: 'power' },
            { uuid: '2', magic: 'natural', level: 'class' },
            { uuid: '3', magic: 'ceremonial', level: 'power' },
            { uuid: '4', magic: 'ceremonial', level: 'class' },
            { uuid: '5', magic: 'ceremonial', level: 'power' }
        ];
        const diceReq = [new DiceCount(1, Level.Basic)];

        let chosenDice = Dice.matchDice(dice, diceReq);

        expect(chosenDice.length).toBe(1);
        expect(chosenDice[0].level).toBe('class');
    });

    it('should match class to power', function () {
        const dice = [
            { uuid: '3', magic: 'ceremonial', level: 'power' },
            { uuid: '5', magic: 'ceremonial', level: 'power' }
        ];
        const diceReq = [new DiceCount(1, Level.Class, Magic.Ceremonial)];

        let chosenDice = Dice.matchDice(dice, diceReq);

        expect(chosenDice.length).toBe(1);
        expect(chosenDice[0].level).toBe('power');
    });

    it('should match parallel to single dice', function () {
        const dice = [
            { uuid: '3', magic: 'charm', level: 'class' },
            { uuid: '5', magic: 'ceremonial', level: 'class' }
        ];
        // parallel cost should match charm class die
        const diceReq = [
            [
                new DiceCount(1, Level.Class, Magic.Illusion),
                new DiceCount(1, Level.Class, Magic.Charm)
            ],
            new DiceCount(1, Level.Class, Magic.Ceremonial)
        ];

        let chosenDice = Dice.matchDice(dice, diceReq);

        expect(chosenDice.length).toBe(2);
        // non-parallel first
        expect(chosenDice[0].level).toBe('class');
        expect(chosenDice[0].magic).toBe('ceremonial');
        expect(chosenDice[1].level).toBe('class');
        expect(chosenDice[1].magic).toBe('charm');
    });

    it('matches multiple dice in a single cost', function () {
        const dice = [
            { uuid: '1', magic: 'natural', level: 'power' },
            { uuid: '2', magic: 'natural', level: 'class' },
            { uuid: '3', magic: 'ceremonial', level: 'power' },
            { uuid: '4', magic: 'ceremonial', level: 'class' },
            { uuid: '6', magic: 'ceremonial', level: 'class' },
            { uuid: '5', magic: 'ceremonial', level: 'power' },
            { uuid: '7', magic: 'charm', level: 'basic' },
            { uuid: '8', magic: 'ceremonial', level: 'basic' }
        ];

        const diceReq = [new DiceCount(2, Level.Power, Magic.Ceremonial)];
        let chosenDice = Dice.matchDice(dice, diceReq);
        expect(chosenDice.length).toBe(2);
    });

    it('canMatch understands multiple dice in a single cost', function () {
        const dice = [
            { uuid: '1', magic: 'natural', level: 'power' },
            { uuid: '2', magic: 'natural', level: 'class' },
            { uuid: '3', magic: 'ceremonial', level: 'power' },
            { uuid: '4', magic: 'ceremonial', level: 'class' },
            { uuid: '6', magic: 'ceremonial', level: 'class' },
            { uuid: '5', magic: 'ceremonial', level: 'power' },
            { uuid: '7', magic: 'charm', level: 'basic' },
            { uuid: '8', magic: 'ceremonial', level: 'basic' }
        ];

        const diceReq = [new DiceCount(2, Level.Power, Magic.Ceremonial)];
        let canDo = Dice.canMatch(dice, diceReq);
        expect(canDo).toBe(true);
    });
});
