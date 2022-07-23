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

    it('Refresh BUG test part 1 - req order shouldnt matter', function () {
        const diceReq = [new DiceCount(1, Level.Power, Magic.Charm), new DiceCount(1, Level.Basic)];

        let testDice = [
            { uuid: '1', magic: 'natural', level: 'power' },
            { uuid: '3', magic: 'charm', level: 'power' }
        ];
        let result = Dice.canMatch(testDice, diceReq);

        expect(result).toBe(true);
    });

    it('Refresh BUG test because req order shouldnt matter', function () {
        const diceReq = [new DiceCount(1, Level.Power, Magic.Charm), new DiceCount(1, Level.Basic)];

        let testDice = [
            { uuid: '3', magic: 'charm', level: 'power' },
            { uuid: '1', magic: 'natural', level: 'power' }
        ];
        let result = Dice.canMatch(testDice, diceReq);

        expect(result).toBe(true);
    });

    it('Chaos Gravity BUG test - match parallel and basic ', function () {
        const diceReq = [
            [
                new DiceCount(1, Level.Class, Magic.Divine),
                new DiceCount(1, Level.Class, Magic.Sympathy)
            ],
            new DiceCount(1, Level.Basic)
        ];

        let testDice = [
            { uuid: '3', magic: 'sympathy', level: 'class' },
            { uuid: '1', magic: 'natural', level: 'class' }
        ];
        let result = Dice.canMatch(testDice, diceReq);

        expect(result).toBe(true);
    });

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

    it('should match parallel to single dice if only one available', function () {
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

    it('should not match parallel where both available', function () {
        const dice = [
            { uuid: '3', magic: 'charm', level: 'class' },
            { uuid: '2', magic: 'illusion', level: 'class' },
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

        expect(chosenDice.length).toBe(1);
        // non-parallel chosen
        expect(chosenDice[0].level).toBe('class');
        expect(chosenDice[0].magic).toBe('ceremonial');
    });

    it('should not match parallel and basic with both parallels available', function () {
        const dice = [
            { uuid: '3', magic: 'divine', level: 'power' },
            { uuid: '2', magic: 'divine', level: 'class' },
            { uuid: '5', magic: 'sympathy', level: 'class' },
            { uuid: '6', magic: 'sympathy', level: 'class' },
            { uuid: '7', magic: 'charm', level: 'basic' },
            { uuid: '8', magic: 'ceremonial', level: 'basic' }
        ];
        // parallel cost should match charm class die
        const diceReq = [
            [
                new DiceCount(1, Level.Class, Magic.Sympathy),
                new DiceCount(1, Level.Class, Magic.Divine)
            ],
            new DiceCount(1, Level.Basic)
        ];

        let matchedDice = Dice.matchDice(dice, diceReq);

        expect(matchedDice.length).toBe(1);
        // basic only
        expect(matchedDice[0].level).toBe('basic');
        expect(matchedDice[0].magic).toBe('charm');
    });

    it('should match parallel and basic with one parallel available', function () {
        const dice = [
            { uuid: '5', magic: 'sympathy', level: 'class' },
            { uuid: '6', magic: 'sympathy', level: 'class' },
            { uuid: '7', magic: 'charm', level: 'basic' },
            { uuid: '8', magic: 'ceremonial', level: 'basic' }
        ];
        // parallel cost should match charm class die
        const diceReq = [
            [
                new DiceCount(1, Level.Class, Magic.Sympathy),
                new DiceCount(1, Level.Class, Magic.Divine)
            ],
            new DiceCount(1, Level.Basic)
        ];

        let matchedDice = Dice.matchDice(dice, diceReq);

        expect(matchedDice.length).toBe(2);
        // parallel first
        expect(matchedDice[0].level).toBe('class');
        expect(matchedDice[0].magic).toBe('sympathy');
        expect(matchedDice[1].level).toBe('basic');
        expect(matchedDice[1].magic).toBe('charm');
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
