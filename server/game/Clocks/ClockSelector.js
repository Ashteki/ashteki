// const Clock = require('./Clock');
// const Timer = require('./Timer');
const ChessClock = require('./ChessClock');

const typeToClock = {
    none: (player, time) => null, //new Clock(player, time),
    timer: (player, time) => null, // new Timer(player, time),
    chess: (player, time) => new ChessClock(player, time)
};

class ClockSelector {
    static for(player, details = { type: 'none', time: 0, periods: 0, timePeriod: 0 }) {
        let factory = typeToClock[details.type];

        if (!factory) {
            throw new Error(`Unknown clock selector type of ${details.type}`);
        }

        return factory(player, details.time * 60, details.periods, details.timePeriod);
    }
}

module.exports = ClockSelector;
