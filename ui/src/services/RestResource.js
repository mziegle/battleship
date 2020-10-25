const URL = "http://localhost:8888";
const axios = require("axios").default;

export default class RestResource {
    register(username, password) {
        return axios({
            method: "post",
            url: `${URL}/players`,
            data: {
                name: username,
                password: password,
            },
        });
    }

    login(username, password) {
        var result = axios({
            method: "post",
            url: `${URL}/login`,
            data: {
                name: username,
                password: password,
            },
        }).then(() => {
            var user = {username: username};
    
            user.authdata = window.btoa(username + ':' + password);
            localStorage.setItem('user', JSON.stringify(user));
        });
        
        return result;
    }

    getShips(player) {
        return axios({
            method: 'get',
            url: `${URL}/players/${player}/sea/ships`,
            headers: this.buildAuthenticationHeader(),
        });
    }

    startNewGame(player) {
        return axios({
            method: 'post',
            url: `${URL}/games`,
            data: {
                player: player,
            },
            headers: this.buildAuthenticationHeader(),
        });
    }

    getConfig() {
        return axios({
            method: 'get',
            url: `${URL}/config`,
            headers: this.buildAuthenticationHeader(),
        });
    }

    listGames() {
        return axios({
            method: 'get',
            url: `${URL}/games`,
            headers: this.buildAuthenticationHeader(),
        });
    }

    join(gameId, player) {
        return axios({
            method: "patch",
            url: `${URL}/games/${gameId}`,
            data: {
                player: player,
            },
            headers: this.buildAuthenticationHeader(),
        });
    }

    clearFleet(player) {
        return axios({
            method: "delete",
            url: `${URL}/players/${player}/sea/ships`,
            headers: this.buildAuthenticationHeader(),
        });
    }

    setShip(player, row, column, type, alignment) {
        return axios({
            method: "put",
            url: `${URL}/players/${player}/sea/${row}/${column}`,
            data: {
                shipType: type,
                alignment: alignment,
            },
            headers: this.buildAuthenticationHeader(),
        })
    }

    fireAt(gameId, target, row, column) {
        return axios({
            method: "delete",
            url: `${URL}/games/${gameId}/${target}/sea/${row}/${column}`,
            headers: this.buildAuthenticationHeader(),
        })
    }

    getState(gameId) {
        return axios({
            method: "get",
            url: `${URL}/games/${gameId}/state`,
            headers: this.buildAuthenticationHeader(),
        })
    }

    quitGame(gameId) {
        return axios({
            method: "delete",
            url: `${URL}/games/${gameId}`,
            headers: this.buildAuthenticationHeader(),
        });
    }

    getBombedFields(gameId, player) {
        return axios({
            method: "get",
            url: `${URL}/games/${gameId}/${player}/sea`,
            headers: this.buildAuthenticationHeader(),
        });
    }

    buildAuthenticationHeader() {
        // return authorization header with basic auth credentials
        let user = JSON.parse(localStorage.getItem('user'));

        if (user && user.authdata) {
            return { 'Authorization': 'Basic ' + user.authdata };
        } else {
            return {};
        }
    }
}