const AbilityResolver = require('./abilityresolver.js');
const SimpleStep = require('./simplestep.js');

class NoCostsAbilityResolver extends AbilityResolver {
    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.createSnapshot()),
            new SimpleStep(this.game, () => this.resolveTargets()),
            new SimpleStep(this.game, () => this.initiateAbility())
            // new SimpleStep(this.game, () => this.executeHandler())
        ]);
    }
}
exports.NoCostsAbilityResolver = NoCostsAbilityResolver;
