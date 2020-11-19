const { parseCosts, parseDiceCost } = require('../../server/game/costs.js');
const DiceCost = require('../../server/game/costs/dicecost');
const DiceCount = require('../../server/game/DiceCount');
const { Magic, Level } = require('../../server/constants');

describe('playcost parsing', function () {
    it('should understand parallel dice cost', function () {
        // parallel dice cost - stored as an array literal
        const costSpec = ['1 [[ceremonial:class]]', '1 [[charm:class]]'];

        let diceReq = parseDiceCost(costSpec);

        // dice cost is potentially multiples
        expect(Array.isArray(diceReq)).toBe(true);
        // a single parallel cost should return a single cost entry
        expect(diceReq.length).toBe(1);
        // that entry is an array of choices
        expect(Array.isArray(diceReq[0])).toBe(true);
        expect(diceReq[0][0].magic).toBe('ceremonial');
        expect(diceReq[0][0].level).toBe('class');
    });

    it('Dicecost is a class', function () {
        const diceReq = [
            new DiceCount(1, Level.Class, Magic.Ceremonial),
            new DiceCount(1, Level.Class, Magic.Natural)
        ];

        const dc = new DiceCost(diceReq);

        expect(dc instanceof DiceCost).toBe(true);
    });

    it('should recognise main action cost', function () {
        // parallel dice cost in the middle - stored as an array literal
        const playCost = [
            '[[main]]',
            ['1 [[ceremonial:class]]', '1 [[charm:class]]'],
            '1 [[basic]]'
        ];

        let costs = parseCosts(playCost);

        expect(Array.isArray(costs)).toBe(true);
        // one action cost and one dice cost (parallel cost is inside the dice cost req)
        expect(costs.length).toBe(2);
        // expect(costs[1] instanceof DiceCost).toBe(true); // this doesn't work for some reason
        // parallel cost gives an array diceReq (dicecount)
        expect(Array.isArray(costs[1].diceReq[0])).toBe(true);
        // second diceReq (dicecount) is the basic
        expect(costs[1].diceReq[1].level).toBe(Level.Basic);
    });

    it('should recognise living doll cost', function () {
        // parallel dice cost in the middle - stored as an array literal
        const playCost = [
            '[[main]]',
            ['1 [[sympathy:class]]', '1 [[charm:class]]'],
            '1 [[ceremonial:class]]'
        ];

        let costs = parseCosts(playCost);

        expect(Array.isArray(costs)).toBe(true);
        // one action cost and one dice cost (parallel cost is inside the dice cost req)
        expect(costs.length).toBe(2);
        const diceCost = costs[1];
        expect(diceCost.diceReq.length).toBe(2);
        expect(diceCost.diceReq[0].length).toBe(2);
        expect(diceCost.diceReq[0][0].magic).toBe(Magic.Sympathy);
        expect(diceCost.diceReq[1].level).toBe(Level.Class);
        expect(diceCost.diceReq[1].count).toBe(1);
    });

    it('should allow parallel cost in canPay', function () {
        const playCost = [['1 [[sympathy:class]]', '1 [[charm:class]]'], '1 [[ceremonial:class]]'];
        const diceCosts = parseCosts(playCost);

        expect(diceCosts.length).toBe(1);
        const playerDice = [
            { uuid: '1', magic: 'natural', level: 'power' },
            { uuid: '2', magic: 'charm', level: 'class' },
            { uuid: '3', magic: 'ceremonial', level: 'basic' },
            { uuid: '4', magic: 'ceremonial', level: 'class' },
            { uuid: '5', magic: 'ceremonial', level: 'power' }
        ];
        const p = { dice: playerDice };
        const canpay = diceCosts[0].canPay({ player: p });
        expect(canpay).toBe(true);
    });
});
