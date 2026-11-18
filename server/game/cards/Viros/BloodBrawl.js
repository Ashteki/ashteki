const Card = require('../../Card.js');

class BloodBrawl extends Card {
    getDamageAmount = (context) => {
        const sum = context.player.unitsInPlay.reduce((partialSum, u) => partialSum + u.damage, 0);
        return sum;
    };

    setupCardAbilities(ability) {
        this.play({
            title: 'Blood Brawl',
            effect: 'deal 1 damage to a unit {1} times',
            effectArgs: (context) => this.getDamageAmount(context),
            condition: (context) => this.getDamageAmount(context) > 0,
            then: (context) => ({
                ...this.getTargettedAbilityChain(ability, this.getDamageAmount(context))
            })
        });
    }
}

BloodBrawl.id = 'blood-brawl';

module.exports = BloodBrawl;
