class EventStream {
    constructor() {
        this.events = []
    }

    publish(event) {
        this.events.push(event);
    }
}

module.exports = {
    EventStream: EventStream,
}