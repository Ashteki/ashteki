const { parseCosts } = require('../../server/game/costs.js');
const { Level } = require('../../server/constants');

describe('more playcost parsing', function () {
    it('should recognise main action cost', function () {
        // parallel dice cost in the middle - stored as an array literal
        const playCost = ['[[main]]', '1 [[basic]]'];

        let costs = parseCosts(playCost);

        expect(Array.isArray(costs)).toBe(true);
        // one action cost and one dice cost
        expect(costs.length).toBe(2);

        // diceReq (dicecount) is the basic
        expect(costs[1].diceReq[0].level).toBe(Level.Basic);
    });

    it('should understand parallel action cost', function () {
        // parallel action cost - stored as an array literal
        const playCost = [['[[main]]', '[[side]]'], '1 [[basic]]'];

        let costs = parseCosts(playCost);

        expect(Array.isArray(costs)).toBe(true);
        // one action cost and one dice cost
        expect(costs.length).toBe(2);

        // diceReq (dicecount) is the basic
        expect(costs[1].diceReq[0].level).toBe(Level.Basic);
    });

    it('should allow parallel action cost in canPay', function () {
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
        const p = {
            dice: playerDice,
            actions: { main: true, side: true },
            getSpendableDice: () => playerDice
        };
        const canpay = diceCosts[0].canPay({ player: p });
        expect(canpay).toBe(true);
    });
});
