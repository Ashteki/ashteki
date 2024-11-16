const AspectCard = require("../../../solo/AspectCard");

class SkeletalWall extends AspectCard {
    setupCardAbilities(ability) {
        super.setupCardAbilities(ability);
        this.defender();

        this.destroyed({
            gameAction: ability.actions.summon({
                conjuration: 'rainwalker',
                count: 2
            })
        });
    }

}

SkeletalWall.id = 'skeletal-wall';

module.exports = SkeletalWall;
