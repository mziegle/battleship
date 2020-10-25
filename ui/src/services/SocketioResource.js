import io from 'socket.io-client';

let socket;

export function subscribe(gameId, onEvent, onDisconnect) {
    socket = io('http://localhost:8888');
    socket.on('connect', () => {
        socket.emit('subscribe', { 'gameId': gameId });
    });
    socket.on('game', (event) => {
        onEvent(event);
    });
    socket.on('disconnect', (reason) => {
        onDisconnect(reason);
        console.log('disconnected');
        socket.close();
    });
}

export function unsubscribe(gameId) {
    if (socket.connected) {
        socket.emit('leave', { 'gameId': gameId });
        socket.close();
    }
}