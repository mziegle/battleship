<template>
  <b-container>
    <b-navbar>
      <b-navbar-brand href="#">Battleship</b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item v-on:click="leave">Leave</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="#/login">Logout</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <b-row>
      <b-col>
        <b-card title="Your sea">
          <grid v-bind:grid="grid"></grid>
        </b-card>
      </b-col>
      <b-col>
        <b-card v-if="!running" title="Waiting for other player">
        </b-card>
        <b-card v-if="running" :title="opponentName">
          <grid
            v-bind:grid="opponentsGrid"
            v-on:selected="select"
            v-on:unselected="unselect"
            v-on:clicked="fire"
          ></grid>
        </b-card>
      </b-col>
    </b-row>
    <b-row>
      <b-col class="text-center">
        <div v-if="!winner && opponentName">
          <div v-if="yourTurn">
            <b-spinner variant="success" type="grow" label="Spinning"></b-spinner>
            <span>It's your turn</span>
          </div>
          <div v-if="!yourTurn" class="text-center">
            <b-spinner variant="danger" type="grow" label="Spinning"></b-spinner>
            <span>Waiting for {{ opponentName }}</span>
          </div>
        </div>
        <div v-if="winner">
          <span>Game is over! Winner is {{ winner }}</span>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import RestResource from "../services/RestResource";
import GridModel from "../components/GridModel";
import Grid from "../components/Grid";
import { subscribe, unsubscribe } from "../services/SocketioResource";

const api = new RestResource();

export default {
  name: "Play",

  components: {
    Grid,
  },

  data: function () {
    return {
      grid: new GridModel(10),
      opponentsGrid: new GridModel(10),
      opponentName: "",
      running: false,
      errorMessage: "",
      yourTurn: false,
      winner: undefined,
    };
  },

  mounted: function () {
    const player = this.$route.params.player;
    const gameId = this.$route.params.gameId;

    api
      .getShips(player)
      .then((response) => {
        for (var ship of response.data) {
          this.grid.setShip(ship.fields);
        }
        this.errorMessage = "";
      })
      .catch((error) => {
        this.errorMessage = error.response.data.message;
      });

    this.updateBombedFields(this.grid, player);
    subscribe(gameId, this.onEvent, this.onDisconnect);
  },

  beforeDestroy: function () {
    const gameId = this.$route.params.gameId;

    unsubscribe(gameId);
  },

  methods: {
    leave: function () {
      const gameId = this.$route.params.gameId;

      api.quitGame(gameId).then(() => {
        this.$router.push(`/${this.$route.params.player}/fleet`);
      });
    },

    onEvent(event) {
      const me = this.$route.params.player;

      switch (event.type) {
        case 'GameStarted': {
          if (event.body.activePlayer === me) {
            this.opponentName = event.body.inactivePlayer;
            this.yourTurn = true;
          } else {
            this.opponentName = event.body.activePlayer;
            this.yourTurn = false;
          }
          this.updateBombedFields(this.opponentsGrid, this.opponentName);
          this.running = true;
          break;
        }
        case 'ShipSunk':
        case 'ShipHit': {
          if (event.body.target === me) {
            this.grid.hit(event.body.field);
          }
          break;
        }
        case 'ActivePlayerSwitched': {
          if (event.body.activePlayer === me) {
            this.yourTurn = true;
          } else {
            this.yourTurn = false;
          }
          break
        }
        case 'GameWon':
          this.winner = event.body.winner;
          break;
      }
      console.log(event);
    },

    onDisconnect(reason) {
      console.log(reason);
    },

    updateBombedFields(grid, player) {
      const gameId = this.$route.params.gameId;

      api
        .getBombedFields(gameId, player)
        .then((response) => {
          const misses = response.data.misses;

          misses.forEach((field) => {
            grid.miss(field);
          });

          const hits = response.data.hits;

          hits.forEach((field) => {
            grid.hit(field);
          });
        })
        .catch((error) => {
          this.errorMessage = error.response.data.message;
        });
    },

    select: function (x, y) {
      this.opponentsGrid.getField(x, y).select();
    },

    unselect: function (x, y) {
      this.opponentsGrid.getField(x, y).unselect();
    },

    fire: function (x, y) {
      var gameId = this.$route.params.gameId;
      var target = this.opponentName;
      var row = this.charCodeOf(y);
      var column = x + 1;

      api
        .fireAt(gameId, target, row, column)
        .then((response) => {
          switch (response.data.result) {
            case "water":
              this.opponentsGrid.getField(x, y).water();
              break;
            case "hit":
            case "sunk":
              this.opponentsGrid.getField(x, y).hit();
              break;
          }
          this.errorMessage = "";
        })
        .catch((error) => {
          this.errorMessage = error.response.data.message;
          this.$bvToast.toast(this.errorMessage, {
            title: "Error",
            variant: "danger",
            solid: true,
          });
        });
    },

    charCodeOf(index) {
      return String.fromCharCode("A".charCodeAt(0) + index);
    },
  },
};
</script>

<style>
</style>