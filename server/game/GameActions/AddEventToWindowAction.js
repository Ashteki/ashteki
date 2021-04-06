const GameAction = require('./GameAction');

class AddEventToWindowAction extends GameAction {
    setDefaultProperties() {
        this.eventToAdd = null;
        this.targetEvent = null;
        this.subEvent = false;
    }

    hasLegalTarget(context) {
        this.update(context);
        return this.targetEvent && !!this.eventToAdd;
    }

    getEventArray() {
        return [
            super.createEvent(
                'unnamedEvent',
                { targetEvent: this.targetEvent, eventToAdd: this.eventToAdd },
                (event) => {
                    this.subEvent
                        ? event.targetEvent.addSubEvent(event.eventToAdd)
                        : event.targetEvent.addChildEvent(event.eventToAdd);
                }
            )
        ];
    }
}

module.exports = AddEventToWindowAction;
