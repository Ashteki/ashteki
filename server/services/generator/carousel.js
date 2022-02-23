class Carousel {
    constructor() {
        this.pbs = [];
    }

    getCoalOff() {
        return this.getCarousel('coal-roarkwin', 7);
    }

    getCarousel(pbStub = null, diceTypes = 3) {
        if (this.pbs.length === 0) {
            this.pbs.push(...this.getPBs());
        }
        let dice = [
            { char: 'H', magic: 'charm' },
            { char: 'C', magic: 'ceremonial' },
            { char: 'I', magic: 'illusion' },
            { char: 'N', magic: 'natural' },
            { char: 'D', magic: 'divine' },
            { char: 'S', magic: 'sympathy' },
            { char: 'T', magic: 'time' }
        ];

        let pb = null;
        if (pbStub) {
            pb = this.pbs.find((pb) => pb.stub === pbStub);
        }
        if (!pb) {
            // Returns a random integer from 1 to pb count:
            const i = Math.floor(Math.random() * this.pbs.length);
            pb = this.pbs[i];
        }

        const d = [];
        for (let j = 0; j < diceTypes; j++) {
            const dIndex = Math.floor(Math.random() * dice.length);
            d[j] = dice[dIndex];
            dice = dice.filter((d) => d !== dice[dIndex]);
        }

        const caro = {
            pb: pb,
            dice: d
        };

        // don't remove for coal-off
        if (!pbStub) {
            this.pbs = this.pbs.filter((p) => p !== caro.pb);
        }

        return caro;
    }

    getPBs() {
        return [
            { stub: 'coal-roarkwin', name: 'Coal' },
            { stub: 'aradel-summergaard', name: 'Aradel' },
            { stub: 'maeoni-viper', name: 'Maeoni' },
            { stub: 'jessa-na-ni', name: 'Jessa' },
            { stub: 'noah-redmoon', name: 'Noah' },
            { stub: 'saria-guideman', name: 'Saria' },
            { stub: 'rin-northfell', name: 'Rin' },
            { stub: 'victoria-glassfire', name: 'Victoria' },
            { stub: 'brennen-blackcloud', name: 'Brennen' },
            { stub: 'leo-sunshadow', name: 'Leo' },
            { stub: 'odette-diamondcrest', name: 'Odette' },
            { stub: 'namine-hymntide', name: 'Namine' },
            { stub: 'jericho-reborn', name: 'Jericho' },
            { stub: 'echo-greystorm', name: 'Echo' },
            { stub: 'koji-wolfcub', name: 'Koji' },
            { stub: 'harold-westraven', name: 'Harold' },
            { stub: 'james-endersight', name: 'James' },
            { stub: 'astrea', name: 'Astrea' },
            { stub: 'sembali-grimtongue', name: 'Sembali' },
            { stub: 'fiona-mercywind', name: 'Fiona' },
            { stub: 'xander-heartsblood', name: 'Xander' },
            { stub: 'rimea-careworn', name: 'Rimea' },
            { stub: 'orrick-gilstream', name: 'Orrick' },
            { stub: 'lulu-firststone', name: 'Lulu' }
        ];
    }
}

module.exports = Carousel;
