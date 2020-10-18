const Dice = require('../../server/game/dice.js');

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
            { magic: 'ceremonial', level: 'class' },
            { magic: 'natural', level: 'class' }
        ];

        let chosenDice = Dice.matchDice(dice, diceReq);

        expect(chosenDice.length).toBe(2);
        expect(chosenDice[0].level).toBe('class');
        expect(chosenDice[1].level).toBe('class');
    });

    it('should match basic', function () {
        const diceReq = [{ level: 'basic' }];

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
        const diceReq = [{ level: 'basic' }];

        let chosenDice = Dice.matchDice(dice, diceReq);

        expect(chosenDice.length).toBe(1);
        expect(chosenDice[0].level).toBe('class');
    });

    it('should match class to power', function () {
        const dice = [
            { uuid: '3', magic: 'ceremonial', level: 'power' },
            { uuid: '5', magic: 'ceremonial', level: 'power' }
        ];
        const diceReq = [{ magic: 'ceremonial', level: 'class' }];

        let chosenDice = Dice.matchDice(dice, diceReq);

        expect(chosenDice.length).toBe(1);
        expect(chosenDice[0].level).toBe('power');
    });
});
