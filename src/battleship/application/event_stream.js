class EventStream {
    constructor() {
        this.events = []
        this.subscribers = [];
    }

    publish(event) {
        this.events.push(event);
        this.subscribers.forEach(onEvent => onEvent(event));
    }

    subscribe(onEvent) {
        this.events.forEach(event => onEvent(event));
        this.subscribers.push(onEvent);
    }
}

module.exports = {
    EventStream: EventStream,
}