<template>
  <b-container>
    <b-navbar>
      <b-navbar-brand href="#">Battleship</b-navbar-brand>
      <b-navbar-nav>
        <b-nav-item v-on:click="newGame">New Game</b-nav-item>
        <b-nav-item v-on:click="listGames">Join</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="#/login">Logout</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <b-card title="Create Your Fleet">
      <b-form-group label="Ship Type">
        <b-form-select v-model="selectedShipType">
          <b-form-select-option
            v-for="shipType in shipTypes"
            :key="shipType.type"
            :value="shipType"
          >
            {{ shipType.type }}</b-form-select-option
          >
        </b-form-select>
      </b-form-group>
      <b-form-group label="Alignment">
        <b-form-radio v-model="selectedAlignment" value="horizontal"
          >horizontal</b-form-radio
        >
        <b-form-radio v-model="selectedAlignment" value="vertical"
          >vertical</b-form-radio
        >
      </b-form-group>
      <b-row>
        <b-col md="8">
          <grid
            v-bind:grid="grid"
            v-on:selected="select"
            v-on:unselected="unselect"
            v-on:clicked="setShip"
          ></grid>
        </b-col>
        <b-col md="4">
          <div v-if="shipTypes">
            <h4>Ships left to set</h4>
            <p v-for="(value, key) in shipsLeftToSet" v-bind:key="key">
              {{ key }}: {{ value }}
            </p>
            <b-button v-on:click="clear">Clear</b-button>
          </div>
        </b-col>
      </b-row>
    </b-card>
    <b-modal ref="join-modal" hide-footer title="Join a game">
      <div class="d-block text-center">
        <div v-if="availableGames.length >= 1">
          <b-form-group>
            <b-form-select v-model="selectedGame">
              <b-form-select-option            
                v-for="game in availableGames"
                :key="game.gameId"
                :value="game">
              {{ game.gameId }} / {{ game.activePlayer }}</b-form-select-option>
            </b-form-select>
          </b-form-group>
          <b-button
            class="m-1"
            variant="primary"
            @click="join"
            >Join</b-button
          >
        </div>
        <span v-if="availableGames.length < 1">No games available at the moment</span>
      </div>
    </b-modal>
  </b-container>
</template>

<script>
import Grid from "../components/Grid";
import GridModel from "../components/GridModel";
import RestResource from "../services/RestResource";

const api = new RestResource();

export default {
  name: "Fleet",

  components: {
    Grid,
  },

  data: function () {
    return {
      grid: undefined,
      shipTypes: [],
      selectedShipType: undefined,
      selectedAlignment: "horizontal",
      gameId: "",
      errorMessage: "",
      loading: false,
      shipsLeftToSet: {},
      availableGames: [],
      selectedGame: undefined,
      };
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      this.loading = true;

      api
        .getConfig()
        .then((response) => {
          this.grid = new GridModel(response.data.size);
          this.shipTypes = response.data.ships;
          this.selectedShipType = this.shipTypes[0];
          this.loading = false;

          this.initializeShipsLeftToSet();
          this.retrieveShipSetting();
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

    retrieveShipSetting() {
      var player = this.$route.params.player;

      api
        .getShips(player)
        .then((response) => {
          var shipsLeftToSet = Object.assign(this.shipsLeftToSet, {});

          for (var ship of response.data) {
            this.grid.setShip(ship.fields);
            shipsLeftToSet[ship.type]--;
          }
          this.shipsLeftToSet = shipsLeftToSet;
          this.errorMessage = "";
        })
        .catch((error) => {
          this.errorMessage = error.response.data.message;

          if (this.errorMessage.endsWith("not registered")) {
            this.logout();
          }
          this.$bvToast.toast(this.errorMessage, {
            title: "Error",
            variant: "danger",
            solid: true,
          });
        });
    },

    initializeShipsLeftToSet: function () {
      var shipsLeftToSet = {};

      for (const shipType of this.shipTypes) {
        shipsLeftToSet[shipType.type] = parseInt(shipType.count);
      }

      this.shipsLeftToSet = shipsLeftToSet;
    },

    logout: function () {
      this.$router.push("/");
    },

    listGames: function () {
      api
        .listGames()
        .then((response) => {
          if (response.data) {
            this.availableGames = response.data;
            this.selectedGame = response.data[0];
          }
          this.$refs['join-modal'].show()
        })
        .catch((error) => {
          console.log(error);
        });
    },

    newGame: function () {
      const player = this.$route.params.player;

      api
        .startNewGame(player)
        .then((response) => {
          var gameId = response.data.id;

          this.$router.push(`/${player}/game/${gameId}`);
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

    join: function () {
      const player = this.$route.params.player;
      const gameId = this.selectedGame.gameId;

      api
        .join(gameId, player)
        .then(() => {
          this.$router.push(
            `/${this.$route.params.player}/game/${gameId}`
          );
        })
        .catch((error) => {
          this.errorMessage = error.response.data.message;
          this.$bvToast.toast(this.errorMessage, {
            title: "Error",
            variant: "danger",
            solid: true,
          });
        });

        this.$refs['join-modal'].hide()
    },

    clear: function () {
      const player = this.$route.params.player;

      api
        .clearFleet(player)
        .then(() => {
          this.grid.clear();
          this.errorMessage = "";
          this.initializeShipsLeftToSet();
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

    setShip: function (x, y) {
      const player = this.$route.params.player;
      const row = this.charCodeOf(y);
      const column = x + 1;

      api
        .setShip(
          player,
          row,
          column,
          this.selectedShipType.type,
          this.selectedAlignment
        )
        .then((response) => {
          var shipsLeftToSet = Object.assign(this.shipsLeftToSet, {});

          this.grid.setShip(response.data.fields);
          shipsLeftToSet[this.selectedShipType.type]--;
          this.errorMessage = "";

          this.shipsLeftToSet = shipsLeftToSet;
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

    select: function (x, y) {
      var fields = this.getSelectableFields(x, y);

      fields.forEach((field) => field.select());
    },

    unselect: function (x, y) {
      var fields = this.getSelectableFields(x, y);

      fields.forEach((field) => field.unselect());
    },

    getSelectableFields: function (x, y) {
      var fields = [];

      if (this.selectedAlignment === "horizontal") {
        fields = this.grid.getHorizonalFields(x, y, this.selectedShipType.size);
      } else {
        fields = this.grid.getVerticalFields(x, y, this.selectedShipType.size);
      }

      return fields;
    },
  },
};
</script>

<style scoped>
table {
  border-collapse: collapse;
  table-layout: fixed;
}
.header {
  width: 50px;
  text-align: center;
}
.toolbar-button {
  color: white;
  float: left;
}
</style>